/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
/* eslint-disable complexity */
import {
  CALLER_FOR_JOIN,
  millisToMinutesAndSeconds,
  quickUuid,
} from "convose-lib/utils"
import React from "react"
import {
  DeviceEventEmitter,
  Platform,
  AppState,
  AppStateStatus,
} from "react-native"
import { connect } from "react-redux"
import { State } from "convose-lib"
import {
  AgoraUuid,
  AudioSetting,
  CallDisplayText,
  CallingAction,
  CallSignal,
  JoinCall,
  Peer,
  selectAudioSetting,
  selectCallerUuid,
  selectCallingChannel,
  selectCallingChatId,
  selectDisplayText,
  selectIsCaller,
  selectIsCalling,
  selectIsGroup,
  selectIsHost,
  selectJoinCall,
  selectPeers,
  SetPeersAction,
} from "convose-lib/calling"
import {
  ChatAction,
  ChatChannel,
  ChatSummary,
  ChatUser,
  findSpeaker,
  isAudioVideoAllMuted,
  IS_SPEAKING_VOLUME_THRESHOLD,
  MessageToPublish,
  MessageType,
  publishMessage,
  selectOpenChatChannel,
} from "convose-lib/chat"
import { Dispatch } from "redux"
import RtcEngine, {
  AudioOutputRouting,
  AudioRemoteState,
  AudioVolumeInfo,
  UserOfflineReason,
  VideoRemoteState,
} from "react-native-agora"
import { Audio } from "expo-av"
import { selectMyUuid } from "convose-lib/user"

import { Subject, Subscription } from "rxjs"
import { bufferTime } from "rxjs/operators"
import {
  getCallingEngine,
  leaveCallingChannel,
  setCallRole,
} from "convose-lib/services/agora"
import { OrderedMap } from "immutable"
import { selectChatSummary } from "convose-lib/users-list"
import {
  showFloatingBubble,
  hideFloatingBubble,
  checkPermission,
  reopenApp,
} from "react-native-floating-bubble"
import ReceivingCallNotification from "./ReceivingCallNotification"

type StateToProps = {
  readonly myUuid: string
  readonly channel: string
  readonly chatId: string
  readonly peers: OrderedMap<AgoraUuid, Peer>
  readonly isCaller: boolean
  readonly callerUuid: string
  readonly isCalling: boolean
  readonly isGroup: boolean
  readonly joinCall: JoinCall
  readonly isOpenChat: string | null
  readonly displayText: string
  readonly isHost: boolean
  readonly chatSummary: ChatSummary | null
  readonly me: ChatUser
  readonly audioSetting: AudioSetting
}

type CallingState = {
  readonly soundObject: Audio.Sound
  readonly ringtoneLoaded: boolean
  readonly isPlayingRingtone: boolean
  readonly durationTime: string
  readonly isActive: boolean
}

type DispatchToProps = {
  readonly publishMessage: (
    message: MessageToPublish,
    channel: ChatChannel
  ) => void
  readonly setJoinCallSuccessful: (currentTime: number) => void
  readonly setPeers: (setPeer: SetPeer) => void
  readonly setCallDisplayText: (displayText: string) => void
  readonly leaveChannelSuccessful: () => void
  readonly setActivePeer: (activePeerId: number) => void
  readonly setSpeakerMode: (speakerMode: number) => void
  readonly toggleHost: () => void
  readonly setMeIsSpeaking: (isSpeaking: boolean) => void
}

type CallingNotificationType = StateToProps & DispatchToProps
type SetPeer = {
  readonly action: string
  readonly peer: Peer
}

class CallingNotification extends React.PureComponent<
  CallingNotificationType,
  CallingState
