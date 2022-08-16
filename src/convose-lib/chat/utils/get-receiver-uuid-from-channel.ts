import { Uuid } from "convose-lib/user/"
import { ChatChannel } from "../dto"

import { CHAT_CHANNEL_JOINER } from "./const"

export const getReceiverUuidFromChannel = (
  channel: ChatChannel,
  firstUuid: Uuid
): string =>
  channel.split(CHAT_CHANNEL_JOINER).filter((uuid) => uuid !== firstUuid)[0]
