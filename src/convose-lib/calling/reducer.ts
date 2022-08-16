/* eslint-disable no-case-declarations */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line import/no-extraneous-dependencies
import { OrderedMap } from "immutable"
import { CallingAction, CallingActionType } from "./actions"
import { CallingState } from "./state"
import { SetPeersAction } from "./dto"

const initialCallingState: CallingState = {
  myUuid: "",
  myId: 0,
  callingChannel: "",
  peers: OrderedMap(),
  isCalling: false,
  caller: "",
  isGroup: false,
  audioSetting: {
    speakerMode: 3,
    isAudioEnabled: false,
    isVideoEnabled: false,
    muteStateChangeTime: 0,
    isSpeaking: false,
  },
  activePeer: 0,
  joinCall: { isJoined: false, joinedTime: 0 },
  displayText: "",
  isHost: false,
  unmuteAlert: false,
  chatId: "",
}

export const callingReducer = (
  state: CallingState = initialCallingState,
  action: CallingAction
): CallingState => {
  const { payload } = action as any

  switch (action.type) {
    case CallingActionType.SetCallingChannel:
      return {
        ...state,
        myUuid: payload.myUuid,
        myId: payload.myId,
        callingChannel: payload.callingChannel,
        chatId: payload.chatId,
        isGroup: payload.isGroup,
        caller: payload.caller,
        displayText: payload.displayText,
        isCalling: true,
        isHost: payload.isHost,
        unmuteAlert: payload.unmuteAlert,
        audioSetting: { ...state.audioSetting, isAudioEnabled: payload.isHost },
      }

    case CallingActionType.SetCallingChannelAfterSignal:
      return {
        ...state,
        myUuid: payload.myUuid,
        myId: payload.myId,
        callingChannel: payload.callingChannel,
        chatId: payload.chatId,
        isGroup: payload.isGroup,
        caller: payload.caller,
        displayText: payload.displayText,
        isCalling: true,
        unmuteAlert: payload.unmuteAlert,
      }
    case CallingActionType.SetCallingToDefault:
    case CallingActionType.LeaveCallingChannelSuccessful:
      return initialCallingState

    case CallingActionType.ToggleAudioMode:
      return {
        ...state,
        audioSetting: {
          ...state.audioSetting,
          isAudioEnabled: !state.audioSetting.isAudioEnabled,
          muteStateChangeTime: Date.now(),
        },
      }

    case CallingActionType.SetSpeakerMode:
      return {
        ...state,
        audioSetting: {
          ...state.audioSetting,
          speakerMode: payload,
        },
      }

    case CallingActionType.ToggleVideoMode:
      return {
        ...state,
        audioSetting: {
          ...state.audioSetting,
          isVideoEnabled: !state.audioSetting.isVideoEnabled,
          muteStateChangeTime: Date.now(),
        },
      }

    case CallingActionType.setMeIsSpeaking:
      return {
        ...state,
        audioSetting: {
          ...state.audioSetting,
          isSpeaking: payload,
        },
      }

    case CallingActionType.ToggleHost:
      return {
        ...state,
        isHost: !state.isHost,
      }

    case CallingActionType.SetPeers:
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const { action, peer } = payload
      const uid = peer.agoraUuid
      if (action === SetPeersAction.SetPeerJoinIn) {
        return {
          ...state,
          peers: state.peers.update(uid, (oldPeer) => ({
            ...oldPeer,
            agoraUuid: uid,
            isActive: true,
            isAudience: false,
          })),
        }
      }
      if (payload.action === SetPeersAction.SetVideoMode) {
        return {
          ...state,
          peers: state.peers.update(uid, (oldPeer) => ({
            ...oldPeer,
            isVideoEnabled: peer.isVideoEnabled,
          })),
        }
      }
      if (action === SetPeersAction.SetMuteMode) {
        return {
          ...state,
          peers: state.peers.update(uid, (oldPeer) => ({
            ...oldPeer,
            isMuted: peer.isMuted,
          })),
        }
      }
      if (action === SetPeersAction.SetPeerOffline) {
        return {
          ...state,
          peers: state.peers.update(uid, (oldPeer) => ({
            ...oldPeer,
            isActive: false,
            isAudience: peer.isAudience,
            muteStateChangeTime: Date.now(),
          })),
        }
      }
      if (action === SetPeersAction.SetPeersVolume) {
        return {
          ...state,
          peers: state.peers.update(uid, (prevPeer) => ({
            ...prevPeer,
            isSpeaking: peer.isSpeaking,
          })),
        }
      }
      return state

    case CallingActionType.SetJoinCallSuccessful:
      return {
        ...state,
        displayText: "",
        joinCall: { isJoined: true, joinedTime: payload },
      }

    case CallingActionType.SetDisplayText:
      return {
        ...state,
        displayText: payload,
      }

    case CallingActionType.SetActivePeer:
      return {
        ...state,
        activePeer: payload,
      }

    case CallingActionType.UnsetUnmuteAlert:
      return {
        ...state,
        unmuteAlert: false,
      }

    default:
      return state
  }
}
