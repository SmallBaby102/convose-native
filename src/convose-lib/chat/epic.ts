/* eslint-disable no-return-assign */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable camelcase */
import { AnyAction } from "redux"
import { combineEpics, Epic, ofType } from "redux-observable"
import { from, Observable, of } from "rxjs"
import {
  catchError,
  debounceTime,
  delay,
  map,
  mergeMap,
  switchMap,
  withLatestFrom,
} from "rxjs/operators"
import { selectMyUuid, selectToken } from "convose-lib/user"
import { Routes } from "convose-lib/router"
import { CallSignal } from "convose-lib/calling"
import { MESSAGE_LIMIT, UNREAD_MAX_PAGES_THRESHOLD } from "convose-lib/utils"
import {
  getNewMessage,
  UsersListAction,
  UsersListActionType,
} from "convose-lib/users-list"
import * as RootNavigation from "../../convose-app/RootNavigation"

import { State } from "../store"
import { ChatAction, ChatActionType } from "./actions"
import {
  deleteMessage,
  getHistory,
  markAsRead,
  publishMessage,
  subscribeChat,
  unsubscribeChat,
  createGroup,
  addToGroup,
  leaveGroup,
  getPnSetting,
  setPnSetting,
  updateGroupName,
} from "./dao"
import { ChatSummary, ChatUser, MessageType } from "./dto"
import {
  selectNotifications,
  selectOpenChatChannel,
  selectShowNotifications,
  selectShowPushNotifications,
} from "./selector"
import { getTimeElapesd } from "./utils"

const NOTIFICATION_TIME_SHOW = 4000
const LoadingUnreadCoolingTime = 200

export const subscribeChatEpic: Epic<AnyAction, AnyAction, State> = (
  action$,
  state$
) =>
  action$.pipe(
    ofType(ChatActionType.SubscribeChat),
    withLatestFrom(state$),
    switchMap(([action, state]) =>
      subscribeChat(action.payload as string, selectMyUuid(state)).pipe(
        map((payload) => ChatAction.serveSubscriptionMessage(payload))
      )
    )
  )

export const getPnSettingEpic: Epic<AnyAction, AnyAction, State> = (
  action$,
  state$
) =>
  action$.pipe(
    ofType(ChatActionType.SubscribeChat),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
      const token = selectToken(state)
      return getPnSetting(token, action.payload).pipe(
        map((response) =>
          ChatAction.setPushNotificationsSettingSuccess(
            response.show_push_notifications
          )
        ),
        catchError((error) =>
          of(ChatAction.setPushNotificationsSettingFailure(error))
        )
      )
    })
  )

export const setPnSettingEpic: Epic<AnyAction, AnyAction, State> = (
  action$,
  state$
) =>
  action$.pipe(
    ofType(ChatActionType.ToggleLocalPNSettings),
    debounceTime(500),
    withLatestFrom(state$),
    switchMap(([, state]) => {
      const token = selectToken(state)
      const channel = selectOpenChatChannel(state) || ""
      const showPushNotifications = selectShowPushNotifications(state)
      return setPnSetting(token, channel, showPushNotifications).pipe(
        map((response) =>
          ChatAction.setPushNotificationsSettingSuccess(
            response.show_push_notifications
          )
        ),
        catchError((error) =>
          of(ChatAction.setPushNotificationsSettingFailure(error))
        )
      )
    })
  )

export const getChatHistoryEpic: Epic<AnyAction, AnyAction, State> = (
  action$,
  state$
) =>
  action$.pipe(
    ofType(ChatActionType.GetHistory),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
      const token = selectToken(state)
      const myUuid = selectMyUuid(state)

      return getHistory(
        action.payload.chatChannel,
        myUuid,
        token,
        action.payload.page,
        action.payload.size
      ).pipe(
        map((response) =>
          ChatAction.getHistorySuccess({
            ...response,
            nextPage: action.payload.size === MESSAGE_LIMIT,
          })
        ),
        catchError((error) => of(ChatAction.getHistoryFailure(error)))
      )
    })
  )

export const getChatUnreadEpic: Epic<AnyAction, AnyAction, State> = (
  action$,
  state$
) =>
  action$.pipe(
    ofType(ChatActionType.GetUnread),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
      const token = selectToken(state)
      const myUuid = selectMyUuid(state)
      const { chatChannel, page, size } = action.payload

      return getHistory(chatChannel, myUuid, token, page, size).pipe(
        map((response) => ChatAction.getUnreadSuccess(response)),
        catchError((error) => of(ChatAction.getUnreadFailure(error)))
      )
    })
  )

// Exceed the following limit for unread pages, app will dump previous chat history and stop loading unread msgs
export const getMoreChatUnreadEpic: Epic<AnyAction, AnyAction, State> = (
  action$,
  state$
) =>
  action$.pipe(
    ofType(ChatActionType.GetUnreadSuccess),
    withLatestFrom(state$),
    map(([action, state]) => {
      const { chatChannel } = action.payload
      const { cacheChannels } = state.chat
      const cacheChat = cacheChannels.get(chatChannel)
      const actualPage = cacheChat ? cacheChat.actualPage : 0
      const isUnreadAllLoaded =
        cacheChat?.pagesLeft === 0 || actualPage >= UNREAD_MAX_PAGES_THRESHOLD
      return isUnreadAllLoaded
        ? ChatAction.mergeUnreadMessages(chatChannel)
        : ChatAction.getUnread(chatChannel, actualPage, MESSAGE_LIMIT)
    })
  )

