import { Message, MessageToPublish, MessageType } from "convose-lib/chat"

export const filterMessages = (
  messages: ReadonlyArray<Message | MessageToPublish>
): Array<Message | MessageToPublish> =>
  messages.filter(
    (message) =>
      message.type === MessageType.Text ||
      message.type === MessageType.Image ||
      message.type === MessageType.Audio ||
      message.type === MessageType.System ||
      message.type === MessageType.Call
  )

export const filterContentMessages = (
  messages: ReadonlyArray<Message | MessageToPublish>
): Array<Message | MessageToPublish> =>
  messages.filter(
    (message) =>
      message.type === MessageType.Text ||
      message.type === MessageType.Image ||
      message.type === MessageType.Audio ||
      message.type === MessageType.System
  )
