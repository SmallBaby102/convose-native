/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AudioSetting, CallSignal } from "convose-lib/calling"
import {
  MESSAGE_LIMIT,
  removeItem,
  UNREAD_MAX_PAGES_THRESHOLD,
} from "convose-lib/utils"
import { compareAsc } from "date-fns"
import { OrderedMap } from "immutable"
import _, { uniq } from "lodash"
import uniqBy from "lodash.uniqby"

import {
  Chat,
  ChatChannel,
  Message,
  Notification,
  ChatSummary,
  ChatHistoryMessages,
  MessageType,
  ChannelPendingMessages,
  PendingMessage,
  ChatSubscryptionMessage,
} from "../dto"
import { ChatState } from "../state"

export function updateChannelHistory(
  payload: ChatHistoryMessages,
  state: ChatState
): OrderedMap<ChatChannel, Chat> {
  const { chatChannel, pagesLeft, nextPage } = payload
  const { messages, mentions } = payload.messages
  return state.channels.has(chatChannel)
    ? state.channels.update(chatChannel, (existingChat) => ({
        actualPage: nextPage
          ? existingChat.actualPage + 1
          : existingChat.actualPage,
        messages: uniqBy(
          [...existingChat.messages, ...messages],
          "uuid"
        ).sort((a, b) => compareAsc(a.created_at, b.created_at)),
        pagesLeft,
        unreadMentions: uniq([
          ...mentions.filter(
            (mention: string) =>
              !(existingChat.readMentions || []).includes(mention)
          ),
          ...(existingChat.unreadMentions || []),
        ]),
        readMentions: [...(existingChat.readMentions || [])],
        isTyping: existingChat.isTyping,
      }))
    : state.channels.set(chatChannel, {
        actualPage: 0,
        messages: messages.sort((a: Message, b: Message) =>
          compareAsc(a.created_at, b.created_at)
        ),
        unreadMentions: mentions,
        readMentions: [],
        pagesLeft,
        isTyping: false,
      })
}

export function updateChannelUnreadMessages(
  payload: ChatHistoryMessages,
  state: ChatState
): OrderedMap<ChatChannel, Chat> {
  const { chatChannel, pagesLeft } = payload
  const { messages, mentions } = payload.messages
  const historyMessages = state.channels.get(chatChannel)?.messages
  // Here in urnead, pagesLeft is used as a flag to decide if continue to load, 0 represent all unread loaded
  const unreadPagesLeft =
    pagesLeft <= 0 ||
    messages.length < MESSAGE_LIMIT ||
    (historyMessages &&
      messages.length > 0 &&
      messages[messages.length - 1] &&
      historyMessages.findIndex(
        (chat: Message) => chat.uuid === messages[messages.length - 1].uuid
      ) !== -1)
      ? 0
      : 1
  return state.cacheChannels.has(chatChannel)
    ? state.cacheChannels.update(chatChannel, (existingChat) => ({
        actualPage: existingChat.actualPage + 1,
        messages: uniqBy(
          [...existingChat.messages, ...messages],
          "uuid"
        ).sort((a, b) => compareAsc(a.created_at, b.created_at)),
        unreadMentions: uniq([
          ...(existingChat.unreadMentions || []),
          ...mentions,
        ]),
        readMentions: [...(existingChat.readMentions || [])],
        pagesLeft: unreadPagesLeft,
        isTyping: false,
      }))
    : state.cacheChannels.set(chatChannel, {
        actualPage: 0,
        messages: messages.sort((a: Message, b: Message) =>
          compareAsc(a.created_at, b.created_at)
        ),
        unreadMentions: mentions,
        readMentions: [],
        pagesLeft: unreadPagesLeft,
        isTyping: false,
      })
}

export function mergeChannelUnreadMessages(
  payload: any,
  state: ChatState
): OrderedMap<ChatChannel, Chat> {
  const chatChannel = payload
  const cacheChat = state.cacheChannels.get(chatChannel)
  const cacheMessages = cacheChat ? cacheChat.messages : []
  const cacheMentions =
    cacheChat && cacheChat.unreadMentions ? cacheChat.unreadMentions : []
  return state.channels.has(chatChannel)
    ? state.channels.update(chatChannel, (existingChat) => ({
        actualPage:
          existingChat.actualPage +
          (cacheChat ? cacheChat.actualPage : 0) -
          (cacheChat && cacheChat.messages.length > MESSAGE_LIMIT ? 1 : 0),
        // If unread actual page exceeds the limit, app will dump previous chat history and stop loading unread msgs
        messages: uniqBy(
          [
            ...(cacheChat && cacheChat.actualPage >= UNREAD_MAX_PAGES_THRESHOLD
              ? []
              : existingChat.messages),
            ...cacheMessages,
          ],
          "uuid"
        ),
        unreadMentions: uniq([
          ...cacheMentions.filter(
            (mention: string) =>
              !(existingChat.readMentions || []).includes(mention)
          ),
          ...(existingChat.unreadMentions || []),
        ]),
        readMentions: [...(existingChat.readMentions || [])],
        pagesLeft: existingChat.pagesLeft,
        isTyping: false,
      }))
    : state.channels
}

