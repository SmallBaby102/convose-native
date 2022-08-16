import React, { PureComponent } from "react"

import { connect } from "react-redux"
import {
  AVATAR_SIZE,
  color,
  defaultShadows,
  softShadows,
  statusBarHeight,
  width,
} from "convose-styles"
import { Routes } from "convose-lib/router"
import {
  ChatSummary,
  ChatUser,
  MessageToPublish,
  MessageType,
} from "convose-lib/chat"
import { Animated, Keyboard, Platform, SafeAreaView } from "react-native"
import { Dispatch } from "redux"
import {
  CallDisplayText,
  CallingAction,
  CallSignal,
  selectCallerUuid,
} from "convose-lib/calling"
import {
  getRNAndroidAudioPermission,
  permissionNotAllowed,
  quickUuid,
} from "convose-lib/utils"
import { joinCallChannel, State } from "convose-lib"
import { MaterialIcons } from "@expo/vector-icons"
import {
  selectChatSummary,
  selectParticipantsArray,
} from "convose-lib/users-list"
import { selectMyId, selectMyUuid } from "convose-lib/user"
import { renderGroupAvatar } from "../ChatMessageList"
import { Avatar } from "../Avatar"
import * as RootNavigation from "../../RootNavigation"
import { CircleButton } from "../CallingComponents/Styled"
import {
  TouchableWrapper,
  Body,
  Section,
  GroupUserName,
  TextMessage,
  Username,
  AvatarContainer,
} from "../InboxConversationBox/Styled"
import { ReceivingCallUIContainer } from "./Styled"

const ReceivingCallUIStyle = {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  position: "absolute",
  width: "100%",
  top: statusBarHeight + 40,
}

const iconSize = 28
const iconStyle = { height: iconSize, width: iconSize }

type ReceivingCallNotificationProps = {
  readonly channel: string
  readonly chatId: string
  readonly isGroup: boolean
  readonly publishMessage: (message: MessageToPublish, chatId: string) => void
}

type StateToProps = {
  participantsArray: ChatUser[]
  readonly myId: number
  readonly callerUuid: string
  readonly myUuid: string
  readonly chatSummary: ChatSummary | null
}

type ReceivingCallNotificationState = {
  position: Animated.Value
  isMounted: boolean
}

type DispatchToProps = {
  readonly toggleAudioMode: () => void
  readonly toggleHost: () => void
  readonly leaveChannel: () => void
  readonly setCallDisplayText: (displayText: string) => void
}

type AllProps = ReceivingCallNotificationProps & StateToProps & DispatchToProps

export class ReceivingCallNotification extends PureComponent<
  AllProps,
  ReceivingCallNotificationState
