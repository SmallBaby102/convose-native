/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/style-prop-object */
import { OrderedMap } from "immutable"
import uniqBy from "lodash.uniqby"
import _ from "lodash"
import * as React from "react"
import { connect } from "react-redux"
import { Dispatch } from "redux"

import {
  ChatAction,
  ChatChannel,
  ChatSummary,
  ChatUser,
  Message,
  selectChatChannelMessages,
  UserStatus,
  ChatType,
  MessageType,
  shortenChannelId,
  selectShouldFetchAfterNetRecover,
  selectUnreadCachelMessages,
  ChatComponentName,
  checkIsGroup,
  MessageToPublish,
  isAudioVideoAllMuted,
  selectInputFormHeight,
  MessageActionType,
  selectPendingMessages,
  PendingMessages,
  PendingMessage,
} from "convose-lib/chat"
import { Routes } from "convose-lib/router"
import { State } from "convose-lib/store"
import {
  selectMyId,
  selectMyUuid,
  User,
  UserAction,
  Uuid,
} from "convose-lib/user"
import {
  selectChatSummary,
  selectParticipantsArray,
  selectUserFeature,
  UsersListAction,
} from "convose-lib/users-list"
import {
  CALLER_FOR_JOIN,
  canAccessMediaLibrary,
  copyToClipboard,
  downloadFile,
  filterMessages,
  getAudioPermission,
  getCameraRollPermission,
  getVideoPermission,
  handleOpenSettings,
  MESSAGE_LIMIT,
  millisToMinutesAndSeconds,
  permissionNotAllowedDefaultDescription,
  permissionNotAllowedDefaultTitle,
  quickUuid,
  saveMediaToLibrary,
} from "convose-lib/utils"
import { StackScreenProps } from "@react-navigation/stack"
import { DrawerActions, useFocusEffect } from "@react-navigation/native"
import { ToastAction, ToastProps } from "convose-lib/toast"
import {
  Keyboard,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native"
import RtcEngine from "react-native-agora"
import {
  requestPermission,
  initialize,
  checkPermission,
} from "react-native-floating-bubble"
import ImageZoom from "react-native-image-pan-zoom"
import { height, width } from "convose-styles"
import FastImage from "react-native-fast-image"
import { selectIsFayeReady } from "convose-lib/app"
import {
  CallingProfiles,
  UnmuteAlert,
  PermissionAlert,
  AudiencesButton,
  CallingButtons,
  MessageActions,
  ConvoseLoading,
} from "../../../convose-app/components"
import {
  toggleSpeaker,
  toggleVideo,
  joinCallChannel,
  toggleAudio,
  getCallingEngine,
} from "../../../convose-lib/services/agora"
import {
  AgoraUuid,
  AudioSetting,
  CallDisplayText,
  CallingAction,
  CallingParams,
  CallSignal,
  JoinCall,
  Peer,
  selectActivePeer,
  selectAudioSetting,
  selectCallingChannel,
  selectCallingChatId,
  selectCallingDisplayText,
  selectIsCaller,
  selectIsCalling,
  selectJoinCall,
  selectPeers,
} from "../../../convose-lib/calling"
import { RootStackParamList } from "../../router"
import ChatMessageHeader from "../../components/ChatMessageList/ChatMessageHeader"
import ChatMessageList from "../../components/ChatMessageList/ChatMessageList"
import ChatMessageForm from "../../components/ChatMessageForm/ChatMessageForm"
import * as RootNavigation from "../../RootNavigation"
import { ChatScreenWrapper, FullscreenImageWrapper } from "./Styled"
import { convoseAlertRef } from "../../RootConvoseAlert"

type StateToProps = {
  readonly chatSummary: ChatSummary | null
  readonly participants: ChatUser[]
  readonly chatUser: ChatUser | null
  readonly messages: ReadonlyArray<Message>
  readonly myUuid: Uuid
  readonly myId: number
  readonly callingChannel: string
  readonly chatId: string
  readonly isCalling: boolean
  readonly shouldFetchAfterNetRecover: boolean
  readonly audioSetting: AudioSetting
  readonly peers: OrderedMap<AgoraUuid, Peer>
  readonly isHost: boolean
  readonly isCaller: boolean
  readonly joinCall: JoinCall
  readonly activePeer: number
  readonly me: User
  readonly unmuteAlert: boolean
  readonly unreadCacheMessages: ReadonlyArray<Message>
  readonly isFayeReady: boolean
  readonly callingDisplayText: string
  readonly inputFormHeight: number
  readonly pendingMessages: PendingMessages
}

type DispatchToProps = {
  readonly getHistory: (
    chatChannel: ChatChannel,
    page: number,
    size: number
  ) => void
  readonly getUnread: (
    chatChannel: ChatChannel,
    page: number,
    size: number
  ) => void
  readonly markAsRead: (chatChannel: ChatChannel) => void
  readonly publishMessage: (
    message: MessageToPublish,
    channel: ChatChannel
  ) => void
  readonly setOpenChat: (chatChannel: ChatChannel | null) => void
  readonly subscribeChat: (chatChannel: ChatChannel) => void
  readonly unsubscribeChat: (chatChannel: ChatChannel) => void
  readonly deleteMessage: (chatChannel: ChatChannel, message: Message) => void
  readonly setCallingChannel: (callingChannelParams: CallingParams) => void
  readonly leaveCallingChannel: () => void
  readonly showToast: (toast: ToastProps) => void
  readonly toggleAudioMode: () => void
  readonly toggleVideoMode: () => void
  readonly setCallDisplayText: (text: string) => void
  readonly unsetUnmuteAlert: () => void
  readonly setPeers: (setPeers: {
    readonly action: string
    readonly peer: Peer
  }) => void
  readonly setIsPickingImage: (isPickingImage: boolean) => void
  readonly setIsTakingImage: (isTakingImage: boolean) => void
  readonly getUnreadPartnersList: () => void
  readonly setShouldFetchAfterNetRecover: () => void
  readonly setInputFormHeight: (height: number) => void
  readonly setSpeakerMode: (speakerMode: number) => void
  readonly publishPendingMessage: (
    chatChannel: ChatChannel,
    pendingMessage: PendingMessage
  ) => void
}

type FocusHookProps = {
  channel: string
  getHistory: (chatChannel: string, page: number, size: number) => void
  getUnread: (chatChannel: string, page: number, size: number) => void
  messages: readonly Message[]
  subscribeChat: (chatChannel: string) => void
  chatSummary: ChatSummary | null | undefined
  unsubscribeChat: (chatChannel: string) => void
  isFayeReady: boolean
}

function SubscribeAndFetchHistory({
  channel,
  getHistory,
  getUnread,
  messages,
  subscribeChat,
  unsubscribeChat,
  isFayeReady,
}: FocusHookProps) {
  useFocusEffect(
    React.useCallback(() => {
      subscribeChat(channel)
      if (isFayeReady) {
        if (messages.length === 0) {
          getHistory(channel, 0, MESSAGE_LIMIT)
        } else {
          getUnread(channel, 0, MESSAGE_LIMIT)
        }
      }
      return () => {
        unsubscribeChat(channel)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [channel, isFayeReady])
  )

  return null
}

type ChatScreenState = {
  readonly callingTime: string
  readonly hideHeader: boolean
  readonly displayPermissionRequest: boolean
  readonly fullscreenImageSource: { uri: string } | undefined
  readonly selectedMessage: Message | null
  readonly isSavingMedia: boolean
}

type NavProps = StackScreenProps<RootStackParamList, Routes.ChatDrawer>

type ChatScreenProps = NavProps & StateToProps & DispatchToProps

const styles = StyleSheet.create({
  imageStyle: {
    width,
    height,
  },
})
export class ChatScreenComponent extends React.Component<
  ChatScreenProps,
  ChatScreenState
> {
  private hideHeaderTimeoutId: ReturnType<typeof setTimeout> | null = null

  private callingTimerIntervalId: ReturnType<typeof setTimeout> | null = null

  private callingEngine: RtcEngine | undefined

  private messageListRef: any

  public readonly state: ChatScreenState = {
    hideHeader: false,
    callingTime: "",
    displayPermissionRequest: false,
    fullscreenImageSource: undefined,
    selectedMessage: null,
    isSavingMedia: false,
  }

  public componentDidMount(): void {
    this.callingEngine = getCallingEngine()
    const { markAsRead, setOpenChat, route } = this.props
    const chatChannel = route.params.channel
    route.params.forRejoinCall && this.rejoinCall()
    this.setState({ hideHeader: true })
    setOpenChat(chatChannel)
    markAsRead(chatChannel)

    // eslint-disable-next-line react/destructuring-assignment
    this.props.navigation.addListener("beforeRemove", (e) => {
      e.preventDefault()
      // eslint-disable-next-line react/destructuring-assignment
      if (!this.state.fullscreenImageSource) {
        // eslint-disable-next-line react/destructuring-assignment
        this.props.navigation.dispatch(e.data.action)
      } else {
        this.setState({ fullscreenImageSource: undefined })
      }
    })
  }

  public shouldComponentUpdate(
    prevProps: ChatScreenProps,
    prevState: ChatScreenState
  ): boolean {
    return (
      !_.isEqual(this.props, prevProps) || !_.isEqual(this.state, prevState)
    )
  }

  public componentDidUpdate(prevProps: ChatScreenProps): void {
    const {
      chatSummary,
      getUnread,
      messages,
      setOpenChat,
      shouldFetchAfterNetRecover,
      joinCall,
      isCalling,
      route,
    } = this.props
    const { channel } = route.params
    const prevChannel = prevProps.route.params.channel
    if (prevChannel !== channel) {
      // there's a condition so that it's okay to use setState in componentDidUpdate
      // eslint-disable-next-line react/no-did-update-set-state
      setOpenChat(channel)
    }
    this.setTimerAfterCallStart(joinCall)
    this.clearTimerAfterCallEnd(prevProps.isCalling, isCalling)
    const filteredMessages = filterMessages(messages)
    if (filteredMessages.length && chatSummary) {
      shouldFetchAfterNetRecover && getUnread(channel, 0, MESSAGE_LIMIT)
    }
  }

  public componentWillUnmount(): void {
    const { setOpenChat, markAsRead, route } = this.props
    const chatChannel = route.params.channel
    markAsRead(chatChannel)
    setOpenChat(null)
    if (this.callingTimerIntervalId) {
      clearInterval(this.callingTimerIntervalId)
      this.callingTimerIntervalId = null
    }
    if (this.hideHeaderTimeoutId) {
      clearTimeout(this.hideHeaderTimeoutId)
      this.hideHeaderTimeoutId = null
    }
  }

  public setPendingMessages = (
    pendingMessage: PendingMessage,
    chatChannel: string
  ): void => {
    const { publishPendingMessage } = this.props
    publishPendingMessage(chatChannel, pendingMessage)
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public setMessageListRef = (element: any) => {
    this.messageListRef = element
  }

  private readonly goBack = () => {
    const { navigation } = this.props
    requestAnimationFrame(() => {
      navigation.goBack()
    })
  }

  public readonly setTimerAfterCallStart = (joinCall: JoinCall): void => {
    if (
      joinCall.isJoined &&
      joinCall.joinedTime &&
      !this.callingTimerIntervalId
    ) {
      this.callingTimerIntervalId = setInterval(() => {
        const callingTime = millisToMinutesAndSeconds(
          Date.now() - joinCall.joinedTime
        )
        this.setState({ callingTime })
      }, 1000)
    }
  }

  public readonly clearTimerAfterCallEnd = (
    isPrevCalling: boolean,
    isCurrentCalling: boolean
  ): void => {
    if (isPrevCalling && !isCurrentCalling && this.callingTimerIntervalId) {
      clearInterval(this.callingTimerIntervalId)
      this.callingTimerIntervalId = null
      // Following is draw over other app permission
      Platform.OS === "android" &&
        checkPermission().then(
          (isPermited: boolean) =>
            !isPermited && this.setState({ displayPermissionRequest: true })
        )
    }
  }

  public readonly deleteMessage = (message: Message): void => {
    const { route, deleteMessage } = this.props
    const { channel } = route.params
    deleteMessage(channel, message)
  }

  public setFullScreenImage = (uri: { uri: string } | undefined): void => {
    this.setState({ fullscreenImageSource: uri })
  }

  private readonly showProfile = () => {
    const { myUuid, chatSummary, chatUser, route, participants } = this.props
    const firstTwoParticipants = chatSummary
      ? Object.values(chatSummary.participants)
      : undefined
    if (chatSummary?.type === ChatType.Group) {
      const { channel } = route.params
      RootNavigation.navigate(Routes.UserList, {
        chatChannel: channel,
        firstTwoParticipants,
        myUuid,
      })
    } else {
      RootNavigation.navigate(Routes.UserProfile, {
        // eslint-disable-next-line no-nested-ternary
        chatUserId: chatUser
          ? chatUser.uuid
          : firstTwoParticipants
          ? firstTwoParticipants[0].uuid
          : participants[0].uuid,
        chatUser:
          chatUser ||
          (firstTwoParticipants ? firstTwoParticipants[0] : participants[0]),
        myUuid,
      })
    }
  }

  public readonly setDisplayMessage = (message: MessageToPublish): void => {
    const { route } = this.props
    const { channel } = route.params
    const toMessage = {
      ...message,
      created_at: new Date(),
      myMessage: true,
      receiver: "",
      updated_at: new Date(),
      publishing: true,
    }
    this.setPendingMessages(toMessage, channel)
  }

  public readonly generateCallMessage = (
    data: string,
    callingChannel?: string,
    type?: string
  ): MessageToPublish => {
    const { me } = this.props
    return {
      data:
        CallSignal.call == data
          ? type != ChatType.Group
            ? `${me.username} is calling#${callingChannel}`
            : `${me.username} started a call`
          : data,
      action: data.search(/Call ended/g) !== -1 ? CallSignal.endCall : data,
      isTyping: false,
      sender: me.uuid,
      avatar: me.avatar,
      senderUsername: me.username,
      type: MessageType.Call,
      uuid: quickUuid(),
    }
  }

  public readonly generateCallingParams = ({
    caller,
    displayText,
    callingChannel,
    chatId,
  }: {
    caller: string
    displayText: string
    callingChannel: string
    chatId: string
  }): CallingParams => {
    const { myUuid, myId, chatSummary } = this.props
    return {
      myUuid,
      myId,
      caller,
      callingChannel,
      isGroup: chatSummary?.type === ChatType.Group,
      displayText,
      isHost: caller !== CALLER_FOR_JOIN,
      unmuteAlert: false,
      chatId,
    }
  }

  public readonly prepareCall = async (): Promise<void> => {
    const { isCalling } = this.props
    if (isCalling) return
    const audioPermission = await getAudioPermission()
    if (audioPermission !== "granted") return
    Keyboard.dismiss()
    this.callingEngine?.startPreview()
  }

  public readonly startCall = async (): Promise<void> => {
    const { isCalling } = this.props
    const isInCallingChat = this.checkIsInCallingChat()
    if (isInCallingChat) return
    if (isCalling) {
      this.endCall()
      setTimeout(() => {
        this.settingUpStartCall()
      }, 2000)
    } else {
      this.settingUpStartCall()
    }
  }

  public readonly rejoinCall = async (): Promise<void> => {
    const { isCalling } = this.props
    const isInCallingChat = this.checkIsInCallingChat()
    if (isInCallingChat) return
    if (isCalling) {
      this.endCall()
      setTimeout(() => {
        this.settingUpJoinCall()
      }, 2000)
    } else {
      this.settingUpJoinCall()
    }
  }

  public readonly settingUpStartCall = async (): Promise<void> => {
    await this.prepareCall()
    const {
      chatSummary,
      myUuid,
      setCallingChannel,
      route,
      publishMessage,
    } = this.props
    const chatId = chatSummary ? chatSummary.channel : route.params.channel
    const callingChannel =
      chatSummary?.type != ChatType.Group ? quickUuid() : chatId

    const startCallMessage = this.generateCallMessage(
      CallSignal.call,
      callingChannel,
      chatSummary?.type
    )

    publishMessage(startCallMessage, chatId)
    const callingChannelParams = this.generateCallingParams({
      caller: myUuid,
      displayText: "",
      callingChannel,
      chatId,
    })
    setCallingChannel(callingChannelParams)
  }

  public readonly settingUpJoinCall = async (): Promise<void> => {
    await this.prepareCall()
    const {
      myId,
      setCallingChannel,
      chatSummary,
      audioSetting,
      route,
    } = this.props
    // TODO: In the future, if to know who is caller is necessary, we can store it on backend, or get it from msg history.
    const chatId = chatSummary ? chatSummary.channel : route.params.channel
    const callingChannel =
      chatSummary?.type != ChatType.Group ? quickUuid() : chatId

    const callingChannelParams = this.generateCallingParams({
      caller: CALLER_FOR_JOIN,
      displayText: "connecting...",
      callingChannel,
      chatId,
    })

    await joinCallChannel(callingChannel, myId, 2, audioSetting.isAudioEnabled)
    setCallingChannel(callingChannelParams)
  }

  private readonly endCall = async () => {
    const {
      publishMessage,
      setCallDisplayText,
      peers,
      callingChannel,
    } = this.props
    const { callingTime } = this.state
    const isGroup = this.checkIsGroup()
    const callEndDurationText = `Call ended ${
      callingTime === "0:00" || !callingTime
        ? ""
        : `${callingTime.split(":")[0]}m ${callingTime.split(":")[1]}s`
    }`
    const EndCallSystemMessage = this.generateCallMessage(callEndDurationText)

    setCallDisplayText(CallDisplayText.callEnded)
    if (
      (peers.size > 0 && peers.filter((item) => item.isActive).size === 0) ||
      (peers.size === 1 && !isGroup)
    ) {
      publishMessage(EndCallSystemMessage, callingChannel)
      this.cleanCallingTimer()
    } else if (peers.size === 0) {
      publishMessage(EndCallSystemMessage, callingChannel)
    }
  }

  private muteRemoteUser = async (muteCommand: string) => {
    const { callingChannel, publishMessage } = this.props
    const muteRemoteMessage = this.generateCallMessage(muteCommand)
    publishMessage(muteRemoteMessage, callingChannel)
  }

  public cleanCallingTimer = (): void => {
    if (this.callingTimerIntervalId) {
      clearInterval(this.callingTimerIntervalId)
      this.callingTimerIntervalId = null
      this.setState({ callingTime: "0:00" })
    }
  }

  public readonly toggleSpeaker = (): void => {
    const { audioSetting, setSpeakerMode } = this.props
    const { speakerMode } = audioSetting
    // const SPEAKER_ON_CODES = [3, 4]
    const EARPHONE_ON_CODES = [0, 2, 5]
    // if (
    //   Platform.OS === "android" &&
    //   !isHost &&
    //   SPEAKER_ON_CODES.includes(speakerMode)
    // ) {
    // convoseAlertRef?.show({
    //   ioniconName: "ios-volume-high",
    //   description:
    //     "You can't toggle speaker off when your mic is muted",
    // })
    //   return
    // }
    if (EARPHONE_ON_CODES.includes(speakerMode)) {
      convoseAlertRef?.show({
        ioniconName: "ios-volume-high",
        description:
          "Speaker can't be turned on when headphones are plugged in",
      })
      return
    }
    toggleSpeaker(speakerMode, setSpeakerMode)
  }

  public readonly toggleAudio = (): void => {
    const { audioSetting, toggleAudioMode, peers } = this.props
    const cannotEnableAudio =
      isAudioVideoAllMuted(audioSetting) &&
      peers.filter((peer) => peer.isActive).size >= 4

    if (cannotEnableAudio) {
      convoseAlertRef?.show({
        ioniconName: "ios-call",
        description: "Maximum 4 people in call",
      })
      return
    }
    toggleAudioMode()
    toggleAudio(audioSetting.isAudioEnabled)
  }

  public readonly toggleVideo = async (): Promise<void> => {
    const { audioSetting, toggleVideoMode, peers } = this.props
    const videoPermission = await getVideoPermission()
    if (videoPermission !== "granted") return
    const cannotEnableAudio =
      isAudioVideoAllMuted(audioSetting) &&
      peers.filter((peer) => peer.isActive).size >= 4

    if (cannotEnableAudio) {
      convoseAlertRef?.show({
        ioniconName: "ios-call",
        description: "Maximum 4 people in call",
      })
      return
    }
    toggleVideoMode()
    toggleVideo(audioSetting.isVideoEnabled)
  }

  public readonly toggleHideHeader = (): void => {
    const { hideHeader } = this.state
    if (!hideHeader) {
      this.setState({ hideHeader: true })
      this.hideHeaderTimeoutId && clearTimeout(this.hideHeaderTimeoutId)
    } else {
      this.setState({ hideHeader: false })
      this.hideHeaderTimeoutId = setTimeout(
        () => this.setState({ hideHeader: true }),
        5000
      )
    }
  }

  public readonly toggleSettingsMenu = (): void => {
    const { navigation } = this.props
    Keyboard.dismiss()
    navigation.dispatch(DrawerActions.openDrawer())
  }

  public readonly fetchUnreadMsgAndPartner = (): void => {
    const { getUnreadPartnersList, setShouldFetchAfterNetRecover } = this.props
    getUnreadPartnersList()
    setShouldFetchAfterNetRecover()
  }

  public readonly checkIsInCallingChat = (): boolean => {
    const { chatSummary, chatId, joinCall, isCaller, isCalling } = this.props
    return (
      chatSummary?.channel === chatId &&
      ((joinCall.isJoined && isCalling) || (isCaller && isCalling))
    )
  }

  public readonly checkIsGroup = (): boolean => {
    const { chatSummary, route } = this.props
    return checkIsGroup(chatSummary, route.params.channel)
  }

  public readonly checkIsCallingInFullScreen = (): boolean => {
    const { peers, audioSetting } = this.props
    return (
      peers.some((peer) => !!peer.isVideoEnabled) || audioSetting.isVideoEnabled
    )
  }

  public checkCanReJoinCall = (): boolean => {
    const isGroup = this.checkIsGroup()
    if (!isGroup) {
      return false
    }
    const { chatSummary } = this.props
    const isInCallingChat = this.checkIsInCallingChat()
    return chatSummary
      ? isGroup && chatSummary.is_in_call && !isInCallingChat
      : false
  }

  public shouldDisplayComponent = (
    componentName: ChatComponentName
  ): boolean => {
    const { unmuteAlert } = this.props
    const {
      hideHeader,
      fullscreenImageSource,
      displayPermissionRequest,
    } = this.state
    const isInCallingChat = this.checkIsInCallingChat()
    const isGroup = this.checkIsGroup()
    const components = {
      ReturnToCall() {
        return !isInCallingChat
      },
      ChatMessageHeader() {
        return (
          (!isInCallingChat || !hideHeader) &&
          !displayPermissionRequest &&
          !fullscreenImageSource
        )
      },
      ChatMessageForm() {
        return !fullscreenImageSource
      },
      UnmuteAlert() {
        return isInCallingChat && unmuteAlert
      },
      PermissionAlert() {
        return Platform.OS === "android" && displayPermissionRequest
      },
      AudiencesButton() {
        return isInCallingChat && isGroup
      },
      defualt() {
        return true
      },
    }
    const checkShouldItDisplay = components[componentName] || components.defualt
    return checkShouldItDisplay()
  }

  public selectMessage = (message: Message): void => {
    Keyboard.dismiss()
    this.setState({
      selectedMessage: message,
    })
  }

  public dismissSelectedMessage = (): void => {
    const { selectedMessage } = this.state
    Keyboard.dismiss()
    if (selectedMessage) {
      this.setState({
        selectedMessage: null,
      })
    }
  }

  public onDeleteMessagePress = (): void => {
    const { selectedMessage } = this.state
    if (selectedMessage) {
      convoseAlertRef?.show({
        title: "Remove message",
        description:
          "It will delete for both you and the other user(s) in the chat, are you sure you want to delete this message?",
        ioniconName: "ios-trash",
        buttons: [
          {
            title: "Remove",
            onPress: () => {
              this.deleteMessage(selectedMessage)
              this.dismissSelectedMessage()
            },
          },
          {
            title: "Cancel",
            type: "cancel",
            onPress: this.dismissSelectedMessage,
          },
        ],
      })
    }
  }

  public onCopyMessagePress = (): void => {
    const { selectedMessage } = this.state
    if (selectedMessage) {
      const { data } = selectedMessage
      copyToClipboard(data)
    }
    this.dismissSelectedMessage()
  }

  public checkIfCanAccessMediaLibrary = async (): Promise<boolean> => {
    try {
      const canAccess = await canAccessMediaLibrary()
      if (!canAccess.granted) {
        const requestToAccess = await getCameraRollPermission()
        if (!requestToAccess.granted) {
          convoseAlertRef?.show({
            title: permissionNotAllowedDefaultTitle,
            description: permissionNotAllowedDefaultDescription("CAMERA_ROLL"),
            ioniconName: "ios-sad",
            buttons: [
              {
                title: "Give access",
                onPress: handleOpenSettings,
              },
              {
                title: "Cancel",
                type: "cancel",
              },
            ],
          })
          return false
        }
      }
      return true
    } catch (error) {
      return false
    }
  }

  public handleSavingFileFailed = (description?: string): void => {
    this.setState({ isSavingMedia: false })
    this.dismissSelectedMessage()
    convoseAlertRef?.show({
      title: "Saving file failed",
      description:
        description || "We couldn't save your file, Please try again later!",
      ioniconName: "ios-sad",
      buttons: [
        {
          title: "OK",
        },
      ],
    })
  }

  public onDownloadMessagePress = async (): Promise<void> => {
    try {
      const canAccess = await this.checkIfCanAccessMediaLibrary()
      if (!canAccess) {
        this.dismissSelectedMessage()
        return
      }
      const { selectedMessage } = this.state
      if (!selectedMessage) {
        return
      }
      this.setState({ isSavingMedia: true })
      const { data } = selectedMessage
      const uri = await downloadFile(data)
      if (!uri) {
        this.handleSavingFileFailed()
      }
      await saveMediaToLibrary(uri)
      this.setState({ isSavingMedia: false })
      this.dismissSelectedMessage()
      convoseAlertRef?.show({
        title: "File saved",
        description: "File saved successfully",
        ioniconName: "ios-checkmark",
        buttons: [
          {
            title: "OK",
          },
        ],
      })
    } catch (error) {
      this.handleSavingFileFailed()
    }
  }

  public onReportMessagePress = (): void => {
    const { selectedMessage } = this.state
    if (selectedMessage) {
      convoseAlertRef?.show({
        title: "Report Message",
        description: "Are you sure you want to report this message?",
        ioniconName: "ios-flag",
        buttons: [
          { title: "Report", onPress: this.dismissSelectedMessage },
          {
            title: "Cancel",
            type: "cancel",
            onPress: this.dismissSelectedMessage,
          },
        ],
      })
    }
  }

  // public reportMessage = (): void => {
  //   const { selectedMessage } = this.state
  //   if (selectedMessage) {
  //     convoseAlertRef?.show({
  //       title: "Report Message",
  //       description: "This message reported successfully!",
  //       ioniconName: "ios-flag",
  //       buttons: [{ title: "OK", onPress: this.dismissSelectedMessage }],
  //     })
  //   }
  // }

  private getMessageActions = (): MessageActionType[] => {
    const { selectedMessage } = this.state
    if (!selectedMessage) {
      return []
    }
    // eslint-disable-next-line react-perf/jsx-no-new-array-as-prop
    const messageMainActions = [
      {
        ioniconName: "ios-trash",
        title: "Delete",
        onPress: this.onDeleteMessagePress,
      },
      {
        ioniconName: "ios-flag",
        title: "Report",
        onPress: this.onReportMessagePress,
      },
    ]
    if (selectedMessage) {
      if (selectedMessage.type === MessageType.Text) {
        return [
          {
            ioniconName: "ios-copy",
            title: "Copy",
            onPress: this.onCopyMessagePress,
          },
          ...messageMainActions,
        ]
      }
      if (selectedMessage.type === MessageType.Image) {
        return [
          {
            ioniconName: "ios-cloud-download",
            title: "Get",
            onPress: this.onDownloadMessagePress,
          },
          ...messageMainActions,
        ]
      }
    }
    return messageMainActions
  }

  public unsetPermissionAlert = (): void =>
    this.setState({ displayPermissionRequest: false })

  private getCallingProfilesParticipants = (): ChatUser[] => {
    const { chatSummary, participants } = this.props
    if (participants.length) {
      return participants
    }
    if (chatSummary) {
      const { participants: summaryParticipants } = chatSummary
      return Object.keys(summaryParticipants).map(
        (key) => summaryParticipants[key]
      )
    }
    return []
  }

  public renderFullscreenImage(): React.ReactNode {
    const { fullscreenImageSource } = this.state

    return fullscreenImageSource ? (
      <FullscreenImageWrapper>
        <ImageZoom
          cropWidth={width}
          cropHeight={height}
          imageWidth={width}
          imageHeight={height}
          onClick={() => this.setFullScreenImage(undefined)}
          enableSwipeDown
          onSwipeDown={() => this.setFullScreenImage(undefined)}
        >
          <FastImage
            style={styles.imageStyle}
            source={fullscreenImageSource}
            resizeMode={FastImage.resizeMode.contain}
          />
        </ImageZoom>
      </FullscreenImageWrapper>
    ) : null
  }

  // eslint-disable-next-line complexity
  public render(): React.ReactNode {
    const {
      chatUser,
      getHistory,
      getUnread,
      markAsRead,
      messages,
      unreadCacheMessages,
      myUuid,
      publishMessage,
      chatSummary,
      route,
      subscribeChat,
      unsubscribeChat,
      audioSetting,
      isHost,
      peers,
      isCaller,
      joinCall,
      activePeer,
      me,
      isCalling,
      unsetUnmuteAlert,
      setPeers,
      participants,
      setIsPickingImage,
      setIsTakingImage,
      isFayeReady,
      inputFormHeight,
      setInputFormHeight,
      pendingMessages,
    } = this.props

    const { selectedMessage, isSavingMedia } = this.state
    const selectedMessageUUID = selectedMessage?.uuid
    const isInCallingChat = this.checkIsInCallingChat()
    const firstTwoParticipants = chatSummary
      ? Object.values(chatSummary.participants)
      : undefined
    const derivedChatUser = chatUser ||
      (firstTwoParticipants && firstTwoParticipants[0]) ||
      participants[0] || {
        avatar: "",
        interests: [],
        status: "",
      }

    const { channel } = route.params
    const dataMessages = uniqBy(
      [...messages, ...unreadCacheMessages, ...pendingMessages],
      "uuid"
    )
    const callingFullScreenMode = this.checkIsCallingInFullScreen()

    const isGroup = this.checkIsGroup()

    const callingProfilesParticipants = this.getCallingProfilesParticipants()
    const shouldRenderAudiencesButton = this.shouldDisplayComponent(
      ChatComponentName.AudiencesButton
    )

    return (
      <>
        <ConvoseLoading isShowing={isSavingMedia} />
        <TouchableWithoutFeedback onPress={this.dismissSelectedMessage}>
          <ChatScreenWrapper
            onStartShouldSetResponder={() => {
              Keyboard.dismiss()
              isInCallingChat && this.toggleHideHeader()
              return true
            }}
          >
            <SubscribeAndFetchHistory
              channel={channel}
              chatSummary={chatSummary}
              getHistory={getHistory}
              subscribeChat={subscribeChat}
              messages={messages}
              unsubscribeChat={unsubscribeChat}
              getUnread={getUnread}
              isFayeReady={isFayeReady}
            />
            <CallingProfiles
              isInCallingChat={isInCallingChat}
              callingFullScreenMode={callingFullScreenMode}
              me={me}
              audioSetting={audioSetting}
              peers={peers}
              isCaller={isCaller}
              chatUser={callingProfilesParticipants}
              channel={channel}
              isGroup={isGroup}
              joinCall={joinCall}
              activePeer={activePeer}
              isHost={isHost}
              muteRemoteUser={this.muteRemoteUser}
            />
            {this.shouldDisplayComponent(
              ChatComponentName.ChatMessageHeader
            ) && (
              <ChatMessageHeader
                chatChannel={channel}
                chatUser={derivedChatUser}
                participants={
                  chatSummary
                    ? Object.values(chatSummary.participants)
                    : undefined
                }
                canRejoinCall={this.checkCanReJoinCall()}
                groupName={
                  isGroup && chatSummary ? chatSummary.group_name : "Group"
                }
                isCalling={isCalling}
                goBack={this.goBack}
                showProfile={this.showProfile}
                myUuid={myUuid}
                userIsOnline={derivedChatUser.status === UserStatus.Online}
                isGroup={isGroup}
                startCall={this.startCall}
                rejoinCall={this.rejoinCall}
                isInCallingChat={isInCallingChat}
                toggleSettingsMenu={this.toggleSettingsMenu}
              />
            )}
            <ChatMessageList
              deleteMessage={this.deleteMessage}
              chatChannel={channel}
              chatUser={derivedChatUser}
              chatSummary={chatSummary}
              participants={participants}
              getHistory={getHistory}
              markAsRead={markAsRead}
              messages={dataMessages}
              myUuid={myUuid}
              isGroup={isGroup}
              isInCallingChat={isInCallingChat}
              callingFullScreenMode={callingFullScreenMode}
              me={me}
              setFullScreenImage={this.setFullScreenImage}
              setMessageListRef={this.setMessageListRef}
              dismissSelectedMessage={this.dismissSelectedMessage}
              selectMessage={this.selectMessage}
              selectedMessageUUID={selectedMessageUUID}
            />
            {shouldRenderAudiencesButton && (
              <AudiencesButton
                isHost={isHost}
                peers={peers}
                chatSummary={chatSummary}
                participants={participants}
                me={me}
                audioSetting={audioSetting}
                setPeers={setPeers}
                channel={channel}
              />
            )}
            {isInCallingChat && (
              <CallingButtons
                audioSetting={audioSetting}
                isHost={isHost}
                toggleAudio={this.toggleAudio}
                toggleVideo={this.toggleVideo}
                toggleSpeaker={this.toggleSpeaker}
                endCall={this.endCall}
                inputFormHeight={inputFormHeight}
              />
            )}
            <ChatMessageForm
              setDisplayMessage={this.setDisplayMessage}
              participants={participants}
              channel={channel}
              myUuid={myUuid}
              publishMessage={publishMessage}
              isInCallingChat={isInCallingChat}
              me={me}
              setIsPickingImage={setIsPickingImage}
              setIsTakingImage={setIsTakingImage}
              fetchUnreadMsgAndPartner={this.fetchUnreadMsgAndPartner}
              inputFormHeight={inputFormHeight}
              setInputFormHeight={setInputFormHeight}
              messageListRef={this.messageListRef}
            />

            {this.shouldDisplayComponent(ChatComponentName.UnmuteAlert) && (
              <UnmuteAlert
                toggleAudio={this.toggleAudio}
                unsetUnmuteAlert={unsetUnmuteAlert}
              />
            )}
            {this.shouldDisplayComponent(ChatComponentName.PermissionAlert) &&
              PermissionAlert(
                this.unsetPermissionAlert,
                requestPermission,
                initialize
              )}
            {this.renderFullscreenImage()}
          </ChatScreenWrapper>
        </TouchableWithoutFeedback>
        <MessageActions
          isVisible={!!selectedMessage}
          actions={this.getMessageActions()}
        />
      </>
    )
  }
}

const mapStateToProps = (
  state: State,
  ownProps: StateToProps & NavProps
): StateToProps => ({
  chatSummary: selectChatSummary(ownProps.route.params.channel)(state),
  participants: selectParticipantsArray(ownProps.route.params.channel)(state),
  chatUser: ownProps.route.params.chatUser
    ? selectUserFeature(ownProps.route.params.chatUser?.uuid || "")(state)
    : null,
  messages:
    selectChatChannelMessages(ownProps.route.params.channel)(state) || [],
  unreadCacheMessages:
    selectUnreadCachelMessages(ownProps.route.params.channel)(state) || [],
  myUuid: selectMyUuid(state),
  myId: selectMyId(state),
  callingChannel: selectCallingChannel(state),
  chatId: selectCallingChatId(state),
  isCalling: selectIsCalling(state),
  shouldFetchAfterNetRecover: selectShouldFetchAfterNetRecover(state),
  audioSetting: selectAudioSetting(state),
  peers: selectPeers(state),
  isHost: state.calling.isHost,
  isCaller: selectIsCaller(state),
  joinCall: selectJoinCall(state),
  activePeer: selectActivePeer(state),
  me: state.user,
  unmuteAlert: state.calling.unmuteAlert,
  isFayeReady: selectIsFayeReady(state),
  callingDisplayText: selectCallingDisplayText(state),
  inputFormHeight: selectInputFormHeight(state),
  pendingMessages: selectPendingMessages(ownProps.route.params.channel)(state),
})

const mapDispatchToProps = (
  dispatch: Dispatch<
    ChatAction | UsersListAction | UserAction | CallingAction | ToastAction
  >
): DispatchToProps => ({
  deleteMessage: (chatChannel: ChatChannel, message: Message) =>
    dispatch(ChatAction.deleteMessage(chatChannel, message)),
  getHistory: (chatChannel: ChatChannel, page: number, size: number) =>
    dispatch(ChatAction.getHistory(chatChannel, page, size)),
  getUnread: (chatChannel: ChatChannel, page: number, size: number) =>
    dispatch(ChatAction.getUnread(chatChannel, page, size)),
  markAsRead: (chatChannel: string) =>
    dispatch(UsersListAction.markAsRead(chatChannel)),
  publishMessage: (message: MessageToPublish, channel: ChatChannel) =>
    dispatch(ChatAction.publishMessage(message, channel)),
  setOpenChat: (chatChannel: ChatChannel | null) =>
    dispatch(ChatAction.setOpenChat(chatChannel)),
  subscribeChat: (chatChannel: ChatChannel) =>
    dispatch(ChatAction.subscribeChat(chatChannel)),
  unsubscribeChat: (chatChannel: ChatChannel) =>
    dispatch(ChatAction.unsubscribeChat(chatChannel)),
  leaveCallingChannel: () => dispatch(CallingAction.leaveChannel()),
  setCallingChannel: (callingChannelParams: CallingParams) =>
    dispatch(CallingAction.setCallingChannel(callingChannelParams)),
  showToast: (toast: ToastProps) => dispatch(ToastAction.showToast(toast)),
  toggleVideoMode: () => dispatch(CallingAction.toggleVideoMode()),
  toggleAudioMode: () => dispatch(CallingAction.toggleAudioMode()),
  setCallDisplayText: (text: string) =>
    dispatch(CallingAction.setDisplayText(text)),
  unsetUnmuteAlert: () => dispatch(CallingAction.unsetUnmuteAlert()),
  setPeers: (setPeers: { readonly action: string; readonly peer: Peer }) =>
    dispatch(CallingAction.setPeers(setPeers)),
  setIsPickingImage: (isPickingImage: boolean) =>
    dispatch(ChatAction.setIsPickingImage(isPickingImage)),
  setIsTakingImage: (isTakingImage: boolean) =>
    dispatch(ChatAction.setIsTakingImage(isTakingImage)),
  getUnreadPartnersList: () =>
    dispatch(UsersListAction.getUnreadPartnersList()),
  setShouldFetchAfterNetRecover: () =>
    dispatch(ChatAction.setShouldFetchAfterNetRecover()),
  setInputFormHeight: (inputHeight: number) =>
    dispatch(ChatAction.setInputFormHeight(inputHeight)),
  setSpeakerMode: (speakerMode: number) =>
    dispatch(CallingAction.setSpeakerMode(speakerMode)),
  publishPendingMessage: (
    chatChannel: ChatChannel,
    pendingMessage: PendingMessage
  ) => dispatch(ChatAction.publishPendingMessage(chatChannel, pendingMessage)),
})
// ChatScreenComponent.whyDidYouRender = {
//   logOnDifferentValues: false,
//   customName: "ChatScreenComponent",
//   diffNameColor: "red",
// }
export const ChatScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatScreenComponent)
