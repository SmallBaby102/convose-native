/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable camelcase */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { differenceInHours, format } from "date-fns"
import * as React from "react"
import { Animated, PanResponder, PanResponderInstance } from "react-native"

import {
  CHAT_MESSAGE_TIME_FORMAT,
  CHAT_MESSAGE_DATE_FORMAT,
  ChatSummary,
  ChatUser,
  MessageType,
  UserStatus,
  ChatType,
  setCallStatusMessage,
  ParticipantsListObject,
} from "convose-lib/chat"
import { Routes } from "convose-lib/router"

import { statusBarHeight, AVATAR_SIZE, hardShadow } from "convose-styles"
import { State } from "convose-lib/store"
import { connect } from "react-redux"

import {
  CallingAction,
  selectCallingChannel,
  selectIsCalling,
} from "convose-lib/calling"
import { Dispatch } from "redux"
import { selectParticipants } from "convose-lib/users-list"
import {
  AvatarContainer,
  BadgeView,
  Body,
  getIconColor,
  InboxContainer,
  MediaMessageContainer,
  NotificationContainer,
  Section,
  TextMessage,
  TouchableWrapper,
  Username,
  GroupUserName,
  GroupTextWrapper,
  DateComponent,
  StyledIcon,
} from "./Styled"
import {
  Avatar,
  IconBadge,
  PresenceIndicator,
  RejoinCallingButton,
  renderGroupAvatar,
} from "../../components"
import * as RootNavigation from "../../RootNavigation"
import { replaceMentionValues } from "../../../../self-maintained-packages/react-native-controlled-mentions"

type PropsType = {
  readonly chatSummary: ChatSummary
  readonly closeNotification?: (notification: ChatSummary) => void
  readonly index?: number
  readonly notification?: boolean
}

type StateType = {
  readonly pan: Animated.ValueXY
  readonly panResponder: PanResponderInstance | null
}

type StateToProps = {
  readonly isCalling: boolean
  readonly me: ChatUser
  readonly participants: ParticipantsListObject | null
  readonly callingChannel: string
}

type DispatchToProps = {
  readonly setCallingChannel: (callingChannelParams: any) => void
  readonly leaveCallingChannel: () => void
}
type allProps = PropsType & StateToProps & DispatchToProps

export class InboxConversationBoxComponent extends React.PureComponent<
  allProps,
  StateType
