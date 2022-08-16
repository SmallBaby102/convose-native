/* eslint-disable react-perf/jsx-no-new-object-as-prop */
/* eslint-disable react-perf/jsx-no-new-array-as-prop */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react"
import { noop } from "rxjs"
import { withSafeAreaInsets } from "react-native-safe-area-context"
import {
  ChatChannel,
  ChatUser,
  createChatInfoText,
  Message,
  MessageType,
  createChatIdleText,
  ChatSummary,
  MessageToPublish,
  selectRetrievingHistory,
  selectPagesLeft,
  selectActualPage,
  ChatAction,
  selectUnreadMentions,
  DeleteMessageTypes,
  selectDeletedMessagesCount,
} from "convose-lib/chat"
import { UserInterest, InterestLocation } from "convose-lib/interests"
import { selectUserActive, selectUserInterests, Uuid } from "convose-lib/user"
import {
  DEFAULT_HIT_SLOP,
  filterMessages,
  MESSAGE_LIMIT,
} from "convose-lib/utils"
import {
  appHeaderHeight,
  chatInputBarHeight,
  color,
  height,
  statusBarHeight,
} from "convose-styles"
import MaskedView from "@react-native-masked-view/masked-view"
import { LinearGradient } from "expo-linear-gradient"
import { FlatList } from "@stream-io/flat-list-mvcp"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import { State } from "convose-lib"
import { Keyboard, Platform } from "react-native"
import { SafeAreaProps } from "convose-lib/generalTypes"
import { withKeyboard } from "convose-lib/utils/useKeyboard"
import {
  checkForNewMassages,
  checkIsNotSameSenderWithDownMsg,
  checkIsSameSenderWithDownMsg,
  checkIsSameSenderWithUpMsg,
} from "./utils"
import {
  CommonInterests,
  CommonInterestsList,
  MainChatWrapper,
  RetrievingHistoryText,
  Blank,
  ButtonWrapper,
  Label,
  MessageListFooter,
} from "./Styled"
import { ChatInfo, IconButton, InterestButton } from "../../components"
import ChatMessageWrapper from "./ChatMessageWrapper"

const FlatListStyle = {
  marginBottom: chatInputBarHeight,
  height: height - chatInputBarHeight,
  scaleY: -1,
}
const maskViewLocations = [0, 0.2]
const maskedViewStyle = {
  height: "100%",
  width: "100%",
  flexGrow: 0,
}
type Messages = ReadonlyArray<Message | MessageToPublish>
type ChatMessageListProps = {
  readonly chatChannel: ChatChannel
  readonly chatUser: ChatUser | null
  chatSummary: ChatSummary | null | undefined
  participants: ChatUser[]
  readonly getHistory: (
    chatChannel: ChatChannel,
    page: number,
    size: number
  ) => void
  readonly deleteMessage: (message: Message) => void
  readonly isGroup: boolean
  readonly markAsRead: (chatChannel: ChatChannel) => void
  readonly messages: Messages
  readonly myUuid: Uuid
  readonly isInCallingChat: boolean | undefined
  readonly callingFullScreenMode: boolean
  readonly me: ChatUser
  readonly setFullScreenImage: (uri: { uri: string } | undefined) => void
  readonly setMessageListRef: (element: any) => void
}

type StateToProps = {
  readonly retrievingHistory: boolean
  readonly actualPage: number
  readonly pagesLeft: number
  readonly interests: ReadonlyArray<UserInterest>
  readonly unreadMentions: ReadonlyArray<string>
  readonly userActive: boolean
  readonly deletedMessagesCount: number
}

type DispatchToProps = {
  readonly markMentionAsRead: (
    chatChannel: ChatChannel,
    mention: string
  ) => void
  readonly markAllMentionsAsRead: (chatChannel: ChatChannel) => void
}

type ChatMessageListState = {
  hasNewMessage: boolean
  firstPageMentionReady: boolean
  audioQueue: string[]
  currentAudioUUID: string
  isKeyboardJustClosed: boolean
}
const newMsgRenderThreshold = 30
const maskElementStyle = { width: "100%", height: "100%" }
const contentPosition = {
  autoscrollToTopThreshold: 10,
  minIndexForVisible: 1,
}
const mentionButtonPosition = 0.5
// (height - appHeaderHeight + statusBarHeight - 60) / height
type Keyboard = {
  keyboardHeight?: number
}
type AllProps = ChatMessageListProps &
  StateToProps &
  DispatchToProps &
  DeleteMessageTypes &
  SafeAreaProps &
  Keyboard

