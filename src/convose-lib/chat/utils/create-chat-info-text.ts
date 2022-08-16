import { format, differenceInMinutes } from "date-fns"

import { Message, MessageToPublish } from "convose-lib/chat"

const COMPARE_FORMAT = "DD-MM-YYYY"
const CHAT_FORMAT = "MMMM Do, YYYY"
const CHAT_TIME_FORMAT = "h:mm A"

export const createChatInfoText = (
  message: Message | MessageToPublish,
  nextMessage: Message | MessageToPublish
): string | null => {
  if (!message || !message.created_at || !nextMessage?.created_at) return null
  const createdAt = format(message?.created_at, CHAT_FORMAT)

  if (message?.created_at && !nextMessage) {
    return createdAt
  }

  return format(message?.created_at, COMPARE_FORMAT) !==
    format(nextMessage.created_at, COMPARE_FORMAT)
    ? createdAt
    : null
}

export const createChatIdleText = (
  message: Message | MessageToPublish,
  nextMessage: Message | MessageToPublish
): string | null => {
  // first/only message then datestamp applies so return null
  if (
    (message?.created_at && !nextMessage) ||
    !message?.created_at ||
    !nextMessage.created_at
  ) {
    return null
  }
  const createdAt = format(message?.created_at, CHAT_TIME_FORMAT)

  return differenceInMinutes(message?.created_at, nextMessage.created_at) > 10
    ? createdAt
    : null
}
