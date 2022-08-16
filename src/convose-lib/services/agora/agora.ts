/* eslint-disable import/no-extraneous-dependencies */
import { CallSignal } from "convose-lib/calling/dto"
import { publishMessage } from "convose-lib/chat"
import { ChatUser, MessageType } from "convose-lib/chat/dto"
import { quickUuid } from "convose-lib/utils"
import { activateKeepAwake, deactivateKeepAwake } from "expo-keep-awake"
import { Audio } from "expo-av"
import RtcEngine from "react-native-agora"
import { checkPermission, initialize } from "react-native-floating-bubble"
import { Platform } from "react-native"
import { agoraAppId } from "./agora-config"

let callingEngine: RtcEngine
export const initializeCallingEngine = async (): Promise<void> => {
  if (!callingEngine) {
    callingEngine = await RtcEngine.create(agoraAppId)
    await callingEngine.enableVideo()
    await callingEngine.enableLocalAudio(true)
    await callingEngine.enableLocalVideo(false)
    await callingEngine.setChannelProfile(1)
  }
}

export const getCallingEngine = (): RtcEngine => {
  if (!callingEngine) {
    initializeCallingEngine()
  }

  return callingEngine
}

export const joinCallChannel = async (
  channelName: string,
  id: number,
  role: number,
  enableLocalAudio: boolean
): Promise<void> => {
  activateKeepAwake()
  await callingEngine?.enableLocalVideo(false)
  await callingEngine?.setClientRole(role)
  await callingEngine?.muteLocalAudioStream(!enableLocalAudio)
  // Join Channel using null token and channel name
  await callingEngine?.joinChannel(null, channelName, null, id)
  !enableLocalAudio &&
    (await callingEngine.enableAudioVolumeIndication(1000, 3, true))
  Platform.OS === "android" &&
    checkPermission().then((isPermited: boolean) => isPermited && initialize())
}

export const leaveCallingChannel = async (
  chatChannel: string,
  me: ChatUser
): Promise<void> => {
  const emptyMessage = {
    data: CallSignal.empty,
    isTyping: false,
    sender: me.uuid,
    type: MessageType.Call,
    uuid: quickUuid(),
    senderUsername: me.username,
  }
  callingEngine?.leaveChannel()
  callingEngine.enableAudioVolumeIndication(-1, 3, false)
  publishMessage(emptyMessage, chatChannel)
  callingEngine.stopPreview()
  callingEngine.muteLocalAudioStream(false)
  deactivateKeepAwake()
}

export const toggleAudio = async (isAudioEnabled: boolean): Promise<void> => {
  callingEngine?.muteLocalAudioStream(isAudioEnabled)
}
export const toggleSpeaker = async (
  speakerMode: number,
  setSpeakerMode: (speakerMode: number) => void
): Promise<void> => {
  const SPEAKER_ON_CODES = [3, 4]
  const shouldEnableSpeaker = !SPEAKER_ON_CODES.includes(speakerMode)
  setSpeakerMode(shouldEnableSpeaker ? 3 : 1)
  await callingEngine?.setEnableSpeakerphone(shouldEnableSpeaker)
  Audio.setAudioModeAsync({ playThroughEarpieceAndroid: !shouldEnableSpeaker })
}
export const toggleVideo = async (isVideoEnabled: boolean): Promise<void> =>
  callingEngine?.enableLocalVideo(!isVideoEnabled)

export const setCallRole = async (isHost: boolean): Promise<void> => {
  const roleCode = !isHost ? 1 : 2
  callingEngine?.setClientRole(roleCode)
}
