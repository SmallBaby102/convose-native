/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */
import faye from "faye"
import { from, Observable, ReplaySubject } from "rxjs"
import { map } from "rxjs/operators"

import { _delete, ENDPOINTS, get, post, patch } from "convose-lib/api"
import {
  ChatChannel,
  getReceiverUuidFromChannel,
  Message,
  MessageType,
} from "convose-lib/chat"
import { logEvent } from "convose-lib/services"
import { AuthToken, Uuid } from "convose-lib/user"
import { FAYE_CONFIG, FAYE_OPTIONS } from "convose-lib/utils"
import {
  ChatHistory,
  ChatHistoryMessages,
  ChatSubscryptionMessage,
  ChatSummary,
  MessageReceived,
  MessageToPublish,
} from "./dto"
import { mapHistory } from "./utils"

let fayeClient: any
let fayeSubscription: any

export const initializeFayeClient = (setFayeIsReady: {
  (): void
  (): void
}): void => {
  if (!fayeClient) {
    fayeClient = new faye.Client(FAYE_CONFIG.production.url, FAYE_OPTIONS)
    fayeClient.disable("autodisconnect")

    fayeClient.on("transport:down", () => {
      // TODO:console.log('Faye is Down', new Date(Date.now()))
    })

    fayeClient.on("transport:up", () => {
      setFayeIsReady()
    })
  }
}

export const publishMessage = (
  message: MessageToPublish,
  chatChannel: ChatChannel
): Observable<any> => {
  if (message.type !== MessageType.Activity) {
    logEvent("sendMessage")
  }

  return from(fayeClient.publish(ENDPOINTS.CHAT + chatChannel, { message }))
}

export const subscribeChat = (
  chatChannel: string,
  myUuid: Uuid
): ReplaySubject<ChatSubscryptionMessage> => {
  const subject = new ReplaySubject<ChatSubscryptionMessage>()

  fayeSubscription = fayeClient.subscribe(
    ENDPOINTS.CHAT + chatChannel,
    (params: MessageReceived) => {
      subject.next({
        chatChannel,
        message: {
          ...params.message,
          created_at: params.message.created_at,
          myMessage: myUuid === params.message.sender,
          receiver: getReceiverUuidFromChannel(
            chatChannel,
            params.message.sender
          ),
          updated_at: new Date(),
        },
        mention: params.message.mentionedIds?.includes(myUuid)
          ? params.message.uuid
          : null,
      })
    }
  )

  logEvent("openChat")

  return subject
}

export const unsubscribeChat = (): Observable<void> => {
  if (fayeClient && fayeSubscription) {
    fayeSubscription.cancel()
  }

  return from([])
}

export const getHistory = (
  chatChannel: ChatChannel,
  myUuid: Uuid,
  Authorization: AuthToken,
  page: number,
  size: number
): Observable<ChatHistoryMessages> =>
  get<ChatHistory>(
    `${ENDPOINTS.CHAT}${chatChannel}?from=${page * size}&limit=${size}`,
    {
      Authorization,
      withCredentials: true,
    }
  ).pipe(
    map((messages) => ({
      chatChannel,
      messages: mapHistory(messages.chat, myUuid),
      pagesLeft: messages.pages_left,
    }))
  )

export const createGroup = (
  Authorization: AuthToken,
  userIds: string[]
): Observable<ChatSummary> =>
  post(
    ENDPOINTS.CREATE_GROUP,
    { user_ids: userIds },
    { Authorization, withCredentials: true }
  )

export const updateGroupName = (
  Authorization: AuthToken,
  groupname: string,
  chatChannel: ChatChannel
): Observable<ChatSummary> =>
  patch(
    `chat/${chatChannel}/update`,
    { groupname },
    {
      Authorization,
      withCredentials: true,
    }
  )

export const addToGroup = (
  Authorization: AuthToken,
  userIds: string[],
  chatChannel: ChatChannel
): Observable<ChatSummary> =>
  post(
    `chat/${chatChannel}/add.json`,
    { user_ids: userIds },
    { Authorization, withCredentials: true }
  )

export const leaveGroup = (
  Authorization: AuthToken,
  chatChannel: ChatChannel
): Observable<void> =>
  post(`chat/${chatChannel}/remove.json`, null, {
    Authorization,
    withCredentials: true,
  })

export const markAsRead = (
  chatChannel: ChatChannel,
  myUuid: Uuid,
  Authorization: AuthToken
): Observable<ChatSummary> =>
  get<ChatSummary>(`/chat/${chatChannel}/read`, {
    Authorization,
    withCredentials: true,
  })

export const deleteMessage = (
  message: Message,
  chatChannel: ChatChannel,
  Authorization: AuthToken
): Observable<void> =>
  _delete(`message/${chatChannel}/${message.uuid}.json`, {
    Authorization,
    withCredentials: true,
  })

export const getPnSetting = (
  Authorization: AuthToken,
  channel: ChatChannel
): Observable<{ show_push_notifications: boolean }> =>
  get(`${ENDPOINTS.CHAT_SETTING}?channel=${channel}`, {
    Authorization,
    withCredentials: true,
  })

export const setPnSetting = (
  Authorization: AuthToken,
  channel: ChatChannel,
  show_push_notifications: boolean
): Observable<{ show_push_notifications: boolean }> =>
  post(
    `${ENDPOINTS.CHAT_SETTING}?channel=${channel}`,
    { show_push_notifications },
    {
      Authorization,
      withCredentials: true,
    }
  )
