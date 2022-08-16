import { Uuid } from "convose-lib/user"
import { HistoryMessage, Message, MessagePayload } from "../dto"

export const convertToHistory = (
  message: HistoryMessage,
  myUuid: Uuid
): Message => {
  const sender = message.sender ? message.sender : message.sender_uuid
  return {
    created_at: message.created_at,
    data: message.content,
    myMessage: sender === myUuid,
    receiver: "",
    sender,
    type: message.message_type,
    updated_at: message.updated_at,
    uuid: message.uuid,
    senderUsername: message.sender_username,
    avatar: message.avatar,
    length: message.length,
    ratio: message.ratio,
    deleted: message.deleted,
  }
}

export const mapHistory = (
  messages: ReadonlyArray<HistoryMessage>,
  myUuid: Uuid
): MessagePayload => {
  const mentions: string[] = []
  const convertedMessages = messages.map((message) => {
    if (message.mentionedIds && message.mentionedIds.includes(myUuid)) {
      mentions.push(message.uuid)
    }
    return convertToHistory(message, myUuid)
  })
  return { messages: convertedMessages, mentions }
}
