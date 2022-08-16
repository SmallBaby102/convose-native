/* eslint-disable radix */

import { Audio } from "expo-av"
import * as React from "react"
import {
  Keyboard,
  TextInput,
  KeyboardEvent,
  Platform,
  StyleSheet,
  EmitterSubscription,
} from "react-native"
import { withSafeAreaInsets } from "react-native-safe-area-context"
import { activateKeepAwake, deactivateKeepAwake } from "expo-keep-awake"
import {
  //  Emoticons,
  parse,
  EmojiSearcher,
  emojiData,
  conciseData,
  emojiShortcuts,
} from "react-native-emoticons"
import { BehaviorSubject, Subscription } from "rxjs"
import {
  debounceTime,
  distinctUntilChanged,
  throttleTime,
} from "rxjs/operators"
import {
  ChatChannel,
  ChatUser,
  MessageToPublish,
  MessageType,
} from "convose-lib/chat"
import { Uuid } from "convose-lib/user"
import {
  getRNAndroidAudioPermission,
  millisToMinutesAndSeconds,
  permissionNotAllowed,
  quickUuid,
  startRecordingAudio,
  millisToMinutesAndSecondsToMillis,
  stopRecordingAudio,
  chooseImage,
  takePicture,
  getAudioRecordingPermission,
} from "convose-lib/utils"
import _ from "lodash"

import { color } from "convose-styles"
import { withTheme } from "styled-components"
import { SafeAreaProps } from "convose-lib/generalTypes"
import {
  AudioFormWrapper,
  ChatInputBar,
  SquareButton,
  TimerText,
  ExtraTimerText,
  RecordingIndicatorWrapper,
  Icon,
  IconWrapper,
  StyledInput,
  MarginRight,
  IconButtonWrapper,
} from "./Styled"
import { RenderSuggestions } from "./ChatMessageFormSearcher"
import { replaceMentionValues } from "../../../../self-maintained-packages/react-native-controlled-mentions/src"

type ChatMessageFormProps = {
  readonly channel: ChatChannel
  readonly publishMessage: (
    message: MessageToPublish,
    channel: ChatChannel
  ) => void
  readonly myUuid: Uuid
  readonly setDisplayMessage: (message: MessageToPublish) => void
  readonly isInCallingChat: boolean
  readonly me: ChatUser
  readonly participants: ChatUser[]
  readonly setIsPickingImage: (isPickingImage: boolean) => void
  readonly setIsTakingImage: (isTakingImage: boolean) => void
  readonly fetchUnreadMsgAndPartner: () => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly theme: any
  readonly inputFormHeight: number
  readonly setInputFormHeight: (height: number) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly messageListRef: any
}

type ChatMessageFormState = {
  readonly autoCorrect: boolean
  // readonly callEmoticons: boolean
  readonly keyboardIsShown: boolean
  // readonly showEmoticons: boolean
  readonly value: string
  readonly isInputFocused: boolean
  readonly audioRecord: Audio.Recording | null
  readonly recordingTime: number
  readonly isRecording: boolean
  readonly showEmojiSearcher: boolean
  readonly emojiResult: emoji[]
  readonly emojiResultCache: emoji[]
  readonly permissionGranted: boolean
}

type emoji = {
  readonly name: string
  readonly code: string
}

type Mention = {
  id: string
  readonly name: string
}

const isTypingTimeout = 4000
const isTypingThrottleTime = 4000
const styles = StyleSheet.create({
  hitSlop: { top: 30, bottom: 30, left: 0, right: 0 },
  recordingIndicatorStyle: {
    borderRadius: 50,
    height: 10,
    width: 10,
    backgroundColor: color.red,
    marginRight: 4,
  },
  recording: { backgroundColor: color.darkGreen },
  stopRecording: { backgroundColor: color.red },
})

// const emotAreaHeight = 290
const minimumInterver = 10
const InputStyle = { flex: 1, alignSelf: "center" }
const textStyle = { backgroundColor: color.mentionBlue, fontWeight: "bold" }

type AllProps = ChatMessageFormProps & SafeAreaProps
class ChatMessageForm extends React.Component<AllProps, ChatMessageFormState> {
  public readonly state: ChatMessageFormState = {
    audioRecord: null,
    autoCorrect: true,
    isRecording: false,
    // callEmoticons: false,
    recordingTime: 0,
    isInputFocused: false,
    keyboardIsShown: false,
    // showEmoticons: false,
    value: "",
    showEmojiSearcher: false,
    emojiResult: [],
    emojiResultCache: [],
    permissionGranted: false,
  }

