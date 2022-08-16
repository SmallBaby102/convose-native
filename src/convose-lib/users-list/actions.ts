/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { AjaxError } from "rxjs/ajax"

import { ActionsUnion, createAction } from "convose-lib/utils"
import { ChatChannel, ChatSummary, ChatUser } from "convose-lib/chat"
import { LatestPartner, PartnersList, UsersList } from "./dto"

export enum UsersListActionType {
  GetUsersList = "[UsersList] Get users list",
  GetUsersListFailure = "[UsersList] Get users list - failure",
  GetUsersListSuccess = "UsersList - Get users list - success",
  StopGettingUsersList = "[UsersList] Stop getting users list",
  GetPartnersList = "[UsersList] Get partners list",
  GetUnreadPartnersList = "[UsersList] Get Unread partners list",
  GetUnreadPartnersListSuccess = "[UsersList] Get Unread partners list - success",
  GetParticipants = "[Chat] Get participants",
  GetParticipantsFailure = "[Chat] Get participants - failure",
  GetParticipantsSuccess = "[Chat] Get participants - success",
  ResetParticipants = "[Chat] Reset participants",
  ResetUnreadPartnersList = "[UsersList] Reset unread partners list",
  GetPartnersListFailure = "[UsersList] Get partners list - failure",
  GetPartnersListSuccess = "[UsersList] Get partners list - success",
  GetLatestPartnerSuccess = "[UsersList] Get latest partner - success",
  ScrollChatboxesToggle = "[UsersList] Scroll chatboxes - toggle",
  UnreadMessagesSeen = "[UsersList] Unread messages seen",
  UnreadMessagesSeenFailure = "[UsersList] Unread messages seen - failure",
  UnreadMessagesSeenSuccess = "[UsersList] Unread messages seen - success",
  MarkAsRead = "[Chat] Mark as read",
  MarkAsReadFailure = "[Chat] Mark as read - failure",
  MarkAsReadSuccess = "[Chat] Mark as read - success",
  UnsubscribeDone = "[UsersList] Unsubscribe - success",
  ResetPartnersList = "[UsersList] Reset Partners List",
  BlockUser = "[User] Block user",
  BlockUserSuccess = "[User] Block user - success",
  BlockUserFailure = "[User] Block user - failure",
  UpdateGroupNameSuccess = "[Chat] Update group name success",
  EMPTY = "[UsersList] emtpty action",
  LeaveGroupDone = "[UsersList] Leave group - success",
}

export const UsersListAction = {
  blockUser: (user: ChatUser) =>
    createAction(UsersListActionType.BlockUser, user),
  blockUserFailure: (error: AjaxError) =>
    createAction(UsersListActionType.BlockUserFailure, error),
  blockUserSuccess: (uuid: string) =>
    createAction(UsersListActionType.BlockUserSuccess, uuid),
  getPartnersList: (from: number, limit: number) =>
    createAction(UsersListActionType.GetPartnersList, { from, limit }),
  getUnreadPartnersList: () =>
    createAction(UsersListActionType.GetUnreadPartnersList),
  getUnreadPartnersListSuccess: (usersList: PartnersList) =>
    createAction(UsersListActionType.GetUnreadPartnersListSuccess, usersList),
  getPartnersListFailure: (error: AjaxError) =>
    createAction(UsersListActionType.GetPartnersListFailure, error),
  getPartnersListSuccess: (usersList: PartnersList) =>
    createAction(UsersListActionType.GetPartnersListSuccess, usersList),
  getParticipants: (chatChannel: ChatChannel, from: number, limit: number) =>
    createAction(UsersListActionType.GetParticipants, {
      chatChannel,
      from,
      limit,
    }),
  getParticipantsFailure: (error: AjaxError) =>
    createAction(UsersListActionType.GetParticipantsFailure, error),
  getParticipantsSuccess: (
    chatChannel: string,
    // eslint-disable-next-line camelcase
    participants: ChatSummary["participants"] | { pages_left: number }
  ) =>
    createAction(UsersListActionType.GetParticipantsSuccess, {
      chatChannel,
      participants,
    }),
  resetParticipants: (resetChannel: ChatChannel) =>
    createAction(UsersListActionType.ResetParticipants, {
      resetChannel,
    }),
  getLatestPartnerSuccess: (partner: LatestPartner) =>
    createAction(UsersListActionType.GetLatestPartnerSuccess, partner),
  resetUnreadPartnersList: () =>
    createAction(UsersListActionType.ResetUnreadPartnersList),
  getUsersList: () => createAction(UsersListActionType.GetUsersList),
  getUsersListFailure: (error: AjaxError) =>
    createAction(UsersListActionType.GetUsersListFailure, error),
  getUsersListSuccess: (usersList: UsersList) =>
    createAction(UsersListActionType.GetUsersListSuccess, usersList),
  scrollChatboxesToggle: () =>
    createAction(UsersListActionType.ScrollChatboxesToggle),
  stopGettingUsersList: () =>
    createAction(UsersListActionType.StopGettingUsersList),
  unreadMessagesSeen: () =>
    createAction(UsersListActionType.UnreadMessagesSeen),
  unreadMessagesSeenFailure: (error: AjaxError) =>
    createAction(UsersListActionType.UnreadMessagesSeenFailure, error),
  unreadMessagesSeenSuccess: () =>
    createAction(UsersListActionType.UnreadMessagesSeenSuccess),
  markAsRead: (chatChannel: ChatChannel) =>
    createAction(UsersListActionType.MarkAsRead, chatChannel),
  markAsReadFailure: (error: AjaxError) =>
    createAction(UsersListActionType.MarkAsReadFailure, error),
  markAsReadSuccess: (chatChannel: string) =>
    createAction(UsersListActionType.MarkAsReadSuccess, chatChannel),
  unsubscribeDone: () => createAction(UsersListActionType.UnsubscribeDone),
  resetPartnersList: () => createAction(UsersListActionType.ResetPartnersList),
  updateGroupNameSuccess: (groupname: string, chatChannel: string) =>
    createAction(UsersListActionType.UpdateGroupNameSuccess, {
      groupname,
      chatChannel,
    }),
  empty: () => createAction(UsersListActionType.EMPTY),
  leaveGroupDone: (chatChannel: string) =>
    createAction(UsersListActionType.LeaveGroupDone, { chatChannel }),
}

export type UsersListAction = ActionsUnion<typeof UsersListAction>