export function deleteChannelUnreadMessages(
  payload: any,
  state: ChatState
): OrderedMap<ChatChannel, Chat> {
  const chatChannel = payload
  return state.cacheChannels.has(chatChannel)
    ? state.cacheChannels.delete(chatChannel)
    : state.cacheChannels
}

export function removeChannelMessage(
  payload: any,
  state: ChatState
): OrderedMap<string, Chat> {
  const { chatChannel, message } = payload

  return state.channels.has(chatChannel)
    ? state.channels.update(chatChannel, (existingChat) => {
        const filteredMessages = existingChat.messages.map((msg) => {
          if (msg.uuid === message.uuid) {
            return {
              ...msg,
              deleted: true,
              data: message.data,
              type: MessageType.Text,
            }
          }
          return msg
        })
        // _.remove(
        //   existingChat.messages,
        //   (m) => m.uuid !== message.uuid
        // )

        return {
          ...existingChat,
          messages: filteredMessages,
        }
      })
    : state.channels
}

export function subscribeChannelMessage(
  payload: any,
  state: ChatState
): OrderedMap<ChatChannel, Chat> {
  const { chatChannel, message, mention } = payload
  // console.log(JSON.stringify(message, null, 2))
  // eslint-disable-next-line no-nested-ternary
  if (state.channels.has(chatChannel)) {
    if (!message.data && message.type === "activity") {
      // is typing update!
      return state.channels.update(chatChannel, (existingChat) => ({
        ...existingChat,
        isTyping: message.myMessage ? existingChat.isTyping : message.isTyping,
      }))
    }
    // new message in existing chanel
    return state.channels.update(chatChannel, (existingChat) => ({
      ...existingChat,
      messages: uniqBy([...existingChat.messages, message], "uuid"),
      unreadMentions: mention
        ? removeItem([...(existingChat.unreadMentions || [])], mention)
        : [...(existingChat.unreadMentions || [])],
      readMentions: mention
        ? uniq([...(existingChat.readMentions || []), mention])
        : [...(existingChat.readMentions || [])],
    }))
  }
  // new chanel
  return state.channels.set(chatChannel, {
    actualPage: 0,
    messages: [message],
    unreadMentions: [],
    readMentions: [],
    pagesLeft: 0,
    isTyping: false,
  })
}

export function updateHistoryFromNewMsgChannel(
  payload: any,
  state: ChatState
): OrderedMap<ChatChannel, Chat> {
  const { chatChannel, message } = payload
  return state.channels.has(chatChannel)
    ? state.channels.update(chatChannel, (existingChat) => ({
        ...existingChat,
        messages: uniqBy(
          [...existingChat.messages, message],
          "uuid"
        ).sort((a, b) => compareAsc(a.created_at, b.created_at)),
      }))
    : state.channels.set(chatChannel, {
        actualPage: 0,
        messages: [message],
        unreadMentions: [],
        readMentions: [],
        pagesLeft: 0,
        isTyping: false,
      })
}

export function markMentionAsReadInChannel(
  payload: any,
  state: ChatState
): OrderedMap<ChatChannel, Chat> {
  const { chatChannel, mention } = payload
  return state.channels.update(chatChannel, (existingChat) => ({
    ...existingChat,
    unreadMentions: removeItem(
      [...(existingChat.unreadMentions || [])],
      mention
    ),
    readMentions: uniq([...(existingChat.readMentions || []), mention]),
  }))
}

export function markAllMentionsAsReadInChannel(
  payload: any,
  state: ChatState
): OrderedMap<ChatChannel, Chat> {
  const { chatChannel } = payload
  return state.channels.update(chatChannel, (existingChat) => ({
    ...existingChat,
    unreadMentions: [],
    readMentions: uniq([
      ...(existingChat.readMentions || []),
      ...(existingChat.unreadMentions || []),
    ]),
  }))
}

