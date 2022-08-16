/* eslint-disable complexity */
/* eslint-disable import/no-extraneous-dependencies */

import { OrderedMap } from "immutable"
import { ChatAction, ChatActionType } from "./actions"
import { ChatState } from "./state"
import {
  removeChannelMessage,
  removeNotification,
  setNotification,
  subscribeChannelMessage,
  updateChannelHistory,
  updateChannelUnreadMessages,
  subscribeToChannel,
  updateHistoryFromNewMsgChannel,
  deleteChannelUnreadMessages,
  mergeChannelUnreadMessages,
  markMentionAsReadInChannel,
  markAllMentionsAsReadInChannel,
  addPendingMessage,
  removePendingMessage,
} from "./utils"

const initialChatState: ChatState = {
  channels: OrderedMap(),
  cacheChannels: OrderedMap(),
  notifications: OrderedMap(),
  openChat: null,
  retrievingHistory: false,
  showNotifications: false,
  showPushNotifications: true,
  creatingGroupChannel: false,
  shouldFetchAfterNetRecover: false,
  isPickingImage: false,
  isTakingImage: false,
  inputFormHeight: 0,
  deletedMessagesCount: 0,
  channelPendingMessages: [],
}

export const chatReducer = (
  state: ChatState = initialChatState,
  action: ChatAction
): ChatState => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { payload } = action as any

  switch (action.type) {
    case ChatActionType.GetHistory:
      return {
        ...state,
        retrievingHistory: true,
      }

    case ChatActionType.GetHistorySuccess: {
      return {
        ...state,
        channels: updateChannelHistory(payload, state),
        retrievingHistory: false,
      }
    }

    case ChatActionType.GetUnread: {
      return {
        ...state,
        shouldFetchAfterNetRecover: false,
        retrievingHistory: true,
      }
    }

    case ChatActionType.GetUnreadSuccess: {
      return {
        ...state,
        cacheChannels: updateChannelUnreadMessages(payload, state),
        retrievingHistory: false,
      }
    }

    case ChatActionType.MergeUnreadMessages: {
      return {
        ...state,
        channels: mergeChannelUnreadMessages(payload, state),
        cacheChannels: deleteChannelUnreadMessages(payload, state),
        retrievingHistory: false,
      }
    }

    case ChatActionType.ResetHistory: {
      return {
        ...state,
        channels: OrderedMap(),
        cacheChannels: OrderedMap(),
        channelPendingMessages: [],
      }
    }

    case ChatActionType.SetShouldFetchAfterNetRecover: {
      return {
        ...state,
        shouldFetchAfterNetRecover: true,
      }
    }

    case ChatActionType.ServeSubscriptionMessage: {
      return {
        ...state,
        channels: subscribeChannelMessage(payload, state),
        channelPendingMessages: removePendingMessage(payload, state),
      }
    }

    case ChatActionType.PutNewMsgToHistory: {
      const isOpenchat = state.openChat === payload.chatChannel
      return isOpenchat
        ? state
        : {
            ...state,
            channels: updateHistoryFromNewMsgChannel(payload, state),
          }
    }

    case ChatActionType.SetOpenChat:
      return {
        ...state,
        openChat: payload,
      }

    case ChatActionType.SetNotification:
      return {
        ...state,
        notifications: setNotification(payload, state),
      }

    case ChatActionType.RemoveNotification:
      return state.notifications.has(payload.channel)
        ? {
            ...state,
            notifications: removeNotification(payload, state),
          }
        : state

    case ChatActionType.StartNotifying:
      return {
        ...state,
        showNotifications: true,
      }

    case ChatActionType.StopNotifying:
      return {
        ...state,
        showNotifications: false,
      }

    case ChatActionType.DeleteMessageSuccess:
      return {
        ...state,
        channels: removeChannelMessage(payload, state),
        deletedMessagesCount:
          state.deletedMessagesCount > 1000
            ? 0
            : state.deletedMessagesCount + 1,
      }
    case ChatActionType.CreateGroupChat:
    case ChatActionType.AddToGroupChat:
      return {
        ...state,
        creatingGroupChannel: true,
      }

    case ChatActionType.CreateGroupChatSuccess:
    case ChatActionType.AddToGroupChatSuccess:
      return {
        ...state,
        creatingGroupChannel: false,
        // openChat: payload.channel,
        channels: subscribeToChannel(payload, state),
      }

    case ChatActionType.DeleteMessageFailure:
    case ChatActionType.AddToGroupChatFailure:
      return {
        ...state,
        creatingGroupChannel: false,
      }

    case ChatActionType.ToggleLocalPNSettings:
      return {
        ...state,
        showPushNotifications: !state.showPushNotifications,
      }

    case ChatActionType.SetPushNotificationsSettingSuccess:
      return {
        ...state,
        showPushNotifications: payload,
      }

    case ChatActionType.SetIsPickingImage:
      return {
        ...state,
        isPickingImage: payload,
      }

    case ChatActionType.SetIsTakingImage:
      return {
        ...state,
        isTakingImage: payload,
      }

    case ChatActionType.MarkMentionAsRead:
      return {
        ...state,
        channels: markMentionAsReadInChannel(payload, state),
      }

    case ChatActionType.MarkAllMentionsAsRead:
      return {
        ...state,
        channels: markAllMentionsAsReadInChannel(payload, state),
      }

    case ChatActionType.SetInputFormHeight:
      return {
        ...state,
        inputFormHeight: payload,
      }
    case ChatActionType.PublishPendingMessage:
      return {
        ...state,
        channelPendingMessages: addPendingMessage(payload, state),
      }
    case ChatActionType.LeaveGroupDone:
      return {
        ...state,
        channels: state.channels.delete(action.payload.chatChannel),
      }
    default:
      return state
  }
}