class ChatMessageListComponent extends React.Component<
  AllProps,
  ChatMessageListState
> {
  public scrollViewRef: any

  public readonly state: ChatMessageListState = {
    hasNewMessage: false,
    firstPageMentionReady: false,
    audioQueue: [],
    currentAudioUUID: "",
    isKeyboardJustClosed: false,
  }

  private scrollYposition = 0

  private shouldStartToDetectMention = true

  private canMarkMentions = false

  private viewabilityConfig = {
    minimumViewTime: 300,
    viewabilityThreshold: 100,
    viewAreaCoveragePercentThreshold: 100,
  }

  public constructor(props: AllProps) {
    super(props)
    props.setMessageListRef(this)
  }

  // eslint-disable-next-line complexity
  public shouldComponentUpdate(
    prevProps: AllProps,
    prevState: ChatMessageListState
  ): boolean {
    const {
      messages,
      callingFullScreenMode,
      isInCallingChat,
      unreadMentions,
      userActive,
      me,
      selectedMessageUUID,
      deletedMessagesCount,
      keyboardHeight,
    } = this.props
    const {
      hasNewMessage,
      firstPageMentionReady,
      audioQueue,
      currentAudioUUID,
    } = this.state

    const { detectedNewMessage, lastMessageIsNotMine } = checkForNewMassages(
      prevProps.messages,
      messages,
      me.uuid
    )
    this.setShouldStartToDetectMention(userActive, prevProps.userActive)
    if (
      detectedNewMessage &&
      lastMessageIsNotMine &&
      this.scrollYposition > newMsgRenderThreshold
    ) {
      this.setState({ hasNewMessage: detectedNewMessage })
    }
    return (
      prevProps.deletedMessagesCount !== deletedMessagesCount ||
      detectedNewMessage ||
      prevProps.messages.length !== messages.length ||
      hasNewMessage !== prevState.hasNewMessage ||
      callingFullScreenMode !== prevProps.callingFullScreenMode ||
      isInCallingChat !== prevProps.isInCallingChat ||
      prevProps.unreadMentions.length !== unreadMentions.length ||
      prevState.firstPageMentionReady !== firstPageMentionReady ||
      prevState.audioQueue !== audioQueue ||
      prevState.currentAudioUUID !== currentAudioUUID ||
      prevProps.selectedMessageUUID !== selectedMessageUUID ||
      prevProps.keyboardHeight !== keyboardHeight
    )
  }

  public componentDidUpdate(prevProps: AllProps) {
    const { messages, keyboardHeight } = this.props
    if (
      prevProps.messages.length !== messages.length &&
      this.shouldStartToDetectMention
    )
      this.scrollAndMarkFirstPage()
    if (!!prevProps.keyboardHeight && !keyboardHeight) {
      this.setKeyboardJustClosedChanges(true)
    }
    if (!prevProps.keyboardHeight && !!keyboardHeight) {
      this.setKeyboardJustClosedChanges(false)
    }
  }

  public setKeyboardJustClosedChanges = (
    isKeyboardJustClosed: boolean
  ): void => {
    this.setState({
      isKeyboardJustClosed,
    })
  }

  private setShouldStartToDetectMention(
    userActive: boolean,
    nextUserActive: boolean
  ) {
    if (userActive && !nextUserActive) {
      this.canMarkMentions = false
      this.shouldStartToDetectMention = false
      this.setState({ firstPageMentionReady: false })
    }

    if (!userActive && nextUserActive) {
      this.shouldStartToDetectMention = true
    }
  }

  private readonly renderCommonInterests = () => {
    const { chatUser, pagesLeft, retrievingHistory, insets } = this.props
    const interests = chatUser?.interests
    // eslint-disable-next-line react/destructuring-assignment
    const myInterests = this.props.interests

    const commonInterests = interests
      ? interests
          .filter((interest: UserInterest) =>
            myInterests.find(({ name }) => name === interest.name)
          )
          .map((interest: UserInterest) => (
            <InterestButton
              key={interest.name}
              interest={interest}
              disabled
              interestLocation={InterestLocation.Chatbox}
            />
          ))
      : []

    return pagesLeft === 0 && !retrievingHistory && commonInterests.length ? (
      <CommonInterests>
        <Blank topInsets={insets?.top} />
        <ChatInfo text="Common interests:" />
        <CommonInterestsList>{commonInterests}</CommonInterestsList>
      </CommonInterests>
    ) : (
      <Blank topInsets={insets?.top} />
    )
  }

  private readonly renderUnreadButton = ({
    isNewMessageButton,
  }: {
    isNewMessageButton: boolean
  }): React.ReactNode => {
    const { markAllMentionsAsRead, chatChannel } = this.props
    const lableText = isNewMessageButton
      ? "New unread messages"
      : "unread @mentions"
    const iconName = isNewMessageButton ? "md-chevron-down" : "md-chevron-up"
    const pressFunction = isNewMessageButton
      ? this.scrollToEnd
      : this.scrollToMention
    const top = isNewMessageButton ? 0 : appHeaderHeight + statusBarHeight + 10
    return (
      <ButtonWrapper
        onPress={() => pressFunction()}
        hitSlop={DEFAULT_HIT_SLOP}
        top={top}
      >
        <IconButton name={iconName} size={22} iconColor={color.white} />
        <Label>{lableText}</Label>
        {!isNewMessageButton && (
          <IconButton
            name="md-close-sharp"
            size={22}
            iconColor={color.white}
            onPress={() => markAllMentionsAsRead(chatChannel)}
          />
        )}
      </ButtonWrapper>
    )
  }

  private readonly keyExtract = (item: Message | MessageToPublish): string => {
    return item.uuid
  }

  private setScrollViewRefRef = (element: any) => {
    this.scrollViewRef = element
  }

  private readonly handleOnEndReached = () => {
    const {
      actualPage,
      chatChannel,
      getHistory,
      pagesLeft,
      retrievingHistory,
    } = this.props

    // TODO: Check this login about retrieving history again!!
    if (!retrievingHistory && pagesLeft > 0) {
      getHistory(chatChannel, actualPage + 1, MESSAGE_LIMIT)
    }
  }

  private readonly scrollToEnd = (timeout?: number) => {
    const { chatChannel, markAsRead, messages } = this.props
    const messagesLength = filterMessages(messages).length

    if (messagesLength > 0) {
      markAsRead(chatChannel)
      setTimeout(() => {
        this.scrollViewRef && this.scrollViewRef.scrollToIndex({ index: 0 })
        this.scrollYposition = 0
        this.setState({ hasNewMessage: false })
      }, timeout || 0)
    }
  }

  private readonly scrollAndMarkFirstPage = () => {
    setTimeout(() => {
      this.canMarkMentions = true
      this.shouldStartToDetectMention = false
    }, 4000)
    setTimeout(() => {
      this.scrollViewRef &&
        this.scrollViewRef.scrollToOffset({
          offset: this.scrollYposition + 0.5,
        })
    }, 4100)
  }

  private scrollToIndexFailed = (error: any): void => {
    const offset = error.averageItemLength * error.index
    this.scrollViewRef.scrollToOffset({ offset })
    setTimeout(
      () => this.scrollViewRef.scrollToIndex({ index: error.index }),
      100
    )
  }

  private readonly scrollToMention = () => {
    const {
      unreadMentions,
      messages,
      chatChannel,
      markMentionAsRead,
    } = this.props
    const messagesList = filterMessages(messages).reverse()
    const mentionIndex =
      unreadMentions.length > 0
        ? messagesList.findIndex(
            (message) => message.uuid === unreadMentions[0]
          )
        : -1
    if (mentionIndex >= 0) {
      markMentionAsRead(chatChannel, unreadMentions[0])

      setTimeout(() => {
        this.scrollViewRef &&
          this.scrollViewRef.scrollToIndex({
            index: mentionIndex,
            viewPosition: mentionButtonPosition,
          })
      }, 0)
    }
  }

  private readonly handleScroll = (event: any) => {
    const { hasNewMessage } = this.state
    const { y } = event.nativeEvent.contentOffset
    this.scrollYposition = y
    if (y < newMsgRenderThreshold && hasNewMessage) {
      this.setState({ hasNewMessage: false })
    }
  }

  private readonly handleViewableItemsChange = ({ viewableItems }: any) => {
    const {
      messages,
      unreadMentions,
      chatChannel,
      markMentionAsRead,
      userActive,
    } = this.props
    const { firstPageMentionReady } = this.state
    if (
      userActive &&
      this.canMarkMentions &&
      viewableItems &&
      viewableItems.length > 0 &&
      unreadMentions.length > 0
    ) {
      const topViewableItemIndex =
        viewableItems[Math.round(viewableItems.length / 2)]?.index
      if (!topViewableItemIndex) return
      const messagesList = filterMessages(messages).reverse()
      const toBeMarkedMentions =
        unreadMentions.length > 0
          ? unreadMentions.filter((mention: string) => {
              const mentionIndex = messagesList.findIndex(
                (message) => message.uuid === mention
              )
              return mentionIndex >= 0 && mentionIndex <= topViewableItemIndex
            })
          : []
      toBeMarkedMentions.forEach((mention: string) =>
        markMentionAsRead(chatChannel, mention)
      )
      !firstPageMentionReady &&
        setTimeout(() => this.setState({ firstPageMentionReady: true }), 500)
    }
  }

  private readonly renderListFooter = (): React.ReactElement => {
    const { messages, pagesLeft } = this.props
    const messagesLength = messages.length
    const renderRetrievingHistory = (
      <RetrievingHistoryText>Retrieving History ...</RetrievingHistoryText>
    )
    const renderNoHistory = messagesLength > 0 && (
      <RetrievingHistoryText>No More Messages</RetrievingHistoryText>
    )

    return (
      <MessageListFooter>
        {this.renderCommonInterests()}
        {pagesLeft > 0 ? renderRetrievingHistory : renderNoHistory}
      </MessageListFooter>
    )
  }

  public readonly createAudioQueue = (messages: Messages): string[] => {
    const audioQueue = []
    let index = 0
    while (index < messages.length) {
      const message = messages[index]
      if (message.type === "audio") {
        audioQueue.push(message.uuid)
      } else {
        break
      }
      index += 1
    }
    return audioQueue
  }

  public readonly getMessagesAfterCurrentPlayingAudio = (
    uuid: string
  ): Messages => {
    const { messages } = this.props
    const currentPlayingAudioIndex = messages.findIndex(
      (message) => message.uuid === uuid
    )
    return messages.slice(currentPlayingAudioIndex + 1)
  }

  public readonly requestPlay = (uuid: string): void => {
    const messagesAfterCurrentPlayingAudio = this.getMessagesAfterCurrentPlayingAudio(
      uuid
    )
    const audioQueue = this.createAudioQueue(messagesAfterCurrentPlayingAudio)
    this.setState({ audioQueue, currentAudioUUID: uuid })
  }

  public readonly prepareNextAudioToPlay = (): void => {
    const { audioQueue } = this.state
    const [nextAudioUUID, ...newAudioQueue] = audioQueue
    if (!nextAudioUUID) {
      this.setState({
        currentAudioUUID: "",
        audioQueue: [],
      })
      return
    }
    this.setState({
      currentAudioUUID: nextAudioUUID,
      audioQueue: newAudioQueue,
    })
  }

  public readonly requestStop = (pause: boolean): void => {
    if (pause) {
      return
    }
    this.prepareNextAudioToPlay()
  }

  private readonly renderMessage = ({
    item,
    index,
  }: {
    readonly item: Message | MessageToPublish
    readonly index: number
  }): React.ReactElement => {
    const {
      messages,
      isGroup,
      me,
      isInCallingChat,
      participants,
      setFullScreenImage,
      deleteMessage,
      selectMessage,
      dismissSelectedMessage,
      selectedMessageUUID,
    } = this.props
    const { uuid } = item
    const { currentAudioUUID } = this.state
    const shouldPlay = currentAudioUUID === uuid
    const shouldLoad = false

    const isSystemMessage = item.type === MessageType.System
    const isCallStatusMessage = item.type === MessageType.Call
    const messagesList = filterMessages(messages).reverse()
    const chatInfoText = createChatInfoText(item, messagesList[index + 1])
    const chatTimeText = createChatIdleText(item, messagesList[index + 1])
    const isSameSenderWithUpMsg = checkIsSameSenderWithUpMsg(
      item,
      messagesList[index + 1]
    )
    const isFirstMessage = !isSameSenderWithUpMsg
    const hasNextMessage =
      isFirstMessage &&
      checkIsSameSenderWithDownMsg(item, messagesList[index - 1])
    const isLastMessage =
      isSameSenderWithUpMsg &&
      checkIsNotSameSenderWithDownMsg(item, messagesList[index - 1])

    return (
      <ChatMessageWrapper
        message={item}
        isInCallingChat={isInCallingChat}
        chatInfoText={chatInfoText}
        chatTimeText={chatTimeText}
        isSystemMessage={isSystemMessage}
        isCallStatusMessage={isCallStatusMessage}
        isFirstMessage={isFirstMessage}
        isLastMessage={isLastMessage}
        hasNextMessage={hasNextMessage}
        isSameSenderWithUpMsg={isSameSenderWithUpMsg}
        isGroup={isGroup}
        me={me}
        participants={participants}
        deleteMessage={deleteMessage}
        setFullScreenImage={setFullScreenImage}
        requestPlay={this.requestPlay}
        shouldPlay={shouldPlay}
        shouldLoad={shouldLoad}
        requestStop={this.requestStop}
        dismissSelectedMessage={dismissSelectedMessage}
        selectMessage={selectMessage}
        selectedMessageUUID={selectedMessageUUID}
      />
    )
  }

  public handleListScroll = (): void => {
    const { dismissSelectedMessage, selectedMessageUUID } = this.props
    const { isKeyboardJustClosed } = this.state

    if (isKeyboardJustClosed && !!selectedMessageUUID) {
      this.setKeyboardJustClosedChanges(false)
      return
    }
    Keyboard.dismiss()
    dismissSelectedMessage()
  }

  // eslint-disable-next-line complexity
  public render(): React.ReactNode {
    const {
      messages,
      isInCallingChat,
      callingFullScreenMode,
      unreadMentions,
      keyboardHeight,
    } = this.props
    const { hasNewMessage, firstPageMentionReady } = this.state
    const filteredMessages = filterMessages(messages)
    return (
      <MainChatWrapper
        isInCallingChat={isInCallingChat}
        callingFullScreenMode={callingFullScreenMode}
        keyboardHeight={keyboardHeight}
      >
        <MaskedView
          style={maskedViewStyle}
          maskElement={
            <LinearGradient
              colors={[
                isInCallingChat ? color.transparent : color.white,
                color.white,
              ]}
              style={maskElementStyle}
              locations={maskViewLocations}
            />
          }
        >
          <FlatList
            removeClippedSubviews
            style={FlatListStyle}
            data={filteredMessages.reverse()}
            ref={this.setScrollViewRefRef}
            keyExtractor={this.keyExtract}
            viewabilityConfig={this.viewabilityConfig}
            inverted={Platform.OS === "ios"}
            onScrollToIndexFailed={noop}
            onEndReached={this.handleOnEndReached}
            onEndReachedThreshold={0.01}
            renderItem={this.renderMessage}
            ListFooterComponent={this.renderListFooter()}
            ListEmptyComponent={
              <MessageListFooter>
                <RetrievingHistoryText>
                  {" "}
                  Let & apos; s chat!
                </RetrievingHistoryText>
              </MessageListFooter>
            }
            initialNumToRender={50}
            maxToRenderPerBatch={50}
            updateCellsBatchingPeriod={150}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            onScrollEndDrag={this.handleScroll}
            onMomentumScrollEnd={this.handleScroll}
            onViewableItemsChanged={this.handleViewableItemsChange}
            maintainVisibleContentPosition={contentPosition}
            scrollEventThrottle={100}
            onScrollBeginDrag={this.handleListScroll}
            keyboardShouldPersistTaps="handled"
          />
        </MaskedView>

        {hasNewMessage &&
          this.scrollYposition > newMsgRenderThreshold &&
          filteredMessages.length > 0 &&
          this.renderUnreadButton({ isNewMessageButton: true })}
        {unreadMentions.length > 0 &&
          firstPageMentionReady &&
          this.renderUnreadButton({ isNewMessageButton: false })}
      </MainChatWrapper>
    )
  }
}