export const getAllChatUnreadEpic: Epic<AnyAction, AnyAction, State> = (
  action$,
  state$
) =>
  action$.pipe(
    ofType(ChatActionType.MergeUnreadMessages),
    withLatestFrom(state$),
    delay(LoadingUnreadCoolingTime),
    map(([, state]) => {
      const { cacheChannels } = state.chat
      const waitingUnreadChannels = [...cacheChannels.keys()]
      if (waitingUnreadChannels.length === 0)
        return ChatAction.allUnreadedChannelLoaded()
      const nextLoadingChannel = waitingUnreadChannels[0]
      const page = cacheChannels.get(nextLoadingChannel)?.actualPage || 0
      return ChatAction.getUnread(nextLoadingChannel, page, MESSAGE_LIMIT)
    })
  )

export const markAsReadEpic: Epic<AnyAction, AnyAction, State> = (
  action$,
  state$
) =>
  action$.pipe(
    ofType(UsersListActionType.MarkAsRead),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
      const token = selectToken(state)
      const myUuid = selectMyUuid(state)
      return markAsRead(action.payload, myUuid, token).pipe(
        map(() => UsersListAction.markAsReadSuccess(action.payload)),
        catchError((error) => of(UsersListAction.markAsReadFailure(error)))
      )
    })
  )

export const removeNotificationEpic: Epic<AnyAction, ChatAction> = (action$) =>
  action$.pipe(
    ofType(ChatActionType.SetNotification),
    delay(NOTIFICATION_TIME_SHOW),
    map((action) => ChatAction.removeNotification(action.payload))
  )

export const getNewMessageEpic: Epic<AnyAction, AnyAction, State> = (
  action$,
  state$
) =>
  action$.pipe(
    ofType(ChatActionType.StartNotifying),
    withLatestFrom(state$),
    switchMap(([, state]) => {
      const token = selectToken(state)
      // const myUuid = selectMyUuid(state)
      return getNewMessage(token).pipe(
        mergeMap((payload) => {
          interface agoraParticipantsType {
            [key: string]: any
          }
          let agoraParticipants: agoraParticipantsType | null
          if (!payload.chat.agora) {
            agoraParticipants = null
          } else {
            const parsedAgora = JSON.parse(payload.chat.agora.toString())
            agoraParticipants = {}
            parsedAgora.broadcasters.forEach(
              (broadcasterProfile: ChatUser) =>
                (agoraParticipants[
                  broadcasterProfile.uuid
                ] = broadcasterProfile)
            )
            parsedAgora.audience.forEach(
              (audienceProfile: ChatUser) =>
                (agoraParticipants[audienceProfile.uuid] = audienceProfile)
            )
          }
          const actions = [
            ChatAction.serveNotifications({ chat: [payload.chat] }),
            // ChatAction.putNewMsgToHistory({
            //   chatChannel: payload.chat.channel,
            //   message: convertToHistory(payload.chat.last_message, myUuid),
            // }),
            UsersListAction.getLatestPartnerSuccess(payload),
            UsersListAction.getParticipantsSuccess(payload.chat.channel, {
              participants: agoraParticipants,
            }),
          ]
          if (payload.chat.last_message.message_type === "deleted") {
            const { content, uuid } = payload.chat.last_message
            const { channel } = payload.chat
            const message = {
              data: content,
              uuid,
            }
            actions.push(ChatAction.deleteMessageSuccess(channel, message))
          }
          return from(actions)
        }),
        catchError((error) => of(ChatAction.getNewMessageFailure(error)))
      )
    })
  )

// There's no need to unsubscribe from new message channel, when app in background keep subscription can also handle many things, which is useful
// export const stopGettingNewMessageEpic: Epic<AnyAction, AnyAction, State> = (
//   action$,
//   state$
// ) =>
//   action$.pipe(
//     ofType(ChatActionType.StopNotifying),
//     withLatestFrom(state$),
//     switchMap(([action]) =>
//       unsubscribeFromNewMessage().pipe(
//         map(() => UsersListAction.unsubscribeDone())
//       )
//     )
//   )

export const publishMessageEpic: Epic<AnyAction, AnyAction> = (action$) =>
  action$.pipe(
    ofType(ChatActionType.PublishMessage),
    switchMap(({ payload }) =>
      publishMessage(payload.message, payload.channel).pipe(
        map(() => ChatAction.publishMessageSuccess()),
        catchError((error) => of(ChatAction.publishMessageFailure(error)))
      )
    )
  )

