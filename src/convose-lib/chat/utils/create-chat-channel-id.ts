import { Uuid } from "convose-lib/user"
import { ChatChannel, ChatSummary, ChatType } from "../dto"

import {
  CHAT_CHANNEL_JOINER,
  CHAT_IS_ONE_AND_ONE_THRESHOLD,
  USER_UUID_LENGTH,
} from "./const"
export const createChatChannelId = (me: Uuid, user: Uuid): ChatChannel =>
  [me, user].sort().join(CHAT_CHANNEL_JOINER)

export const checkIsGroupByChannel = (channel: ChatChannel): boolean =>
  channel ? channel.length < CHAT_IS_ONE_AND_ONE_THRESHOLD : false

export const checkIsGroup = (
  chatSummary: ChatSummary | null,
  channel: string
): boolean =>
  chatSummary
    ? chatSummary.type === ChatType.Group
    : checkIsGroupByChannel(channel)

// Use shorten channel id as agora room id, one and one chat id is longer than agora limit, so we take first users' uuid
export const shortenChannelId = (channel: string): string =>
  checkIsGroupByChannel(channel) ? channel : channel.substr(0, USER_UUID_LENGTH)