> {
  public panResponder: PanResponderInstance | null = null

  public readonly state: StateType = {
    pan: new Animated.ValueXY({ x: 0, y: -200 }),
    // eslint-disable-next-line react/no-unused-state
    panResponder: null,
  }

  constructor(props: allProps) {
    super(props)
    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        // eslint-disable-next-line react/destructuring-assignment
        [null, { dx: this.state.pan.x, dy: this.state.pan.y }],
        { useNativeDriver: false }
      ),

      onPanResponderRelease: (_, gestureState) => {
        const { closeNotification, chatSummary } = this.props
        const { pan } = this.state
        if (gestureState.dy < 0 && gestureState.moveY < 25) {
          closeNotification && closeNotification(chatSummary)
        } else {
          this.runConversation(false)
        }
        Animated.spring(pan, {
          friction: 5,
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
        }).start()
      },
    })
  }

  public componentDidMount(): void {
    const { pan } = this.state
    Animated.sequence([
      Animated.timing(pan, {
        duration: 1000,
        toValue: { x: 0, y: statusBarHeight + 10 },
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(pan, {
        duration: 1000,
        toValue: { x: 0, y: -200 },
        useNativeDriver: true,
      }),
    ]).start()
  }

  // UTILITIES
  private readonly getNotificationStyles = () => {
    const { pan } = this.state
    const { notification } = this.props
    return notification
      ? {
          transform: pan.getTranslateTransform(),
          ...hardShadow,
        }
      : null
  }

  private readonly getChatUser = () => {
    const { chatSummary } = this.props
    const { participants, type } = chatSummary
    const [receiverIndex] = Object.keys(participants)
    let user = participants[receiverIndex]

    if (type === ChatType.Group) {
      user = {
        ...user,
        username: chatSummary ? chatSummary.group_name || "Group" : "Group",
        theme_color: "SystemDefualt",
      }
    }

    return user
  }

  public readonly rejoinCall = (): void => {
    this.runConversation(true)
  }

  private readonly runConversation = (
    forRejoinCallParam: boolean | undefined
  ): void => {
    const { chatSummary, callingChannel } = this.props
    const { channel } = chatSummary
    let forRejoinCall
    if (
      typeof forRejoinCallParam === "boolean" ||
      typeof forRejoinCallParam === "undefined"
    ) {
      forRejoinCall =
        forRejoinCallParam && (!callingChannel || callingChannel !== channel)
    } else {
      forRejoinCall = false
    }
    const chatUser = this.getChatUser()
    RootNavigation.navigate(Routes.ChatDrawer, {
      screen: Routes.Chat,
      params: {
        channel,
        chatUser,
        forRejoinCall,
      },
    })
  }

  private readonly wrapWithUserName = (elem: JSX.Element) => {
    const { chatSummary, participants, me } = this.props

    const userName = chatSummary.last_message.sender_username
    const senderUuid = chatSummary.last_message.sender_uuid
    const sender =
      senderUuid === me.uuid
        ? me
        : participants
        ? participants[senderUuid]
        : chatSummary.participants[senderUuid]
    const senderThemeColor = sender ? sender.theme_color : "SystemDefualt"
    if (
      chatSummary.type === ChatType.Group &&
      userName !== MessageType.System &&
      userName
    ) {
      return (
        <GroupTextWrapper>
          <GroupUserName color={senderThemeColor}>{userName}:</GroupUserName>
          {elem}
        </GroupTextWrapper>
      )
    }
    return elem
  }

  // RENDER FUNCTIONS
  private readonly renderParticipantsHeaders = (
    user: ChatUser,
    canRejoinCall: boolean
  ) => {
    const { chatSummary } = this.props
    const {
      last_message: { created_at },
    } = chatSummary
    const theme_color =
      user && user.theme_color ? user.theme_color : "SystemDefualt"
    const username = user && user.username ? user.username : ""
    const { notification } = this.props

    return (
      <>
        <Username color={theme_color}>{username}</Username>
        {!canRejoinCall && !notification && (
          <DateComponent>
            {differenceInHours(Date.now(), created_at) < 24
              ? format(created_at, CHAT_MESSAGE_TIME_FORMAT)
              : format(created_at, CHAT_MESSAGE_DATE_FORMAT)}
          </DateComponent>
        )}
      </>
    )
  }

  private readonly renderParticipantAvatar = (user: ChatUser) => {
    const isOnline = !!(
      user &&
      user.status &&
      user.status === UserStatus.Online
    )

    return (
      <AvatarContainer>
        <PresenceIndicator isOnline={isOnline}>
          <Avatar
            height={AVATAR_SIZE}
            width={AVATAR_SIZE}
            userAvatar={user && user.avatar ? user.avatar : undefined}
          />
        </PresenceIndicator>
      </AvatarContainer>
    )
  }

  private readonly renderBadge = (unreadCount: number, inbox_read: boolean) =>
    unreadCount > 0 && (
      <BadgeView>
        <IconBadge
          fontSize={11}
          height={20}
          inboxIndicator={!inbox_read}
          text={unreadCount.toString()}
          width={20}
        />
      </BadgeView>
    )

  private readonly renderTextMessage = (message: string) => {
    const {
      chatSummary: {
        unread: { count },
        type,
      },
    } = this.props
    const { notification } = this.props
    const isGroup = type === ChatType.Group

    return (
      <TextMessage
        newMessage={count > 0}
        isGroup={isGroup}
        notification={Boolean(notification)}
        numberOfLines={1}
      >
        {replaceMentionValues(
          message,
          ({ name }: { name: string }) => `@${name}`
        )}
      </TextMessage>
    )
  }

  private readonly renderIconMessage = (name: string, label: string) => {
    return (
      <MediaMessageContainer>
        <StyledIcon name={name} size={20} />
        {this.renderTextMessage(label)}
      </MediaMessageContainer>
    )
  }

  private readonly renderMessage = () => {
    const { chatSummary, me } = this.props
    const callStatusMessage = setCallStatusMessage(
      chatSummary.last_message.content,
      chatSummary.last_message.sender_username,
      chatSummary.type === ChatType.Group,
      chatSummary.last_message.sender_uuid === me.uuid
    )
    switch (chatSummary.last_message.message_type) {
      case MessageType.Text:
      case MessageType.System:
        return this.wrapWithUserName(
          this.renderTextMessage(chatSummary.last_message.content)
        )
      case MessageType.Audio:
        return this.wrapWithUserName(
          this.renderIconMessage("md-mic", "Audio Message")
        )
      case MessageType.Image:
        return this.wrapWithUserName(
          this.renderIconMessage("md-image", "Image")
        )
      case MessageType.Call:
        return this.renderTextMessage(
          callStatusMessage ? callStatusMessage[0] : "Tap to see call status"
        )
      default:
        return undefined
    }
  }

  public render(): React.ReactNode {
    const {
      chatSummary: {
        unread: { count, inbox_read },
        type: groupType,
        is_in_call,
        participants,
      },
      notification,
    } = this.props

    const InboxConversationContainer = notification
      ? NotificationContainer
      : InboxContainer
    const panHandler =
      notification && this.panResponder ? this.panResponder.panHandlers : {}
    const user = this.getChatUser()
    const isGroup = groupType === ChatType.Group
    const canRejoinCall = isGroup && is_in_call
    // TODO: Move notification styles to styled.js

    return (
      <InboxConversationContainer
        {...panHandler}
        style={this.getNotificationStyles()}
        pointerEvents="box-none"
      >
        <TouchableWrapper onPress={this.runConversation}>
          {isGroup
            ? renderGroupAvatar(
                participants ? Object.values(participants) : undefined,
                AVATAR_SIZE,
                this.runConversation
              )
            : this.renderParticipantAvatar(user)}
          <Section>
            <Body>
              <Section>
                {this.renderParticipantsHeaders(user, canRejoinCall)}
              </Section>
              <Section>
                {this.renderMessage()}
                {!canRejoinCall && this.renderBadge(count, inbox_read)}
              </Section>
            </Body>
            {canRejoinCall && RejoinCallingButton(this.rejoinCall)}
          </Section>
        </TouchableWrapper>
      </InboxConversationContainer>
    )
  }
}

const mapStateToProps = (
  state: State,
  ownProps: StateToProps & PropsType
): StateToProps => ({
  me: state.user,
  isCalling: selectIsCalling(state),
  participants: selectParticipants(ownProps.chatSummary?.channel)(state),
  callingChannel: selectCallingChannel(state),
})

const mapDispatchToProps = (
  dispatch: Dispatch<CallingAction>
): DispatchToProps => ({
  setCallingChannel: (callingChannelParams: any) =>
    dispatch(CallingAction.setCallingChannel(callingChannelParams)),
  leaveCallingChannel: () => dispatch(CallingAction.leaveChannel()),
})
// InboxConversationBoxComponent.whyDidYouRender = {
//   logOnDifferentValues: false,
//   customName: "InboxConversationBoxComponent",
//   diffNameColor: "red",
// }
export const InboxConversationBox = connect(
  mapStateToProps,
  mapDispatchToProps
)(InboxConversationBoxComponent)
