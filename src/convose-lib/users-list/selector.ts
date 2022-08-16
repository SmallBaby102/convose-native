/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// eslint-disable-next-line import/no-extraneous-dependencies
import { createSelector } from "reselect"

import { ChatChannel, ChatUser } from "convose-lib/chat"
import { State } from "convose-lib/store"
import { Uuid } from "convose-lib/user"
import { PartnersList, UsersList } from "./dto"

export const selectUsersListFeature = (state: State) => state.usersList.users
export const selectUsersFeature = createSelector(
  selectUsersListFeature,
  (userList) => (userList ? userList.suggestions : null)
)

export const selectPartnersListFeature = (state: State) =>
  state.usersList.partners
export const selectPartnersFeature = createSelector(
  selectPartnersListFeature,
  (partnersList) => (partnersList ? partnersList.chat : null)
)
export const selectLoadingPartnerFeature = (state: State) =>
  state.usersList.loadingPartner
export const selectUnreadLoadingPartnerFeature = (state: State) =>
  state.usersList.loadingUnreadPartner
export const selectLoadingParticipantsFeature = (state: State) =>
  state.usersList.loadingParticipants
export const selectPartnerHasNextPage = createSelector(
  selectPartnersListFeature,
  (partners) => (partners ? partners.partnerHasNextPage : false)
)
export const selectParticipantsHasNextPage = (state: State) =>
  state.usersList.hasNextPageParticipants

export const selectUnreadCountFeature = createSelector(
  selectPartnersListFeature,
  (partnersList) =>
    partnersList
      ? partnersList.chat.reduce(
          (counter, partner) =>
            counter + (partner.unread.inbox_read ? 0 : partner.unread.count),
          0
        )
      : 0
)

export const selectInboxIndicator = createSelector(
  selectPartnersListFeature,
  (partnersList) =>
    partnersList
      ? Boolean(partnersList.chat.find((chat) => !chat.unread.inbox_read))
      : false
)

export const selectChatSummary = (chatChannel: ChatChannel) =>
  createSelector(selectPartnersListFeature, (partnersList) => {
    if (!chatChannel) return null
    let chatSummary
    if (partnersList) {
      chatSummary = partnersList.chat.find(
        (chat) => chat.channel === chatChannel
      )
    }
    return partnersList && chatSummary ? chatSummary : null
  })

export const selectParticipants = (chatChannel: ChatChannel) =>
  createSelector(selectPartnersListFeature, (partnersList) => {
    if (!chatChannel) return null
    return partnersList.participants[chatChannel]
  })

export const selectParticipantsArray = (chatChannel: ChatChannel) =>
  createSelector(selectPartnersListFeature, (partnersList) => {
    if (!chatChannel) return []
    return partnersList.participants[chatChannel]
      ? Object.values(partnersList.participants[chatChannel])
      : []
  })

export const selectUserFeature = (userId: Uuid) =>
  createSelector(
    selectUsersListFeature,
    selectPartnersListFeature,
    (userList, partnerList) =>
      getUserFromSuggetions(userId, userList) ||
      getUserFromPartners(userId, partnerList) ||
      null
  )

export const selectUserListFeature = (userIds: Uuid[]) =>
  createSelector(
    selectUsersListFeature,
    selectPartnersListFeature,
    (userList, partnerList) => {
      const usersList: ChatUser[] = []
      userIds.forEach((userId) => {
        const user =
          getUserFromSuggetions(userId, userList) ||
          getUserFromPartners(userId, partnerList) ||
          null
        if (user) {
          usersList.push(user)
        }
      })
      return usersList
    }
  )

const getUserFromSuggetions = (userId: Uuid, userList: UsersList | null) =>
  userList &&
  userList.suggestions.find((suggestion) => suggestion.uuid === userId)

const getUserFromPartners = (
  userId: Uuid,
  partnerList: PartnersList | null
) => {
  if (!partnerList) {
    return null
  }

  const partnerParticipants = Object.values(partnerList.participants).find(
    (partner) => !!partner[userId]
  )

  return partnerParticipants && partnerParticipants[userId]
}