  private readonly inputRef: React.RefObject<TextInput> = React.createRef<TextInput>()

  private readonly isTyping$: BehaviorSubject<string> = new BehaviorSubject("")

  private readonly isNotTypingSub: Subscription = this.isTyping$
    .pipe(distinctUntilChanged(), debounceTime(isTypingTimeout))
    .subscribe(() => {
      this.publishIsTyping(false)
    })

  private readonly isTypingSub: Subscription = this.isTyping$
    .pipe(throttleTime(isTypingThrottleTime))
    .subscribe({
      next: (value) => {
        const { publishMessage, channel, me } = this.props
        publishMessage(
          {
            data: "",
            isTyping: !!value,
            sender: me.uuid,
            type: MessageType.Activity,
            uuid: quickUuid(),
            senderUsername: me.username,
          },
          channel
        )
      },
    })

  private keyboardShowListener: EmitterSubscription | null = null

  private keyboardHideListener: EmitterSubscription | null = null

  // eslint-disable-next-line react/sort-comp
  keyboardShow(e: KeyboardEvent): void {
    const { setInputFormHeight } = this.props
    this.setState({
      keyboardIsShown: true,
    })
    setInputFormHeight(Platform.OS === "ios" ? e.endCoordinates.height : 0)
  }

  keyboardHide(): void {
    // const { callEmoticons } = this.state
    const { setInputFormHeight } = this.props
    // if (callEmoticons) {
    //   this.setState({
    //     showEmoticons: true,
    //     callEmoticons: false,
    //   })
    //   setInputFormHeight(emotAreaHeight)
    // } else {
    this.setState({
      keyboardIsShown: false,
    })
    setInputFormHeight(0)
    // }
  }

  public componentDidMount(): void {
    const keyboardShowListener =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow"
    const keyboardHideListener =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide"
    this.keyboardShowListener = Keyboard.addListener(
      keyboardShowListener,
      this.keyboardShow.bind(this)
    )
    this.keyboardHideListener = Keyboard.addListener(
      keyboardHideListener,
      this.keyboardHide.bind(this)
    )
  }

  public shouldComponentUpdate(
    prevProps: AllProps,
    prevState: ChatMessageFormState
  ): boolean {
    return (
      !_.isEqual(this.props, prevProps) || !_.isEqual(this.state, prevState)
    )
  }