export function subscribeToChannel(
  payload: any,
  state: ChatState
): OrderedMap<ChatChannel, Chat> {
  const { channel } = payload as ChatSummary
  return state.channels.has(channel)
    ? state.channels
    : state.channels.set(channel, {
        actualPage: 0,
        messages: [],
        unreadMentions: [],
        readMentions: [],
        pagesLeft: 0,
        isTyping: false,
      })
}

export function setNotification(
  payload: any,
  state: ChatState
): OrderedMap<ChatChannel, Notification> {
  const { channel } = payload
  return state.notifications.has(channel)
    ? state.notifications.update(channel, () => payload)
    : state.notifications.set(channel, payload)
}

export function removeNotification(
  payload: any,
  state: ChatState
): OrderedMap<ChatChannel, Notification> {
  const { channel } = payload

  return state.notifications.get(channel)?.last_message.created_at ===
    payload.last_message.created_at
    ? state.notifications.update(channel, (notification) => ({
        ...notification,
        showed: true,
      }))
    : state.notifications
}

export function getTimeElapesd(time: string): number {
  const startTime = Date.parse(time)
  return Date.now() - startTime
}

// eslint-disable-next-line complexity
export const setCallStatusMessage = (
  text: string,
  senderUsername: string,
  isGroup: boolean,
  isMeCaller: boolean
) => {
  if (text === CallSignal.call && isGroup)
    return [`Call started by ${senderUsername}`, "phone"]
  if (text === CallSignal.callEndDecline && !isGroup)
    return ["Call declined", "phone-hangup"]
  if (text === CallSignal.callEndNoAnswer)
    return isMeCaller
      ? ["No anwser", "phone-missed"]
      : ["You missed a call", "phone-missed"]
  if (text && text.startsWith("Call ended")) return [text, "phone"]
  if (text && text.startsWith(CallSignal.muted)) {
    const textParts = text.split(" ")
    textParts.splice(-1)
    return [[senderUsername, ...textParts].join(" "), "microphone-off"]
  }
  return null
}

export const isAudioVideoAllMuted = (audioSetting: AudioSetting): boolean =>
  !audioSetting.isAudioEnabled && !audioSetting.isVideoEnabled

export function findSpeaker(speakers: any) {
  const volumeLevelsMap = new Map()
  const highest = { volume: 0, uid: NaN }
  speakers.flat().forEach((speaker: { volume: number; uid: number }) => {
    const prevVolumeLevel = volumeLevelsMap.get(speaker.uid)
      ? volumeLevelsMap.get(speaker.uid).volume
      : null
    const sumVolumeLevel = prevVolumeLevel
      ? prevVolumeLevel + speaker.volume
      : speaker.volume
    volumeLevelsMap.set(speaker.uid, { volume: sumVolumeLevel })
    if (sumVolumeLevel > highest.volume) {
      highest.uid = speaker.uid
      highest.volume = sumVolumeLevel
    }
  })
  return highest
}

export function addPendingMessage(
  payload: {
    chatChannel: ChatChannel
    pendingMessage: PendingMessage
  },
  state: ChatState
): ChannelPendingMessages[] {
  const { chatChannel, pendingMessage } = payload
  const { channelPendingMessages } = state
  const thisChannelPendingMessagesIndex = channelPendingMessages.findIndex(
    (pm) => pm.chatChannel === chatChannel
  )
  if (thisChannelPendingMessagesIndex === -1) {
    return [
      ...channelPendingMessages,
      { chatChannel, pendingMessages: [pendingMessage] },
    ]
  }
  return channelPendingMessages.map((pm) => {
    if (pm.chatChannel === chatChannel) {
      return {
        ...pm,
        pendingMessages: [...pm.pendingMessages, pendingMessage],
      }
    }
    return pm
  })
}
export function removePendingMessage(
  payload: ChatSubscryptionMessage,
  state: ChatState
): ChannelPendingMessages[] {
  const { chatChannel, message } = payload
  const { uuid } = message
  const { channelPendingMessages } = state

  return channelPendingMessages
    .map((pm) => {
      if (pm.chatChannel === chatChannel) {
        return {
          ...pm,
          pendingMessages: pm.pendingMessages.filter(
            (msg) => msg.uuid !== uuid
          ),
        }
      }
      return pm
    })
    .filter((pm) => !!pm.pendingMessages.length)
}
