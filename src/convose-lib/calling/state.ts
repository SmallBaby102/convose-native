import { OrderedMap } from "immutable"
import { AudioSetting, Peer, JoinCall, AgoraUuid } from "./dto"

export type CallingState = {
  readonly myUuid: string
  readonly myId: number
  readonly callingChannel: string
  readonly chatId: string
  readonly caller: string
  readonly peers: OrderedMap<AgoraUuid, Peer>
  readonly isCalling: boolean
  readonly isGroup: boolean
  readonly audioSetting: AudioSetting
  readonly activePeer: number
  readonly isHost: boolean
  readonly joinCall: JoinCall
  readonly displayText: string
  readonly unmuteAlert: boolean
}
