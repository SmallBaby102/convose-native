/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ActionsUnion, createAction } from "convose-lib/utils"

export enum CallingActionType {
  SetCallingChannel = "[Calling] Set calling channel Params",
  SetCallingChannelAfterSignal = "[Calling] Set calling channel Params after signal",
  JoinChannel = "[Calling] Join a channel",
  LeaveCallingChannel = "[Calling] Leave channel",
  SetSpeakerMode = "[Calling] Toggle speaker mode setting",
  ToggleAudioMode = "[Calling] Toggle local audio mode",
  ToggleVideoMode = "[Calling] Toggle video setting",
  setMeIsSpeaking = "Set me is speaking",
  ToggleHost = "[Calling] Set if is host",
  SetPeers = "[Calling] Set peers",
  SetJoinCall = "[Calling] Set join call",
  SetJoinCallSuccessful = "[Calling] Set join call successful",
  SetDisplayText = "[Calling] Set diplay text",
  LeaveCallingChannelSuccessful = "[Calling] Leave Calling Channel Successful",
  SetActivePeer = "[Calling] Set active peer",
  UnsetUnmuteAlert = "[Calling] Unset unmute alert",
  EMPTY = "[Calling] Pass calling empty action",
  SetCallingToDefault = "[Calling] Set calling to default values",
}

export const CallingAction = {
  setCallingChannel: (callingChannelParams: any) =>
    createAction(CallingActionType.SetCallingChannel, callingChannelParams),
  setCallingChannelAfterSignal: (callingChannelParams: any) =>
    createAction(
      CallingActionType.SetCallingChannelAfterSignal,
      callingChannelParams
    ),
  leaveChannel: () => createAction(CallingActionType.LeaveCallingChannel),
  leaveChannelSuccessful: () =>
    createAction(CallingActionType.LeaveCallingChannelSuccessful),
  setSpeakerMode: (speakerMode: number) =>
    createAction(CallingActionType.SetSpeakerMode, speakerMode),
  toggleAudioMode: () => createAction(CallingActionType.ToggleAudioMode),
  toggleVideoMode: () => createAction(CallingActionType.ToggleVideoMode),
  setPeers: (peer: any) => createAction(CallingActionType.SetPeers, peer),
  setMeIsSpeaking: (isSpeaking: boolean) =>
    createAction(CallingActionType.setMeIsSpeaking, isSpeaking),
  toggleHost: () => createAction(CallingActionType.ToggleHost),
  setJoinCall: () => createAction(CallingActionType.SetJoinCall),
  setJoinCallSuccessful: (joinedTime: number) =>
    createAction(CallingActionType.SetJoinCallSuccessful, joinedTime),
  setDisplayText: (text: string) =>
    createAction(CallingActionType.SetDisplayText, text),
  setActivePeer: (peerIntId: number) =>
    createAction(CallingActionType.SetActivePeer, peerIntId),
  unsetUnmuteAlert: () => createAction(CallingActionType.UnsetUnmuteAlert),
  EMPTY: () => createAction(CallingActionType.EMPTY),
  setCallingToDefault: () =>
    createAction(CallingActionType.SetCallingToDefault),
}

export type CallingAction = ActionsUnion<typeof CallingAction>
