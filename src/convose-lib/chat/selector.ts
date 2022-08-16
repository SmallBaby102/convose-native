/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable import/no-extraneous-dependencies */
import { createSelector } from "reselect"

import { State } from "convose-lib/store"
import { ChatChannel } from "./dto"
import { ChatState } from "."

export const selectChatFeature = (state: State): ChatState => state.chat
export const selectChatChannelMessages = (chatChannel: ChatChannel) =>
  createSelector(selectChatFeature, (chat) =>
    chat.channels.get(chatChannel)
      ? chat.channels.get(chatChannel)?.messages
      : []
  )
export const selectUnreadCachelMessages = (chatChannel: ChatChannel) =>
  createSelector(selectChatFeature, (chat) =>
    chat.cacheChannels.get(chatChannel)
      ? chat.cacheChannels.get(chatChannel)?.messages
      : []
  )
export const selectChatIsTyping = (chatChannel: ChatChannel) =>
  createSelector(selectChatFeature, (chat) =>
    chat.channels.get(chatChannel)
      ? chat.channels.get(chatChannel)?.isTyping
      : false
  )
export const selectOpenChatChannel = createSelector(
  selectChatFeature,
  (chat) => chat.openChat
)
export const selectNotifications = createSelector(
  selectChatFeature,
  (chat) => chat.notifications
)
export const selectRetrievingHistory = createSelector(
  selectChatFeature,
  (chat) => chat.retrievingHistory
)
export const selectInputFormHeight = createSelector(
  selectChatFeature,
  (chat) => chat.inputFormHeight
)
export const selectDeletedMessagesCount = createSelector(
  selectChatFeature,
  (chat) => chat.deletedMessagesCount
)

export const selectNewInterest = (state: State) => state.interests.newInterest
export const selectShowPopup = (state: State) => state.interests.showPopup

export const selectCreatingGroupChat = createSelector(
  selectChatFeature,
  (chat) => chat.creatingGroupChannel
)
export const selectShowNotifications = createSelector(
  selectChatFeature,
  (chat) => chat.showNotifications
)
export const selectPagesLeft = (chatChannel: ChatChannel) =>
  createSelector(selectChatFeature, (chat) =>
    chat.channels.get(chatChannel)
      ? chat.channels.get(chatChannel)?.pagesLeft
      : 0
  )
export const selectActualPage = (chatChannel: ChatChannel) =>
  createSelector(selectChatFeature, (chat) =>
    chat.channels.get(chatChannel)
      ? chat.channels.get(chatChannel)?.actualPage
      : 0
  )

export const selectIsUnreadAllLoaded = (chatChannel: ChatChannel) =>
  createSelector(selectChatFeature, (chat) =>
    chat.cacheChannels.get(chatChannel)
      ? chat.cacheChannels.get(chatChannel)?.pagesLeft
      : 0
  )

export const selectUnreadMessagePage = (chatChannel: ChatChannel) =>
  createSelector(selectChatFeature, (chat) =>
    chat.cacheChannels.get(chatChannel)
      ? chat.cacheChannels.get(chatChannel)?.actualPage
      : 0
  )

export const selectShouldFetchAfterNetRecover = createSelector(
  selectChatFeature,
  (chat) => chat.shouldFetchAfterNetRecover
)

export const selectShowPushNotifications = createSelector(
  selectChatFeature,
  (chat) => chat.showPushNotifications
)

export const selectUnreadMentions = (chatChannel: ChatChannel) =>
  createSelector(selectChatFeature, (chat) =>
    chat.channels.get(chatChannel)
      ? chat.channels.get(chatChannel)?.unreadMentions
      : []
  )

export const selectReadMentions = (chatChannel: ChatChannel) =>
  createSelector(selectChatFeature, (chat) =>
    chat.channels.get(chatChannel)
      ? chat.channels.get(chatChannel)?.readMentions
      : []
  )
export const selectPendingMessages = (chatChannel: ChatChannel) =>
  createSelector(
    selectChatFeature,
    (chat) =>
      chat.channelPendingMessages.find(
        (pendingMessages) => pendingMessages.chatChannel === chatChannel
      )?.pendingMessages || []
  )
export const selectAllPendingMessages = createSelector(
  selectChatFeature,
  (chat) => chat.channelPendingMessages
)