> {
  private autoHangupTimeoutId: any = null

  private readonly activeSpeaker$: Subject<any> = new Subject()

  private readonly setActiveSpeakerSub: Subscription = this.activeSpeaker$
    .pipe(bufferTime(3000))
    .subscribe((vals) => {
      const { setActivePeer } = this.props
      const highest = findSpeaker(vals)
      highest.volume > 0 && setActivePeer(highest.uid)
    })

  constructor(props: CallingNotificationType) {
    super(props)
    const { joinCall } = this.props
    this.state = {
      soundObject: new Audio.Sound(),
      ringtoneLoaded: false,
      isPlayingRingtone: false,
      // eslint-disable-next-line react/no-unused-state
      durationTime: millisToMinutesAndSeconds(Date.now() - joinCall.joinedTime),
      isActive: true,
    }
  }

  public async componentDidMount() {
    const {
      setJoinCallSuccessful,
      setPeers,
      leaveChannelSuccessful,
      setSpeakerMode,
      setCallDisplayText,
    } = this.props
    const { isActive } = this.state
    const callingEngine: RtcEngine = getCallingEngine()
    callingEngine?.addListener("JoinChannelSuccess", () => {
      setJoinCallSuccessful(0)
      callingEngine
        .isSpeakerphoneEnabled()
        .then((isEnabled) => () =>
          setTimeout(setSpeakerMode(isEnabled ? 3 : 1), 400)
        )
    })
    // callingEngine?.addListener('Warning', (warn: any) => {
    //     console.log('Calling Warning'+ warn)
    // })

    // callingEngine?.addListener('Error', (err: any) => {
    //     console.log('Calling Error'+ err)
    // })

    callingEngine?.addListener(
      "RemoteVideoStateChanged",
      (uid: number, state: VideoRemoteState) => {
        setPeers({
          action: SetPeersAction.SetVideoMode,
          peer: {
            agoraUuid: uid,
            isVideoEnabled: !(state === 0 || state === 4),
          },
        })
      }
    )

    callingEngine?.addListener(
      "RemoteAudioStateChanged",
      (uid: number, state: AudioRemoteState) => {
        setPeers({
          action: SetPeersAction.SetMuteMode,
          peer: {
            agoraUuid: uid,
            isMuted: !!(state === 0 || state === 4),
          },
        })
      }
    )

    callingEngine?.addListener(
      "UserOffline",
      (uid: number, reason: UserOfflineReason) => {
        setPeers({
          action: SetPeersAction.SetPeerOffline,
          peer: { agoraUuid: uid, isAudience: reason === 2 },
        })
      }
    )
    // add peer to state
    callingEngine?.addListener("UserJoined", (uid: number) => {
      setPeers({
        action: SetPeersAction.SetPeerJoinIn,
        peer: { agoraUuid: uid },
      })
    })

    callingEngine?.addListener("LeaveChannel", () => {
      leaveChannelSuccessful()
    })

    callingEngine?.addListener(
      "AudioVolumeIndication",
      (speakers: AudioVolumeInfo[]) => {
        this.activeSpeaker$.next(speakers)
        this.setPeersVolume(speakers)
      }
    )

    callingEngine?.addListener(
      "AudioRouteChanged",
      (routing: AudioOutputRouting) => {
        setSpeakerMode(routing)
      }
    )
    await this.loadRingtone()
    AppState.addEventListener("change", this.autoStopRingtoneInBackground)
    DeviceEventEmitter.addListener("floating-bubble-press", () => {
      reopenApp()
    })
    DeviceEventEmitter.addListener("floating-bubble-remove", () => {
      const { channel, me } = this.props
      if (!isActive) {
        setCallDisplayText(CallDisplayText.callEnded)
        leaveCallingChannel(channel, me)
      }
    })
  }

  public async componentDidUpdate(
    prevProps: CallingNotificationType,
    prevState: CallingState
  ) {
    const {
      joinCall,
      peers,
      channel,
      isCalling,
      isCaller,
      setJoinCallSuccessful,
      setCallDisplayText,
      isHost,
      chatSummary,
      me,
      callerUuid,
      audioSetting,
      isGroup,
    } = this.props
    this.setCallingRole(prevProps.audioSetting, audioSetting)
    const { isActive } = this.state
    const activePeerSize = peers.filter((item) => item.isActive).size
    const prevActivePeerSize = prevProps.peers.filter((item) => item.isActive)
      .size
    const total =
      activePeerSize +
      (chatSummary && chatSummary.agora
        ? JSON.parse(chatSummary?.agora.toString()).audience_total
        : 0)
    const prevTotal =
      prevActivePeerSize +
      (prevProps.chatSummary && prevProps.chatSummary.agora
        ? JSON.parse(prevProps.chatSummary?.agora.toString()).audience_total
        : 0)

    if (!prevProps.joinCall.isJoined && joinCall.isJoined && total === 0) {
      if (!isCaller) {
        !this.autoHangupTimeoutId &&
          (this.autoHangupTimeoutId = setTimeout(() => {
            setCallDisplayText(CallDisplayText.noAnswer)
            this.stopRingtone()
          }, 5000))
      } else {
        !this.autoHangupTimeoutId &&
          (this.autoHangupTimeoutId = setTimeout(() => {
            const callNoAnswerMessage = {
              data: CallSignal.callEndNoAnswer,
              action: CallSignal.callEndNoAnswer,
              isTyping: false,
              sender: me.uuid,
              avatar: me.avatar,
              senderUsername: me.username,
              type: MessageType.Call,
              uuid: quickUuid(),
            }
            setCallDisplayText(CallDisplayText.noAnswer)
            publishMessage(callNoAnswerMessage, channel)
            this.stopRingtone()
          }, 60000))
      }
    }

    if (
      joinCall.isJoined &&
      activePeerSize === 0 &&
      !isHost &&
      (prevActivePeerSize !== 0 || prevProps.isHost)
    ) {
      if (isCaller || isHost) {
        const endCallMessage = {
          data: CallSignal.endCall,
          action: CallSignal.endCall,
          isTyping: false,
          sender: me.uuid,
          avatar: me.avatar,
          senderUsername: me.username,
          type: MessageType.Call,
          uuid: quickUuid(),
        }
        !this.autoHangupTimeoutId &&
          (this.autoHangupTimeoutId = setTimeout(() => {
            setCallDisplayText(CallDisplayText.callEnded)
            publishMessage(endCallMessage, channel)
          }, 60000))
      } else {
        !this.autoHangupTimeoutId &&
          (this.autoHangupTimeoutId = setTimeout(() => {
            setCallDisplayText(CallDisplayText.callEnded)
          }, 60000))
      }
    }

    if (
      prevActivePeerSize === 0 &&
      !prevProps.isHost &&
      (activePeerSize !== 0 || isHost)
    ) {
      this.autoHangupTimeoutId && clearTimeout(this.autoHangupTimeoutId)
      this.autoHangupTimeoutId = null
    }

    if (
      (!isCaller &&
        callerUuid !== CALLER_FOR_JOIN &&
        !prevProps.isCalling &&
        isCalling) ||
      (isCaller && isHost && !prevProps.joinCall.isJoined && joinCall.isJoined)
    ) {
      this.playRingtone()
    }

    if (
      (prevProps.peers.size === 0 && total > 0) ||
      (prevProps.isCalling && !isCalling)
    ) {
      const callingEngine = getCallingEngine()
      callingEngine.setEnableSpeakerphone(true)
      this.stopRingtone()
      this.autoHangupTimeoutId && clearTimeout(this.autoHangupTimeoutId)
      this.autoHangupTimeoutId = null
    }

    // Somehow prevProps.peers.size not equals 0, it will not end the ringTone, so to fix it, compare prevTotal and total, if new people join, if the ringtone is playing, then stop it.
    if (total > prevTotal) {
      this.stopRingtone()
      if (this.autoHangupTimeoutId) {
        clearTimeout(this.autoHangupTimeoutId)
        this.autoHangupTimeoutId = null
      }
    }

    if (prevProps.peers.size === 0 && peers.size > 0) {
      setJoinCallSuccessful(new Date().getTime())
    }

    if (!prevState.isActive && isActive) {
      if (total === 0) {
        setCallDisplayText(CallDisplayText.callEnded)
      }
    }

    if (!isGroup && prevTotal !== 0 && total === 0) {
      setCallDisplayText(CallDisplayText.callEnded)
    }
  }

  public componentWillUnmount() {
    this.autoHangupTimeoutId && clearTimeout(this.autoHangupTimeoutId)
    this.autoHangupTimeoutId = null
    const { soundObject } = this.state
    if (soundObject) {
      soundObject.unloadAsync()
    }
  }

  private setPeersVolume(speakers: AudioVolumeInfo[]) {
    const { setMeIsSpeaking, setPeers, peers, audioSetting } = this.props
    const peersVolumeMap = new Map()
    const peersUids = [...peers.keys()]
    peersUids.forEach((uid) => {
      peersVolumeMap.set(uid, { volume: 0 })
    })
    speakers.forEach((speaker) => {
      if (speaker.uid === 0) {
        const prevMeIsSpeaking = audioSetting.isSpeaking
        const currentMeIsSpeaking =
          speaker.volume > IS_SPEAKING_VOLUME_THRESHOLD
        const shouldUpdateMeState = prevMeIsSpeaking !== currentMeIsSpeaking
        shouldUpdateMeState && setMeIsSpeaking(currentMeIsSpeaking)
      } else {
        peersVolumeMap.set(speaker.uid, { volume: speaker.volume })
      }
    })
    peersVolumeMap.forEach((value, key) => {
      const oldPeer = peers.get(key)
      const prevPeerIsSpeaking = !!oldPeer?.isSpeaking
      const currentPeerIsSpeaking = value.volume > IS_SPEAKING_VOLUME_THRESHOLD
      const shouldUpdatePeerState = prevPeerIsSpeaking !== currentPeerIsSpeaking
      shouldUpdatePeerState &&
        setPeers({
          action: SetPeersAction.SetPeersVolume,
          peer: { agoraUuid: key, isSpeaking: currentPeerIsSpeaking },
        })
    })
  }

  private readonly autoStopRingtoneInBackground = (
    appState: AppStateStatus
  ) => {
    const { me, joinCall, peers } = this.props
    const callNoAnswerMessage = {
      data: CallSignal.callEndNoAnswer,
      action: CallSignal.callEndNoAnswer,
      isTyping: false,
      sender: me.uuid,
      avatar: me.avatar,
      senderUsername: me.username,
      type: MessageType.Call,
      uuid: quickUuid(),
    }
    if (appState.match(/inactive|background/) && joinCall.isJoined) {
      this.setState({ isActive: false })
      if (peers.size === 0) {
        const { setCallDisplayText, channel } = this.props
        setCallDisplayText(CallDisplayText.noAnswer)
        publishMessage(callNoAnswerMessage, channel)
        this.stopRingtone()
      }
      Platform.OS === "android" &&
        checkPermission().then(
          (isPermited: boolean) => isPermited && showFloatingBubble(10, 10)
        )
    }
    if (appState === "active") {
      this.setState({ isActive: true })
      Platform.OS === "android" && hideFloatingBubble()
    }
  }

  private playRingtone = async () => {
    const { soundObject, ringtoneLoaded } = this.state
    try {
      if (ringtoneLoaded) {
        await soundObject.playAsync()
        this.setState({ isPlayingRingtone: true })
      } else {
        await this.loadRingtone()
        await soundObject.playAsync()
        this.setState({ isPlayingRingtone: true })
      }
    } catch (error) {
      // console.log(error)
    }
  }

  private stopRingtone = async () => {
    const { isPlayingRingtone, soundObject } = this.state
    try {
      if (isPlayingRingtone) {
        await soundObject.stopAsync()
        this.setState({ isPlayingRingtone: false })
      }
    } catch (error) {
      // console.log(error)
    }
  }

  private loadRingtone = async () => {
    const { soundObject } = this.state
    const status = await soundObject.loadAsync(
      require("../../../assets/sounds/ring.wav")
    )
    this.setState({ ringtoneLoaded: status.isLoaded })
    await soundObject.setStatusAsync({
      volume: 1.0,
      isLooping: true,
    })
  }

  public readonly toggleCallRole = (): void => {
    const { isHost, toggleHost } = this.props
    setCallRole(isHost).then(() => toggleHost())
  }

  public readonly setCallingRole = (
    prevAudioSetting: AudioSetting,
    currentCallingSetting: AudioSetting
  ): void => {
    const { isHost, isGroup } = this.props
    if (!isGroup) return
    if (
      !isAudioVideoAllMuted(prevAudioSetting) &&
      isAudioVideoAllMuted(currentCallingSetting) &&
      isHost
    ) {
      this.toggleCallRole()
    }
    if (
      !isAudioVideoAllMuted(currentCallingSetting) &&
      isAudioVideoAllMuted(prevAudioSetting) &&
      !isHost
    ) {
      this.toggleCallRole()
    }
  }

  public render() {
    const {
      isCalling,
      isCaller,
      joinCall,
      channel,
      chatId,
      isGroup,
      callerUuid,
    } = this.props
    const showCallNotification =
      isCalling &&
      !isCaller &&
      !joinCall.isJoined &&
      callerUuid !== CALLER_FOR_JOIN
    return showCallNotification ? (
      <ReceivingCallNotification
        channel={channel}
        isGroup={isGroup}
        chatId={chatId}
        publishMessage={publishMessage}
      />
    ) : null
  }
}

