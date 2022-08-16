/* eslint-disable no-case-declarations */
/* eslint-disable complexity */
import { ChatSummary } from "convose-lib/chat"
// eslint-disable-next-line import/no-extraneous-dependencies
import { uniqBy } from "lodash"
import { UsersListAction, UsersListActionType } from "./actions"
import { UserListState } from "./state"

const initialUserState: UserListState = {
  partners: {
    chat: [],
    participants: {},
    pages_left: "no-pages",
    partnerHasNextPage: false,
    participantsHasNextPage: false,
    allUnreadPartnerLoaded: false,
    currentUnreadIndex: 0,
  },
  scrollChatboxes: false,
  users: null,
  loadingPartner: false,
  loadingUnreadPartner: false,
  loadingParticipants: false,
  hasNextPageParticipants: false,
}

export const usersListReducer = (
  state: UserListState = initialUserState,
  action: UsersListAction
): UserListState => {
  switch (action.type) {
    case UsersListActionType.ScrollChatboxesToggle:
      return {
        ...state,
        scrollChatboxes: !state.scrollChatboxes,
      }

    case UsersListActionType.GetUsersListSuccess:
      return {
        ...state,
        users: { ...action.payload },
      }

    case UsersListActionType.GetPartnersList:
      return {
        ...state,
        loadingPartner: true,
      }
    case UsersListActionType.GetUnreadPartnersList:
      return {
        ...state,
        loadingPartner: true,
        loadingUnreadPartner: true,
      }
    case UsersListActionType.BlockUserSuccess:
      // eslint-disable-next-line no-case-declarations
      const uuid = action.payload
      // eslint-disable-next-line no-case-declarations
      const newChat = state.partners.chat.filter(
        (c) => !c.channel.includes(uuid)
      )
      return {
        ...state,
        partners: { ...state.partners, chat: newChat },
      }
    case UsersListActionType.GetUnreadPartnersListSuccess:
      const existingChat = state.partners.chat
      const unreadChat = action.payload.chat
      const unreadPagesLeft = action.payload.pages_left
      const { partnerHasNextPage } = action.payload
      const isAllLoaded =
        existingChat.length === 0 ||
        unreadChat.length === 0 ||
        unreadPagesLeft === 0 ||
        !partnerHasNextPage ||
        existingChat.findIndex(
          (chat: ChatSummary) =>
            chat &&
            unreadChat &&
            unreadChat.length > 0 &&
            chat.channel === unreadChat[unreadChat.length - 1].channel &&
            chat.last_message.uuid ===
              unreadChat[unreadChat.length - 1].last_message.uuid
        ) !== -1
      return {
        ...state,
        partners: {
          ...state.partners,
          chat: uniqBy([...unreadChat, ...existingChat], "channel").sort(
            (chat, prevChat) =>
              new Date(prevChat.last_message.created_at).getTime() -
              new Date(chat.last_message.created_at).getTime()
          ),
          pages_left: action.payload.pages_left,
          partnerHasNextPage: action.payload.partnerHasNextPage,
          allUnreadPartnerLoaded: isAllLoaded,
          currentUnreadIndex: isAllLoaded
            ? 0
            : state.partners.currentUnreadIndex + unreadChat.length,
        },
        loadingPartner: false,
        loadingUnreadPartner: !isAllLoaded,
      }
    case UsersListActionType.GetPartnersListSuccess:
      return {
        ...state,
        partners: {
          ...state.partners,
          chat: uniqBy(
            [...action.payload.chat, ...state.partners.chat],
            "channel"
          ).sort(
            (chat, prevChat) =>
              new Date(prevChat.last_message.created_at).getTime() -
              new Date(chat.last_message.created_at).getTime()
          ),
          pages_left: action.payload.pages_left,
          partnerHasNextPage: action.payload.partnerHasNextPage,
        },
        loadingPartner: false,
      }
    case UsersListActionType.GetParticipants:
      return {
        ...state,
        loadingParticipants: true,
      }
    case UsersListActionType.GetParticipantsSuccess:
      const { participants, chatChannel } = action.payload
      if (!participants.participants) {
        return state
      }
      const oldParticipants = state.partners.participants[chatChannel] || {}

      return {
        ...state,
        loadingParticipants: false,
        hasNextPageParticipants: participants.pages_left > 0,
        partners: {
          ...state.partners,
          participants: {
            ...state.partners.participants,
            [chatChannel]: {
              ...oldParticipants,
              ...participants.participants,
            },
          },
        },
      }
    case UsersListActionType.ResetParticipants:
      const { resetChannel } = action.payload

      return {
        ...state,
        loadingParticipants: false,
        partners: {
          ...state.partners,
          participants: {
            ...state.partners.participants,
            [resetChannel]: {},
          },
        },
      }
    case UsersListActionType.GetLatestPartnerSuccess:
      const newChatArray = [...state.partners.chat]
      const oldChatIndex = newChatArray.findIndex(
        (chat) => chat.channel === action.payload.chat.channel
      )
      oldChatIndex !== -1 && newChatArray.splice(oldChatIndex, 1)
      newChatArray.unshift(action.payload.chat)
      return {
        ...state,
        partners: {
          ...state.partners,
          chat: newChatArray,
        },
      }
    case UsersListActionType.ResetUnreadPartnersList:
      return {
        ...state,
        partners: {
          ...state.partners,
          allUnreadPartnerLoaded: false,
          currentUnreadIndex: 0,
        },
        loadingPartner: false,
        loadingUnreadPartner: false,
      }
    case UsersListActionType.GetPartnersListFailure:
      return {
        ...state,
        partners: {
          ...state.partners,
          allUnreadPartnerLoaded: false,
          currentUnreadIndex: 0,
          partnerHasNextPage: true,
        },
        loadingPartner: false,
        loadingUnreadPartner: false,
      }
    case UsersListActionType.UnreadMessagesSeenSuccess:
      return {
        ...state,
        partners: {
          ...state.partners,
          chat: state.partners.chat.map((partner) => {
            return {
              ...partner,
              unread: { ...partner.unread, inbox_read: true },
            }
          }),
        },
      }
    case UsersListActionType.MarkAsReadSuccess:
      return {
        ...state,
        partners: {
          ...state.partners,
          chat: state.partners.chat.map((partner) =>
            partner.channel === action.payload
              ? { ...partner, unread: { count: 0, inbox_read: true } }
              : partner
          ),
        },
      }
    case UsersListActionType.ResetPartnersList:
      return initialUserState

    case UsersListActionType.UpdateGroupNameSuccess:
      const { groupname } = action.payload
      return {
        ...state,
        partners: {
          ...state.partners,
          chat: state.partners.chat.map((partner) =>
            partner.channel === action.payload.chatChannel
              ? { ...partner, group_name: groupname }
              : partner
          ),
        },
      }
    case UsersListActionType.LeaveGroupDone:
      return {
        ...state,
        partners: {
          ...state.partners,
          chat: state.partners.chat.filter(
            (chat) => chat.channel !== action.payload.chatChannel
          ),
        },
      }
    default:
      return state
  }
}
