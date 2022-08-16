// eslint-disable-next-line import/no-extraneous-dependencies
import { OrderedMap } from "immutable"

import { ChannelPendingMessages, Chat, ChatChannel, Notification } from "./dto"

export type ChatState = {
  readonly channels: OrderedMap<ChatChannel, Chat>
  readonly cacheChannels: OrderedMap<ChatChannel, Chat>
  readonly notifications: OrderedMap<ChatChannel, Notification>
  readonly openChat: ChatChannel | null
  readonly retrievingHistory: boolean
  readonly showNotifications: boolean
  readonly showPushNotifications: boolean
  readonly creatingGroupChannel: boolean
  readonly shouldFetchAfterNetRecover: boolean
  readonly isPickingImage: boolean
  readonly isTakingImage: boolean
  readonly inputFormHeight: number
  readonly deletedMessagesCount: number
  readonly channelPendingMessages: ChannelPendingMessages[]
}