const mapStateToProps = (
  state: State,
  ownProps: ChatMessageListProps
): StateToProps => ({
  retrievingHistory: selectRetrievingHistory(state),
  actualPage: selectActualPage(ownProps.chatChannel)(state) || 0,
  pagesLeft: selectPagesLeft(ownProps.chatChannel)(state) || 0,
  interests: selectUserInterests(state),
  unreadMentions: selectUnreadMentions(ownProps.chatChannel)(state) || [],
  userActive: selectUserActive(state),
  deletedMessagesCount: selectDeletedMessagesCount(state),
})

const mapDispatchToProps = (
  dispatch: Dispatch<ChatAction>
): DispatchToProps => ({
  markMentionAsRead: (channel: ChatChannel, mention: string) =>
    dispatch(ChatAction.markMentionAsRead(channel, mention)),
  markAllMentionsAsRead: (channel: ChatChannel) =>
    dispatch(ChatAction.markAllMentionsAsRead(channel)),
})
// ChatMessageListComponent.whyDidYouRender = {
//   logOnDifferentValues: false,
//   customName: "ChatMessageListComponent",
//   diffNameColor: "red",
// }
export default withSafeAreaInsets(
  withKeyboard(
    connect(mapStateToProps, mapDispatchToProps)(ChatMessageListComponent)
  )
)
