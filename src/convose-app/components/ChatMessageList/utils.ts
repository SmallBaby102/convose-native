import {
  createChatIdleText,
  createChatInfoText,
  Message,
  MessageToPublish,
  MessageType,
} from "convose-lib/chat"
import { filterMessages } from "convose-lib/utils"

export function checkForNewMassages(
  prevMessages: ReadonlyArray<Message | MessageToPublish>,
  nextMessages: ReadonlyArray<Message | MessageToPublish>,
  myUuid: string
): { detectedNewMessage: boolean; lastMessageIsNotMine: boolean } {
  const filteredMessages = filterMessages(nextMessages)
  const filteredPrevMessages = filterMessages(prevMessages)

  const detectedNewMessage =
    filteredMessages[filteredMessages.length - 1] !==
    filteredPrevMessages[filteredPrevMessages.length - 1]

  const lastMessageIsNotMine =
    filteredMessages[filteredMessages.length - 1]?.sender !== myUuid

  return { detectedNewMessage, lastMessageIsNotMine }
}

export function checkIsSameSenderWithUpMsg(
  message: Message | MessageToPublish,
  nextMessage?: Message | MessageToPublish
): boolean {
  return (
    message.sender === nextMessage?.sender &&
    nextMessage?.type !== MessageType.System &&
    nextMessage?.type !== MessageType.Call &&
    !createChatInfoText(message, nextMessage) &&
    !createChatIdleText(message, nextMessage)
  )
}

export function checkIsSameSenderWithDownMsg(
  message: Message | MessageToPublish,
  prevMessage?: Message | MessageToPublish
): boolean {
  return (
    message.sender === prevMessage?.sender &&
    prevMessage?.type !== MessageType.System &&
    prevMessage?.type !== MessageType.Call &&
    !createChatInfoText(prevMessage, message) &&
    !createChatIdleText(prevMessage, message)
  )
}

export function checkIsNotSameSenderWithDownMsg(
  message: Message | MessageToPublish,
  prevMessage?: Message | MessageToPublish
): boolean {
  return (
    message.sender !== prevMessage?.sender ||
    prevMessage?.type === MessageType.System ||
    prevMessage?.type === MessageType.Call ||
    typeof createChatInfoText(prevMessage, message) === "string" ||
    typeof createChatIdleText(prevMessage, message) === "string"
  )
}