export const serveNotificationsEpic: Epic<AnyAction, AnyAction, State> = (
  action$,
  state$
) =>
  action$.pipe(
    ofType(ChatActionType.ServeNotifications),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      const openChannel = selectOpenChatChannel(state)
      const myUuid = selectMyUuid(state)
      const showNotifications = selectShowNotifications(state)
      const notifications: Observable<AnyAction> = action.payload.chat
        .filter((chat: ChatSummary) => {
          const message = selectNotifications(state).get(chat.channel)
          const isNewMessage = message
            ? chat.last_message.created_at !== message.last_message.created_at
            : true
          const isLatestMessage =
            getTimeElapesd(chat.last_message.created_at.toString()) < 600000
          return (
            isNewMessage &&
            isLatestMessage &&
            openChannel !== chat.channel &&
            chat.last_message.sender_uuid !== myUuid &&
            chat.unread.count !== 0 &&
            !(
              chat.last_message.message_type === MessageType.Call &&
              chat.last_message.content === CallSignal.call
            )
          )
        })
        .map((chat: ChatSummary) => {
          const notification = {
            channel: chat.channel,
            last_message: {
              content: chat.last_message.content,
              created_at: chat.last_message.created_at,
              message_type: chat.last_message.message_type,
              uuid: chat.last_message.uuid,
              sender_uuid: chat.last_message.sender_uuid,
              sender_username: chat.last_message.sender_username,
            },
            participants: chat.participants,
            showed: !showNotifications,
            type: chat.type,
            unread: {
              count: 0,
              inbox_read: true,
            },
          }
          return ChatAction.setNotification(notification)
        })
      return from(notifications)
    })
  )

export const unsubscribeChatEpic: Epic<AnyAction, AnyAction, State> = (
  action$,
  state$
) =>
  action$.pipe(
    ofType(ChatActionType.UnsubscribeChat),
    withLatestFrom(state$),
    switchMap(() =>
      unsubscribeChat().pipe(map(() => ChatAction.unsubscribeChatDone()))
    )
  )

export const deleteMessageEpic: Epic<AnyAction, AnyAction, State> = (
  action$,
  state$
) =>
  action$.pipe(
    ofType(ChatActionType.DeleteMessage),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
      const { message, chatChannel } = action.payload
      const token = selectToken(state)
      return deleteMessage(message, chatChannel, token).pipe(
        map(() => ChatAction.deleteMessageRequestSent()),
        catchError((error) => of(ChatAction.deleteMessageFailure(error)))
      )
    })
  )

export const createGroupEpic: Epic<AnyAction, AnyAction, State> = (
  action$,
  state$
) =>
  action$.pipe(
    ofType(ChatActionType.CreateGroupChat),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
      const token = selectToken(state)

      return createGroup(token, action.payload).pipe(
        map((c) => {
          RootNavigation.navigate(Routes.ChatDrawer, {
            screen: Routes.Chat,
            params: {
              channel: c.channel,
              chatUser: Object.values(c.participants)[0],
            },
          })
          return ChatAction.createGroupChatSuccess(c)
        }),
        catchError((error) => of(ChatAction.createGroupChatFailure(error)))
      )
    })
  )

export const addToGroupEpic: Epic<AnyAction, AnyAction, State> = (
  action$,
  state$
) =>
  action$.pipe(
    ofType(ChatActionType.AddToGroupChat),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
      const token = selectToken(state)
      const { userIds, chatChannel } = action.payload

      return addToGroup(token, userIds, chatChannel).pipe(
        map(ChatAction.addToGroupChatSuccess),
        catchError((error) => of(ChatAction.addToGroupChatFailure(error)))
      )
    })
  )

export const leaveGroupEpic: Epic<AnyAction, AnyAction, State> = (
  action$,
  state$
) =>
  action$.pipe(
    ofType(ChatActionType.LeaveGroup),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
      const token = selectToken(state)

      return leaveGroup(token, action.payload).pipe(
        mergeMap(() => {
          RootNavigation.navigate(Routes.ChatboxList, null)

          return from([
            UsersListAction.leaveGroupDone(action.payload),
            ChatAction.leaveGroupDone(action.payload),
          ])
        })
      )
    })
  )

export const updateGroupNameEpic: Epic<AnyAction, AnyAction, State> = (
  action$,
  state$
) =>
  action$.pipe(
    ofType(ChatActionType.UpdateGroupName),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
      const token = selectToken(state)
      const { groupname, chatChannel } = action.payload
      return updateGroupName(token, groupname, chatChannel).pipe(
        map(() =>
          UsersListAction.updateGroupNameSuccess(groupname, chatChannel)
        ),
        catchError((error) => of(ChatAction.updateGroupNameFailure(error)))
      )
    })
  )

export const chatEpic = combineEpics(
  deleteMessageEpic,
  getChatHistoryEpic,
  getChatUnreadEpic,
  getMoreChatUnreadEpic,
  getAllChatUnreadEpic,
  markAsReadEpic,
  publishMessageEpic,
  removeNotificationEpic,
  serveNotificationsEpic,
  subscribeChatEpic,
  unsubscribeChatEpic,
  createGroupEpic,
  addToGroupEpic,
  leaveGroupEpic,
  getNewMessageEpic,
  // stopGettingNewMessageEpic,
  getPnSettingEpic,
  setPnSettingEpic,
  updateGroupNameEpic
)
