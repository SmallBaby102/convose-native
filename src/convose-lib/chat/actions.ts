/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable import/no-extraneous-dependencies */
import { AjaxError } from "rxjs/ajax"

import { Message } from "convose-lib/chat"
import { PartnersList } from "convose-lib/users-list"
import { ActionsUnion, createAction } from "convose-lib/utils"
import {
  ChatChannel,
  ChatHistoryMessages,
  ChatSubscryptionMessage,
  ChatSummary,
  DeleteMessageType,
  MessageToPublish,
  Notification,
  PendingMessage,
} from "./dto"

export enum ChatActionType {
  GetHistory = "[Chat] Get history",
  GetHistoryFailure = "[Chat] Get history - failure",
  GetHistorySuccess = "[Chat] Get history - success",
  GetUnread = "[Chat] Get unread",
  GetUnreadFailure = "[Chat] Get unread - failure",
  GetUnreadSuccess = "[Chat] Get unread - success",
  PublishMessage = "[Chat] Publish message",
  PublishMessageFailure = "[Chat] Publish message - failure",
  PublishMessageSuccess = "[Chat] Publish message - success",
  RemoveNotification = "[Chat] Remove notification",
  ServeNotifications = "[Chat] Set notifications",
  ServeSubscriptionMessage = "[Chat] Serve subscription message",
  SetInboxIndicator = "[Chat] Set inbox indicator",
  SetNotification = "[Chat] Set notification",
  SetOpenChat = "[Chat] Set open chat",
  StartNotifying = "[Chat] Start notifying",
  StopNotifying = "[Chat] Stop notifying",
  GetNewMessageFailure = "[Chat] Get new message - failure",
  PutNewMsgToHistory = "[Chat] Put new message to history",
  SubscribeChat = "[Chat] Subscribe chat",
  InitializeFaye = "[Chat] Initialize faye",
  UnsubscribeChat = "[Chat] Unsubscribe chat",
  UnsubscribeChatDone = "[Chat] Unsubscribe chat done",
  DeleteMessage = "[Chat] Delete message",
  DeleteMessageSuccess = "[Chat] Delete message - success",
  DeleteMessageRequestSent = "[Chat] Delete message - request sent",
  DeleteMessageFailure = "[Chat] Delete message - failure",
  ToggleChatSettingsMenu = "[User] Toggle chat settings menu",
  CreateGroupChat = "[Chat] Create group chat",
  CreateGroupChatFailure = "[Chat] Create group chat - failure",
  CreateGroupChatSuccess = "[Chat] Create group chat - success",
  AddToGroupChat = "[Chat] Add participants to group chat",
  AddToGroupChatFailure = "[Chat] Add participants to group chat - failure",
  AddToGroupChatSuccess = "[Chat] Add participants to group chat - success",
  LeaveGroup = "[Chat] Leave group",
  LeaveGroupDone = "[Chat] Leave group - success",
  MergeUnreadMessages = "[Chat] Merge unread messages",
  AllUnreadedChannelLoaded = "[Chat] All unreaded cahnnel's messages loaded",
  SetShouldFetchAfterNetRecover = "[Chat] Set should fetch message after net recover",
  ResetHistory = "[Chat] Reset message history after switching account",
  ToggleLocalPNSettings = "[Chat] Toggle local pns setting",
  SetPushNotificationsSetting = "[Chat] Set push notifications setting",
  SetPushNotificationsSettingSuccess = "[Chat] Set push notifications setting - success",
  SetPushNotificationsSettingFailure = "[Chat] Set push notifications setting - failure",
  SetIsPickingImage = "[Chat] Set is picking image",
  SetIsTakingImage = "[Chat] Set is taking image",
  MarkMentionAsRead = "[Chat] Mark mention as read",
  MarkAllMentionsAsRead = "[Chat] Mark all mentions as read",
  SetInputFormHeight = "[Chat] Set input form height",
  UpdateGroupName = "[Chat] Update group name",
  UpdateGroupNameFailure = "[Chat] Update group name failure",
  PublishPendingMessage = "[Chat] Publish pending message",
}