  public componentDidUpdate(
    prevProps: ChatMessageFormProps,
    prevState: ChatMessageFormState
  ): void {
    const { channel } = this.props
    const {
      isRecording,
      //  showEmoticons,
      showEmojiSearcher,
    } = this.state
    if (isRecording !== prevState.isRecording) {
      this.preventAutoLock(isRecording)
    }
    if (prevProps.channel !== channel) {
      if (isRecording) this.handleStopRecording(true)
      if (
        // showEmoticons ||
        showEmojiSearcher
      )
        this.cancelAddingEmoticon()
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ value: "" })
    }
  }

  public componentWillUnmount(): void {
    const { setInputFormHeight } = this.props
    this.keyboardHideListener?.remove()
    this.keyboardShowListener?.remove()
    setInputFormHeight(0)
    this.handleStopRecording(true)
    this.publishIsTyping(false)
    this.isNotTypingSub.unsubscribe()
    this.isTypingSub.unsubscribe()
  }

  public preventAutoLock = (isRecording: boolean): void => {
    if (isRecording) {
      activateKeepAwake()
    } else {
      deactivateKeepAwake()
    }
  }

  private scrollToBottom = (): void => {
    const { messageListRef } = this.props
    if (messageListRef) {
      messageListRef.scrollToEnd()
    }
  }

  private handleOnFocus = (): void => {
    this.scrollToBottom()
    this.setState({ isInputFocused: true })
  }

  private readonly renderTextInput = (): React.ReactNode => {
    const {
      autoCorrect,
      value,
      // showEmoticons,
      isInputFocused,
    } = this.state

    // eslint-disable-next-line react-perf/jsx-no-new-array-as-prop
    const partTypes = [
      {
        trigger: "@",
        renderSuggestions: RenderSuggestions,
        isInsertSpaceAfterMention: true,
        textStyle,
      },
    ]
    const placeholderText = isInputFocused ? "Write something..." : "Aa"

    return (
      <StyledInput
        containerStyle={InputStyle}
        autoCorrect={autoCorrect}
        inputRef={this.inputRef}
        placeholder={placeholderText}
        placeholderTextColor={color.textInput.placeholder}
        underlineColorAndroid="transparent"
        onChange={this.changeValue}
        value={value}
        multiline
        onFocus={this.handleOnFocus}
        onBlur={() => this.setState({ isInputFocused: false })}
        spellCheck
        hitSlop={styles.hitSlop}
        partTypes={partTypes}
        // showEmoticons={showEmoticons}
        // toggleEmoticons={this.toggleEmoticons}
      />
    )
  }

  private readonly renderAudioBar = (insetBottom: number): React.ReactNode => {
    return (
      <AudioFormWrapper insetBottom={insetBottom}>
        <SquareButton
          style={styles.stopRecording}
          onPress={() => this.handleStopRecording(true)}
        >
          <Icon name="md-close" color={color.white} />
        </SquareButton>
        <RecordingIndicatorWrapper>
          {this.renderAudioTimer()}
        </RecordingIndicatorWrapper>
        <SquareButton
          style={styles.recording}
          onPress={() => this.handleStopRecording(false)}
        >
          <Icon name="md-send" color={color.white} />
        </SquareButton>
      </AudioFormWrapper>
    )
  }

  private readonly renderAudioButton = (): React.ReactNode => {
    const { isInCallingChat } = this.props
    return isInCallingChat ? (
      <MarginRight />
    ) : (
      this.createIconButton("md-mic", this.handleStartRecording)
    )
  }

  private readonly renderLeftSideIcons = () => {
    const { isInCallingChat } = this.props
    return (
      <>
        {!isInCallingChat &&
          this.createIconButton("md-camera", this.handleTakePicture)}
        {this.createIconButton("md-images", this.handleChoosePicture)}
      </>
    )
  }

  private readonly renderEmojiSearcher = () => {
    const { showEmojiSearcher, emojiResult } = this.state

    return (
      <>
        {showEmojiSearcher && (
          <EmojiSearcher
            data={emojiResult}
            onEmoticonPress={this.addEmoticon}
          />
        )}
      </>
    )
  }

  private readonly renderAudioTimer = () => {
    const { recordingTime } = this.state
    const [minutes, seconds, milliseconds] = millisToMinutesAndSecondsToMillis(
      recordingTime
    )

    return (
      <>
        <TimerText>
          {`${minutes}:${parseInt(seconds) < 10 ? "0" : ""}${seconds}`}
        </TimerText>
        <ExtraTimerText>
          {(parseInt(milliseconds) < 10 ? "0" : "") + milliseconds}
        </ExtraTimerText>
      </>
    )
  }

  // Event handlers
  // private readonly toggleEmoticons = () => {
  //   const { setInputFormHeight } = this.props
  //   const { keyboardIsShown, showEmoticons } = this.state
  //   if (keyboardIsShown) {
  //     this.setState({ callEmoticons: true })
  //     Keyboard.dismiss()
  //   } else {
  //     this.setState({
  //       showEmoticons: !showEmoticons,
  //     })
  //     setInputFormHeight(showEmoticons ? 0 : emotAreaHeight)
  //   }
  // }

  private readonly changeValue = (value: string) => {
    const { isRecording } = this.state
    if (!isRecording) {
      const words = value.split(/(\s+)/)

      const lastWord = _.last(words)
      const searchWord = lastWord?.substr(1)
      let searchResult
      if (lastWord?.startsWith(":") && lastWord.length >= 2) {
        searchWord
          ? (searchResult = this.searchEmoji(searchWord))
          : (this.setState({ emojiResultCache: [] }),
            (searchResult = conciseData))
        this.setState({
          showEmojiSearcher: searchResult.length !== 0,
          emojiResult: searchResult,
        })
      } else {
        lastWord && this.searchEmoji(lastWord)
        this.setState({
          showEmojiSearcher: false,
          emojiResult: [],
          emojiResultCache: [],
        })
      }
      if (words.length > 2) {
        const lastWordAfterSpace = words[words.length - 3]
        if (emojiShortcuts.has(lastWordAfterSpace)) {
          const emoji = emojiShortcuts.get(lastWordAfterSpace)
          words.splice(-3, 1, emoji.trim())
          this.setState({ value: words.join("") })
          return
        }
      }
      this.setState({ value })
      value.length !== 0 && this.isTyping$.next(value)
    }
  }

  private readonly searchEmoji = (value: string) => {
    const { emojiResultCache } = this.state
    const newValue = value.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")
    const reg = new RegExp(`^${newValue}`, "i")
    const searchFromData =
      emojiResultCache.length === 0 ? emojiData : emojiResultCache
    const searchResult = searchFromData.filter((e: emoji) => !!reg.test(e.name))
    if (newValue.length === 1) this.setState({ emojiResultCache: searchResult })
    return searchResult
  }

  private readonly addEmoticon = (emoticon: {
    readonly code: string
    readonly name: string
  }) => {
    const { showEmojiSearcher, value } = this.state
    if (showEmojiSearcher) {
      this.changeValue(
        value.substring(0, value.lastIndexOf(" ")) + emoticon.code
      )
    } else {
      this.changeValue(value + emoticon.code)
    }
  }

  private readonly cancelAddingEmoticon = () => {
    const { setInputFormHeight } = this.props
    const { keyboardIsShown } = this.state
    this.setState({
      // showEmoticons: false,
      showEmojiSearcher: false,
    })

    if (keyboardIsShown) {
      this.restoreKeyboard()
    } else {
      setInputFormHeight(0)
    }
  }

  private readonly onEmojiBackspacePress = () => {
    const { value } = this.state
    const currentValue = Array.from(value)
    const newValue = currentValue.slice(0, -1).join("")

    this.setState({
      value: newValue,
    })
  }

  private readonly handleOnSend = () => {
    requestAnimationFrame(() => {
      this.publishText()
    })
  }

  private readonly handleChoosePicture = async (): Promise<void> => {
    const { setIsPickingImage, fetchUnreadMsgAndPartner } = this.props
    const leftAppTime = Date.now()
    setIsPickingImage(true)
    const base64Image = await chooseImage()
    const backToAppTime = Date.now()
    // For android user, if the user leaves app too long, it should fetch unread msg and partner
    backToAppTime - leftAppTime >= 60000 &&
      Platform.OS === "android" &&
      fetchUnreadMsgAndPartner()
    base64Image &&
      this.publishBase64(
        base64Image.data,
        MessageType.Image,
        undefined,
        base64Image.ratio
      )
  }

  private readonly handleTakePicture = async (): Promise<void> => {
    const {
      setIsPickingImage,
      setIsTakingImage,
      fetchUnreadMsgAndPartner,
    } = this.props
    const leftAppTime = Date.now()
    setIsPickingImage(true)
    setIsTakingImage(true)
    const base64Image = await takePicture()
    const backToAppTime = Date.now()
    // For android user, if the user leaves app too long, it should fetch unread msg and partner
    backToAppTime - leftAppTime >= 60000 &&
      Platform.OS === "android" &&
      fetchUnreadMsgAndPartner()
    base64Image && this.publishBase64(base64Image, MessageType.Image)
  }

  private readonly handleStartRecording = (): void => {
    requestAnimationFrame(() => {
      this.startRecording()
    })
  }

  private readonly handleStopRecording = async (
    canceled: boolean
  ): Promise<void> => {
    this.stopRecording(canceled)
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    })
  }

  private readonly onRecordingStatusUpdate = async (
    status: Audio.RecordingStatus
  ) => {
    this.setState({ recordingTime: status.durationMillis })

    if (status.durationMillis >= 60000) {
      this.handleStopRecording(false)
    }
  }

  private readonly publishIsTyping = (isTyping: boolean) => {
    const { publishMessage, channel, me } = this.props
    publishMessage(
      {
        data: "",
        isTyping,
        sender: me.uuid,
        type: MessageType.Activity,
        uuid: quickUuid(),
        senderUsername: me.username,
      },
      channel
    )
  }

  private readonly publishText = () => {
    const { value } = this.state
    const { me, channel, setDisplayMessage, publishMessage } = this.props
    this.scrollToBottom()
    const words = value.trim().split(" ")
    const lastWord = _.last(words)
    const mentionedIds: string[] = []
    const mentionText = replaceMentionValues(value, ({ id, name }: Mention) => {
      mentionedIds.push(id)
      return `@${name}`
    })
    if (lastWord && emojiShortcuts.has(lastWord)) {
      const emoji = emojiShortcuts.get(lastWord)
      words.splice(-1, 1, emoji)
    }

    const data = words.join(" ")

    if (data) {
      const message =
        mentionedIds.length > 0
          ? {
              data,
              isTyping: false,
              sender: me.uuid,
              type: MessageType.Text,
              avatar: me.avatar,
              senderUsername: me.username,
              uuid: quickUuid(),
              mentionedIds,
              mentionText,
            }
          : {
              data,
              isTyping: false,
              sender: me.uuid,
              type: MessageType.Text,
              avatar: me.avatar,
              senderUsername: me.username,
              uuid: quickUuid(),
              mentionedIds,
            }

      setDisplayMessage(message)

      publishMessage(message, channel)
      this.setState({ value: "", showEmojiSearcher: false })
    }
  }

  private readonly publishBase64 = (
    base64: string,
    type: MessageType,
    length?: number,
    ratio?: number
  ) => {
    const { me, channel, setDisplayMessage, publishMessage } = this.props
    this.scrollToBottom()
    const message = {
      data: base64,
      isTyping: false,
      sender: me.uuid,
      type: type === MessageType.Image ? MessageType.Image : MessageType.Audio,
      length:
        type === MessageType.Audio && length
          ? millisToMinutesAndSeconds(length)
          : 0,
      ratio: type === MessageType.Image && ratio ? ratio : 1,
      avatar: me.avatar,
      senderUsername: me.username,
      uuid: quickUuid(),
    }

    setDisplayMessage(message)

    publishMessage(message, channel)
  }

  // Utility functions
  private readonly createIconButton = (
    name: string | number,
    onClick: () => void,
    iconColor?: string
  ): React.ReactNode => {
    const { theme } = this.props
    return (
      <IconButtonWrapper>
        <IconWrapper onPress={onClick} underlayColor={theme.ButtonOnPress}>
          <Icon name={name} color={iconColor} />
        </IconWrapper>
      </IconButtonWrapper>
    )
  }

  private readonly parseEmoticons = (value: string): string => parse(value)

  private readonly restoreKeyboard = () => {
    const { keyboardIsShown } = this.state
    if (keyboardIsShown && this.inputRef.current) {
      this.inputRef.current.focus()
    }
  }

  private readonly startRecording = async (): Promise<void> => {
    const { audioRecord, isRecording } = this.state
    if (isRecording) {
      return
    }
    const audioPermissionFunction =
      Platform.OS === "android"
        ? getRNAndroidAudioPermission
        : getAudioRecordingPermission
    const { status } = await audioPermissionFunction()
    if (status !== "granted") {
      permissionNotAllowed("MICROPHONE")
      return
    }
    this.setState({ isRecording: true })
    if (audioRecord === null) {
      this.setState({ permissionGranted: true })
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
      })
      const recording = await startRecordingAudio()

      if (recording) {
        this.setState({ audioRecord: recording, isRecording: true })
        Keyboard.dismiss()
        recording.setProgressUpdateInterval(minimumInterver)
        recording.setOnRecordingStatusUpdate(this.onRecordingStatusUpdate)
      }
    } else {
      this.setState({ isRecording: false })
    }
  }

  private readonly stopRecording = async (canceled: boolean): Promise<void> => {
    const { audioRecord, recordingTime } = this.state
    if (audioRecord) {
      const base64 = await stopRecordingAudio(audioRecord)
      if (!canceled && base64) {
        this.publishBase64(base64, MessageType.Audio, recordingTime)
      }
      this.setState({
        audioRecord: null,
        recordingTime: 0,
        isRecording: false,
      })
    }
  }

  public render(): React.ReactNode {
    const { inputFormHeight, insets, isInCallingChat } = this.props
    const {
      value,
      isInputFocused,
      // showEmoticons,
      isRecording,
      permissionGranted,
      keyboardIsShown,
    } = this.state

    const canShowAudioBar = isRecording && permissionGranted
    // eslint-disable-next-line react-perf/jsx-no-new-object-as-prop
    const chatInputBarStyle = {
      marginBottom: inputFormHeight,
    }
    const noInsetBottom = keyboardIsShown // || showEmoticons
    const insetBottom = !noInsetBottom ? insets?.bottom || 0 : 0
    const shouldRenderLeftIconButtons = !isInputFocused //&& !showEmoticons
    return (
      <>
        {this.renderEmojiSearcher()}
        {canShowAudioBar ? (
          this.renderAudioBar(insetBottom)
        ) : (
          <ChatInputBar
            insetBottom={insetBottom}
            style={chatInputBarStyle}
            // showEmoticons={showEmoticons}
            isInCallingChat={isInCallingChat}
          >
            {shouldRenderLeftIconButtons && this.renderLeftSideIcons()}
            {this.renderTextInput()}
            {value.length > 0
              ? this.createIconButton("md-send", this.handleOnSend)
              : this.renderAudioButton()}
          </ChatInputBar>
        )}
        {/* <Emoticons
          onEmoticonPress={this.addEmoticon}
          onBackspacePress={this.onEmojiBackspacePress}
          show={showEmoticons}
          concise={false}
          showHistoryBar={false}
          showPlusBar={false}
        /> */}
      </>
    )
  }

  // Render functions
}
// ChatMessageForm.whyDidYouRender = {
//   logOnDifferentValues: false,
//   customName: "ChatMessageForm",
// }

export default withTheme(withSafeAreaInsets(ChatMessageForm))