> {
  state = { position: new Animated.Value(-100), isMounted: false }

  componentDidMount = (): void => {
    setTimeout(() => this.setState({ isMounted: true }), 20)
  }

  private readonly runConversation = () => {
    const { chatId } = this.props
    RootNavigation.navigate(Routes.ChatDrawer, {
      screen: Routes.Chat,
      params: {
        channel: chatId,
        chatUser: {},
      },
    })
  }

  private async declineCall() {
    const { myUuid, chatId, publishMessage, leaveChannel } = this.props
    const declineCallMessage = {
      data: CallSignal.callEndDecline,
      action: CallSignal.callEndDecline,
      isTyping: false,
      sender: myUuid,
      type: MessageType.Call,
      uuid: quickUuid(),
      senderUsername: "",
    }
    await leaveChannel()
    publishMessage(declineCallMessage, chatId)
  }

  private async acceptCall() {
    const {
      myId,
      myUuid,
      channel,
      chatId,
      isGroup,
      toggleAudioMode,
      publishMessage,
      toggleHost,
      setCallDisplayText,
    } = this.props
    if (Platform.OS === "android") {
      const { status } = await getRNAndroidAudioPermission()
      if (status !== "granted") {
        permissionNotAllowed("MICROPHONE")
        return
      }
    }

    const callingRole = isGroup ? 2 : 1
    !isGroup && toggleAudioMode()
    !isGroup && toggleHost()
    setCallDisplayText(CallDisplayText.connecting)
    await joinCallChannel(channel, myId, callingRole, !isGroup)
    const joinedCallMessage = {
      data: CallSignal.joined,
      action: CallSignal.joined,
      isTyping: false,
      sender: myUuid,
      type: MessageType.Call,
      uuid: quickUuid(),
      senderUsername: "",
    }
    await publishMessage(joinedCallMessage, chatId)
    Keyboard.dismiss()
    this.returnToCall()
  }

  private returnToCall() {
    const { chatId } = this.props
    RootNavigation.navigate(Routes.ChatDrawer, {
      screen: Routes.Chat,
      params: {
        channel: chatId,
        chatUser: {},
      },
    })
  }

  // eslint-disable-next-line complexity
  render(): React.ReactNode {
    const { isGroup, participantsArray, callerUuid, chatSummary } = this.props
    const { position, isMounted } = this.state
    const participants =
      chatSummary && chatSummary.participants
        ? Object.values(chatSummary.participants)
        : participantsArray
    if (!isMounted) return null
    const chatUser = participants[0] || {
      avatar: "",
      interests: [],
      status: "",
      username: "",
      theme_color: "SystemDefualt",
    }

    const callerIndex = participants.findIndex(
      (user) => user.uuid === callerUuid
    )

    Animated.timing(position, {
      duration: 500,
      toValue: 10,
      useNativeDriver: true,
    }).start()

    return (
      <SafeAreaView style={ReceivingCallUIStyle}>
        <ReceivingCallUIContainer
          // eslint-disable-next-line react-perf/jsx-no-new-array-as-prop
          style={[defaultShadows, { transform: [{ translateY: position }] }]}
        >
          <TouchableWrapper onPress={this.runConversation}>
            {isGroup ? (
              renderGroupAvatar(participants, AVATAR_SIZE)
            ) : (
              <AvatarContainer>
                <Avatar
                  height={AVATAR_SIZE}
                  width={AVATAR_SIZE}
                  userAvatar={chatUser.avatar}
                />
              </AvatarContainer>
            )}
            <Body>
              <Section>
                <Username
                  color={isGroup ? "SystemDefualt" : chatUser.theme_color}
                >
                  {isGroup ? "Group" : chatUser.username}
                </Username>
              </Section>

              {isGroup && (
                <Section>
                  <GroupUserName
                    color={
                      callerIndex === -1
                        ? "SystemDefualt"
                        : participants[callerIndex].theme_color
                    }
                    numberOfLines={1}
                  >
                    {callerIndex === -1
                      ? "Group"
                      : participants[callerIndex].username}
                    :
                  </GroupUserName>
                </Section>
              )}

              <Section>
                <TextMessage>Calling...</TextMessage>
              </Section>
            </Body>
            <CircleButton
              size={width > 700 ? 80 : 60}
              backgroundColor={color.red}
              style={softShadows}
              margin={0}
              onPress={() => this.declineCall()}
            >
              <MaterialIcons
                name="call-end"
                size={iconSize}
                color="white"
                style={iconStyle}
              />
            </CircleButton>
            <CircleButton
              size={width > 700 ? 80 : 60}
              backgroundColor={color.darkGreen}
              style={softShadows}
              onPress={() => this.acceptCall()}
            >
              <MaterialIcons
                name="call"
                size={iconSize}
                color="white"
                style={iconStyle}
              />
            </CircleButton>
          </TouchableWrapper>
        </ReceivingCallUIContainer>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = (
  state: State,
  ownProps: ReceivingCallNotificationProps
): StateToProps => ({
  myUuid: selectMyUuid(state),
  myId: selectMyId(state),
  callerUuid: selectCallerUuid(state),
  participantsArray: selectParticipantsArray(ownProps.chatId)(state),
  chatSummary: selectChatSummary(ownProps.chatId)(state),
})

const mapDispatchToProps = (
  dispatch: Dispatch<CallingAction>
): DispatchToProps => ({
  toggleAudioMode: () => dispatch(CallingAction.toggleAudioMode()),
  toggleHost: () => dispatch(CallingAction.toggleHost()),
  leaveChannel: () => dispatch(CallingAction.leaveChannel()),
  setCallDisplayText: (displayText: string) =>
    dispatch(CallingAction.setDisplayText(displayText)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReceivingCallNotification)