export const ChatAction = {
  deleteMessage: (chatChannel: ChatChannel, message: Message) =>
    createAction(ChatActionType.DeleteMessage, { chatChannel, message }),
  deleteMessageFailure: (error: AjaxError) =>
    createAction(ChatActionType.DeleteMessageFailure, error),
  deleteMessageSuccess: (
    chatChannel: ChatChannel,
    message: DeleteMessageType
  ) =>
    createAction(ChatActionType.DeleteMessageSuccess, {
      chatChannel,
      message,
    }),
  deleteMessageRequestSent: () =>
    createAction(ChatActionType.DeleteMessageRequestSent),
  getHistory: (chatChannel: ChatChannel, page: number, size: number) =>
    createAction(ChatActionType.GetHistory, { chatChannel, page, size }),
  getHistoryFailure: (error: AjaxError) =>
    createAction(ChatActionType.GetHistoryFailure, error),
  getHistorySuccess: (chatMessages: ChatHistoryMessages) =>
    createAction(ChatActionType.GetHistorySuccess, chatMessages),
  getUnread: (chatChannel: ChatChannel, page: number, size: number) =>
    createAction(ChatActionType.GetUnread, { chatChannel, page, size }),
  getUnreadFailure: (error: AjaxError) =>
    createAction(ChatActionType.GetUnreadFailure, error),
  getUnreadSuccess: (chatMessages: ChatHistoryMessages) =>
    createAction(ChatActionType.GetUnreadSuccess, chatMessages),
  initializeFaye: () => createAction(ChatActionType.InitializeFaye),
  publishMessage: (message: MessageToPublish, channel: ChatChannel) =>
    createAction(ChatActionType.PublishMessage, { message, channel }),
  publishMessageFailure: (error: AjaxError) =>
    createAction(ChatActionType.PublishMessageFailure, error),
  publishMessageSuccess: () =>
    createAction(ChatActionType.PublishMessageSuccess),
  removeNotification: (notification: Notification) =>
    createAction(ChatActionType.RemoveNotification, notification),
  serveNotifications: (partnersList: PartnersList) =>
    createAction(ChatActionType.ServeNotifications, partnersList),
  getNewMessageFailure: (error: AjaxError) =>
    createAction(ChatActionType.GetNewMessageFailure, error),
  putNewMsgToHistory: (message: ChatSubscryptionMessage) =>
    createAction(ChatActionType.PutNewMsgToHistory, message),
  serveSubscriptionMessage: (message: ChatSubscryptionMessage) =>
    createAction(ChatActionType.ServeSubscriptionMessage, message),
  setInboxIndicator: (value: boolean) =>
    createAction(ChatActionType.SetInboxIndicator, value),
  setNotification: (notification: Notification) =>
    createAction(ChatActionType.SetNotification, notification),
  setOpenChat: (channel: ChatChannel | null) =>
    createAction(ChatActionType.SetOpenChat, channel),
  startNotifying: () => createAction(ChatActionType.StartNotifying),
  stopNotifying: () => createAction(ChatActionType.StopNotifying),
  subscribeChat: (chatChannel: ChatChannel) =>
    createAction(ChatActionType.SubscribeChat, chatChannel),
  toggleChatSettingsMenu: () =>
    createAction(ChatActionType.ToggleChatSettingsMenu),
  unsubscribeChat: (chatChannel: ChatChannel) =>
    createAction(ChatActionType.UnsubscribeChat, chatChannel),
  unsubscribeChatDone: () => createAction(ChatActionType.UnsubscribeChatDone),
  createGroupChat: (userIds: string[]) =>
    createAction(ChatActionType.CreateGroupChat, userIds),
  createGroupChatFailure: (error: AjaxError) =>
    createAction(ChatActionType.CreateGroupChatFailure, error),
  createGroupChatSuccess: (chatSummary: ChatSummary) =>
    createAction(ChatActionType.CreateGroupChatSuccess, chatSummary),
  addToGroupChat: (userIds: string[], chatChannel: ChatChannel) =>
    createAction(ChatActionType.AddToGroupChat, { userIds, chatChannel }),
  addToGroupChatFailure: (error: AjaxError) =>
    createAction(ChatActionType.AddToGroupChatFailure, error),
  addToGroupChatSuccess: (chatSummary: ChatSummary) =>
    createAction(ChatActionType.AddToGroupChatSuccess, chatSummary),
  leaveGroup: (chatChannel: ChatChannel) =>
    createAction(ChatActionType.LeaveGroup, chatChannel),
  leaveGroupDone: (chatChannel: ChatChannel) =>
    createAction(ChatActionType.LeaveGroupDone, { chatChannel }),
  mergeUnreadMessages: (unreadChannel: ChatChannel) =>
    createAction(ChatActionType.MergeUnreadMessages, unreadChannel),
  allUnreadedChannelLoaded: () =>
    createAction(ChatActionType.AllUnreadedChannelLoaded),
  setShouldFetchAfterNetRecover: () =>
    createAction(ChatActionType.SetShouldFetchAfterNetRecover),
  resetHistory: () => createAction(ChatActionType.ResetHistory),
  toggleLocalPNSettings: () =>
    createAction(ChatActionType.ToggleLocalPNSettings),
  setPushNotificationsSetting: (
    channel: ChatChannel,
    showPushNotifications: boolean
  ) =>
    createAction(ChatActionType.SetPushNotificationsSetting, {
      channel,
      showPushNotifications,
    }),
  setPushNotificationsSettingSuccess: (showPushNotifications: boolean) =>
    createAction(
      ChatActionType.SetPushNotificationsSettingSuccess,
      showPushNotifications
    ),
  setPushNotificationsSettingFailure: (error: AjaxError) =>
    createAction(ChatActionType.SetPushNotificationsSettingFailure, error),
  setIsPickingImage: (isPickingImage: boolean) =>
    createAction(ChatActionType.SetIsPickingImage, isPickingImage),
  setIsTakingImage: (isTakingImage: boolean) =>
    createAction(ChatActionType.SetIsTakingImage, isTakingImage),
  markMentionAsRead: (chatChannel: ChatChannel, mention: string) =>
    createAction(ChatActionType.MarkMentionAsRead, { chatChannel, mention }),
  markAllMentionsAsRead: (chatChannel: ChatChannel) =>
    createAction(ChatActionType.MarkAllMentionsAsRead, { chatChannel }),
  setInputFormHeight: (height: number) =>
    createAction(ChatActionType.SetInputFormHeight, height),
  updateGroupName: (groupname: string, chatChannel: string) =>
    createAction(ChatActionType.UpdateGroupName, { groupname, chatChannel }),
  updateGroupNameFailure: (error: AjaxError) =>
    createAction(ChatActionType.UpdateGroupNameFailure),
  publishPendingMessage: (
    chatChannel: ChatChannel,
    pendingMessage: PendingMessage
  ) =>
    createAction(ChatActionType.PublishPendingMessage, {
      chatChannel,
      pendingMessage,
    }),
}

export type ChatAction = ActionsUnion<typeof ChatAction>
