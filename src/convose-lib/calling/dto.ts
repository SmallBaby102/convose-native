export type AgoraUuid = number

export type AudioSetting = {
  readonly speakerMode: number
  readonly isAudioEnabled: boolean
  readonly isVideoEnabled: boolean
  readonly muteStateChangeTime: number
  readonly isSpeaking: boolean
}

export type Peer = {
  readonly agoraUuid: AgoraUuid
  readonly uuid?: string
  readonly isMuted?: boolean
  readonly isVideoEnabled?: boolean
  readonly isActive?: boolean
  readonly isAudience?: boolean
  readonly muteStateChangeTime?: number
  readonly isSpeaking?: boolean
}

export type JoinCall = {
  readonly isJoined: boolean
  readonly joinedTime: number
}

export enum SetPeersAction {
  SetPeerJoinIn = "SetPeerJoinIn",
  SetVideoMode = "SetVideoMode",
  SetMuteMode = "SetMuteMode",
  SetPeerOffline = "SetPeerOffline",
  SetPeerActive = "SetPeerActive",
  SetPeersVolume = "SetPeersVolume",
}

export enum CallSignal {
  call = "call",
  endCall = "endCall",
  callEndDecline = "callEnd-Decline",
  callEndBusy = "callEnd-Busy",
  callEndNoAnswer = "callEnd-NoAnswer",
  muted = "muted",
  empty = "empty",
  joined = "callJoined",
}

export enum CallDisplayText {
  callEnded = "Call ended",
  noAnswer = "No answer",
  connecting = "Connecting...",
}

export type CallingParams = {
  readonly myUuid: string
  readonly chatId: string
  readonly myId: number
  readonly caller: string
  readonly callingChannel: string
  readonly isGroup: boolean
  readonly displayText: string
  readonly isHost: boolean
  readonly unmuteAlert: boolean
}
