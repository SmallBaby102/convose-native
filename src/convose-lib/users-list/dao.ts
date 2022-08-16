/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-shadow */
// eslint-disable-next-line import/no-extraneous-dependencies
import { from, Observable, ReplaySubject } from "rxjs"

import { ChatChannel, ChatSummary, ChatUser } from "convose-lib/chat/dto"
import { Uuid } from "convose-lib/user"
import {
  Cable,
  get,
  WS_ACTIONCABLE_CHANNEL_SUGGESTIONS,
  ENDPOINTS,
  WS_ACTIONCABLE_CHANNEL_NEWMESSAGECHANNEL,
} from "../api"
import { AuthToken } from "../user/dto"
import { LatestPartner, PartnersList, UsersList } from "./dto"

let UsersSubscribe: any
let NewMessageSubscribe: any
let UsersCable: any
let NewMessageCable: any

export const getUsersList = (token: AuthToken): ReplaySubject<UsersList> => {
  const subject = new ReplaySubject<UsersList>()

  UsersCable = new Cable()
  UsersSubscribe = UsersCable.getConsumer(token).subscriptions.create(
    WS_ACTIONCABLE_CHANNEL_SUGGESTIONS,
    {
      connected: () => {
        // console.log(`connected to ${WS_ACTIONCABLE_CHANNEL_SUGGESTIONS}`)
      },
      disconnected: () => {
        // console.log(`disconnected from ${WS_ACTIONCABLE_CHANNEL_SUGGESTIONS}`)
      },
      received: (data: ReadonlyArray<ChatUser>) => {
        subject.next({
          pages_left: "no-pages",
          suggestions: data,
        })
      },
      rejected: () => {
        subject.error(`rejected from ${WS_ACTIONCABLE_CHANNEL_SUGGESTIONS}`)
      },
    }
  )

  return subject
}

export const unsubscribeFromUsers = (): Observable<void> => {
  if (UsersCable && UsersSubscribe.consumer) {
    UsersCable.closeConnection()
    delete UsersSubscribe.consumer
  }

  return from([])
}

export const getPartnersList = (
  Authorization: AuthToken,
  from: number,
  size: number
): Observable<PartnersList> =>
  get<PartnersList>(`${ENDPOINTS.PARTNERS}?from=${from}&limit=${size}`, {
    Authorization,
    withCredentials: true,
  })

export const getNewMessage = (token: AuthToken): Observable<LatestPartner> => {
  const subject = new ReplaySubject<LatestPartner>()
  NewMessageCable = new Cable()
  NewMessageSubscribe = NewMessageCable.getConsumer(token).subscriptions.create(
    { channel: WS_ACTIONCABLE_CHANNEL_NEWMESSAGECHANNEL, token },
    {
      connected: () => {
        // console.log(`connected to ${WS_ACTIONCABLE_CHANNEL_NEWMESSAGECHANNEL}`)
      },
      disconnected: () => {
        // console.log(
        //   `disconnected from ${WS_ACTIONCABLE_CHANNEL_NEWMESSAGECHANNEL}`
        // )
      },
      received: (data: ChatSummary) => {
        subject.next({
          chat: data,
        })
      },
      rejected: () => {
        subject.error(
          `rejected from ${WS_ACTIONCABLE_CHANNEL_NEWMESSAGECHANNEL}`
        )
      },
    }
  )

  return subject
}

export const unsubscribeFromNewMessage = (): Observable<void> => {
  if (NewMessageCable && NewMessageSubscribe.consumer) {
    NewMessageCable.closeConnection()
    delete NewMessageSubscribe.consumer
  }

  return from([])
}

export const getParticipants = (
  Authorization: AuthToken,
  chatChannel: ChatChannel,
  from: number,
  size: number
): Observable<ChatSummary["participants"]> =>
  get<ChatSummary["participants"]>(
    `${ENDPOINTS.CHAT_PARTICIPANTS}?channel=${chatChannel}&from=${from}&limit=${size}`,
    {
      Authorization,
      withCredentials: true,
    }
  )

export const searchParticipants = (
  Authorization: AuthToken,
  chatChannel: ChatChannel,
  text: string
): Observable<ChatUser[]> =>
  get<ChatUser[]>(`${ENDPOINTS.CHAT + chatChannel}/search?q=${text}`, {
    Authorization,
    withCredentials: true,
  })

export const markInboxAsChecked = (
  myUuid: Uuid,
  Authorization: AuthToken
): Observable<ChatSummary> =>
  get<ChatSummary>(`/inbox/read`, { Authorization, withCredentials: true })