const mapStateToProps = (state: State): StateToProps => ({
  me: state.user,
  myUuid: selectMyUuid(state),
  channel: selectCallingChannel(state),
  chatId: selectCallingChatId(state),
  peers: selectPeers(state),
  callerUuid: selectCallerUuid(state),
  isCaller: selectIsCaller(state),
  isCalling: selectIsCalling(state),
  isGroup: selectIsGroup(state),
  joinCall: selectJoinCall(state),
  isOpenChat: selectOpenChatChannel(state),
  displayText: selectDisplayText(state),
  isHost: selectIsHost(state),
  chatSummary: selectChatSummary(state.calling.callingChannel)(state),
  audioSetting: selectAudioSetting(state),
})

const mapDispatchToProps = (
  dispatch: Dispatch<CallingAction | ChatAction>
): DispatchToProps => ({
  publishMessage: (message: MessageToPublish, channel: ChatChannel) =>
    dispatch(ChatAction.publishMessage(message, channel)),
  setJoinCallSuccessful: (currentTime: number) =>
    dispatch(CallingAction.setJoinCallSuccessful(currentTime)),
  setPeers: (setPeer: SetPeer) => dispatch(CallingAction.setPeers(setPeer)),
  setCallDisplayText: (displayText: string) =>
    dispatch(CallingAction.setDisplayText(displayText)),
  leaveChannelSuccessful: () =>
    dispatch(CallingAction.leaveChannelSuccessful()),
  setActivePeer: (activePeerId: number) =>
    dispatch(CallingAction.setActivePeer(activePeerId)),
  setSpeakerMode: (speakerMode: number) =>
    dispatch(CallingAction.setSpeakerMode(speakerMode)),
  toggleHost: () => dispatch(CallingAction.toggleHost()),
  setMeIsSpeaking: (isSpeaking: boolean) =>
    dispatch(CallingAction.setMeIsSpeaking(isSpeaking)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CallingNotification)
