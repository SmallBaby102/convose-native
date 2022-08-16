/* eslint-disable camelcase */
// eslint-disable-next-line import/no-extraneous-dependencies
import { Omit } from "react-redux"

import { Avatar, UserMeta, Uuid } from "convose-lib/user"

export enum ChatType {
  OneToOne = "onetoone",
  Group = "group",
}

export enum MessageType {
  Text = "text",
  Activity = "activity",
  Image = "image",
  Audio = "audio",
  System = "system",
  Call = "call",
}

export enum UserStatus {
  Online = "online",
  Offline = "offline",
}

export enum ChatComponentName {
  "ReturnToCall" = "ReturnToCall",
  "ChatMessageHeader" = "ChatMessageHeader",
  "ChatMessageForm" = "ChatMessageForm",
  "UnmuteAlert" = "UnmuteAlert",
  "PermissionAlert" = "PermissionAlert",
  "AudiencesButton" = "AudiencesButton",
}

export type ChatChannel = string

export type Message = {
  readonly created_at: Date
  readonly data: string
  readonly myMessage: boolean
  readonly receiver: Uuid
  readonly sender: Uuid
  readonly senderUsername: string
  readonly avatar: Avatar
  readonly isTyping?: boolean
  readonly type: MessageType
  readonly updated_at: Date
  readonly uuid: string
  readonly length: number | null
  readonly ratio: number | null
  readonly mentionedIds?: string[]
  readonly mentionText?: string
  readonly publishing?: boolean
  readonly deleted?: boolean
}
export type DeleteMessageType = {
  data: string
  uuid: string
}
export type MessageToPublish = {
  readonly data: string
  readonly action: string
  readonly isTyping: boolean
  readonly sender: Uuid
  readonly avatar?: Avatar
  readonly senderUsername: string
  readonly type: MessageType
  readonly uuid: string
  readonly created_at?: Date
  readonly updated_at?: Date
  readonly receiver?: Uuid
  readonly publishing?: boolean
}

export type MessageToReceive = {
  readonly data: string
  readonly isTyping: boolean
  readonly sender: Uuid
  readonly type: MessageType
  readonly created_at: Date
  readonly uuid: string
  readonly mentionedIds?: string[]
}

export type HistoryMessage = {
  readonly content: string
  readonly created_at: Date
  readonly id: number
  readonly sender?: Uuid
  readonly sender_uuid: Uuid
  readonly sender_username: string
  readonly avatar: Avatar
  readonly updated_at: Date
  readonly uuid: string
  readonly message_type: MessageType
  readonly deleted?: boolean
  readonly length: number | null
  readonly ratio: number | null
  readonly mentionedIds?: string[]
}

export type ChatHistory = {
  readonly chat: ReadonlyArray<HistoryMessage>
  readonly pages_left: number
}

export type ChatHistoryMessages = {
  readonly chatChannel: ChatChannel
  readonly messages: MessagePayload
  readonly pagesLeft: number
  readonly nextPage?: boolean
}

export type MessagePayload = {
  messages: ReadonlyArray<Message>
  mentions: ReadonlyArray<string>
}

export type ChatSubscryptionMessage = {
  readonly chatChannel: ChatChannel
  readonly message: Message
}

export type MessageReceived = {
  readonly message: MessageToReceive
  readonly isTyping: boolean
}

export type ChatUser = UserMeta & {
  readonly avatar: Avatar
  readonly status?: UserStatus
}

export type ParticipantsListObject = {
  readonly [key: string]: ChatUser
}

export type ChatSummary = {
  readonly channel: ChatChannel
  readonly last_message: HistoryMessage
  participants: ParticipantsListObject
  readonly type: ChatType
  readonly unread: {
    readonly count: number
    readonly inbox_read: boolean
  }
  readonly group_name?: string
  readonly unread_count?: number
  readonly is_in_call: boolean
  readonly agora: {
    readonly audience_total: number
    readonly audience: Array<number>
  }
}

export type Notification = Omit<ChatSummary, "last_message"> & {
  readonly last_message: {
    readonly content: string
    readonly created_at: Date
  }
  readonly showed: boolean
}

export type Chat = {
  readonly actualPage: number
  readonly messages: ReadonlyArray<Message>
  readonly unreadMentions: ReadonlyArray<string> | undefined
  readonly readMentions: ReadonlyArray<string> | undefined
  readonly pagesLeft: number
  readonly isTyping: boolean
}

export type AudioMessagePlayer = {
  requestPlay: (uuid: string) => void
  requestStop: (isPause: boolean) => void
  shouldPlay: boolean
  shouldLoad: boolean
}

export type DeleteMessageTypes = {
  readonly selectMessage: (message: Message) => void
  readonly dismissSelectedMessage: () => void
  readonly selectedMessageUUID: Uuid | undefined
}
export type MessageActionType = {
  ioniconName: string
  title: string
  onPress: () => void
}

export type PendingMessage = Message | MessageToPublish
export type PendingMessages = ReadonlyArray<PendingMessage>
export type ChannelPendingMessages = {
  chatChannel: ChatChannel
  pendingMessages: PendingMessages
}
