/* eslint-disable camelcase */
import { ChatSummary, ChatUser, ParticipantsListObject } from "convose-lib/chat"

export type UsersList = {
  readonly suggestions: ReadonlyArray<ChatUser>
  readonly pages_left: number | string
}

export type PartnersList = {
  readonly chat: ReadonlyArray<ChatSummary>
  readonly participants: { readonly [key: string]: ParticipantsListObject }
  readonly pages_left: number | string
  readonly partnerHasNextPage: boolean
  readonly participantsHasNextPage: boolean
  readonly allUnreadPartnerLoaded: boolean
  readonly currentUnreadIndex: number
}

export type LatestPartner = {
  readonly chat: ChatSummary
}
