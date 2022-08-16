/* eslint-disable no-else-return */
/* eslint-disable import/no-extraneous-dependencies */
import { AnyAction } from "redux"
import { combineEpics, Epic, ofType } from "redux-observable"
import { from, of } from "rxjs"
import {
  catchError,
  delay,
  map,
  mapTo,
  mergeMap,
  switchMap,
  withLatestFrom,
} from "rxjs/operators"

import {
  selectMyUuid,
  selectToken,
  UserAction,
  UserActionType,
} from "convose-lib/user"
import { PARTNER_LIMIT } from "convose-lib/utils"
import { ChatAction } from "convose-lib/chat"
import { OnboardingActionType } from "convose-lib/onboarding"
import { blockUser } from "convose-lib/user/dao"
import { State } from "../store"
import { UsersListAction, UsersListActionType } from "./actions"
import {
  getParticipants,
  getPartnersList,
  getUsersList,
  markInboxAsChecked,
  unsubscribeFromUsers,
} from "./dao"

export const getUsersListEpic: Epic<UsersListAction, UsersListAction, State> = (
  action$,
  state$
) =>
  action$.pipe(
    ofType(UsersListActionType.GetUsersList),
    withLatestFrom(state$),
    switchMap(([, state]) => {
      const token = selectToken(state)
      return getUsersList(token).pipe(
        map((payload) => UsersListAction.getUsersListSuccess(payload)),
        catchError((error) => of(UsersListAction.getUsersListFailure(error)))
      )
    })
  )

export const getPartnersListEpic: Epic<AnyAction, AnyAction, State> = (
  action$,
  state$
) =>
  action$.pipe(
    ofType(UsersListActionType.GetPartnersList),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
      const token = selectToken(state)
      return getPartnersList(
        token,
        action.payload.from,
        action.payload.limit
      ).pipe(
        mergeMap((payload) =>
          from([
            UsersListAction.getPartnersListSuccess({
              ...payload,
              // eslint-disable-next-line no-unneeded-ternary
              partnerHasNextPage: payload.chat.length === PARTNER_LIMIT,
            }),
            ChatAction.serveNotifications(payload),
          ])
        ),
        catchError((error) => of(UsersListAction.getPartnersListFailure(error)))
      )
    })
  )

export const getParticipantsEpic: Epic<AnyAction, AnyAction, State> = (
  action$,
  state$
) =>
  action$.pipe(
    ofType(UsersListActionType.GetParticipants),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      const token = selectToken(state)
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const { chatChannel, from, size } = action.payload
      return getParticipants(token, chatChannel, from, size).pipe(
        map((response) =>
          UsersListAction.getParticipantsSuccess(chatChannel, response)
        ),
        catchError((error) => of(UsersListAction.getParticipantsFailure(error)))
      )
    })
  )

export const getUnreadPartnersListEpic: Epic<AnyAction, AnyAction, State> = (
  action$,
  state$
) =>
  action$.pipe(
    ofType(UsersListActionType.GetUnreadPartnersList),
    withLatestFrom(state$),
    switchMap(([, state]) => {
      const token = selectToken(state)
      const hasNext = state.usersList.partners.partnerHasNextPage
      if (!hasNext && state.usersList.loadingUnreadPartner) {
        map(() => UsersListAction.resetUnreadPartnersList())
      }
      return getPartnersList(
        token,
        state.usersList.partners.currentUnreadIndex,
        PARTNER_LIMIT
      ).pipe(
        mergeMap((payload) =>
          from([
            UsersListAction.getUnreadPartnersListSuccess({
              ...payload,
              partnerHasNextPage: payload.chat.length === PARTNER_LIMIT,
            }),
            ChatAction.serveNotifications(payload),
          ])
        ),
        catchError((error) => of(UsersListAction.getPartnersListFailure(error)))
      )
    })
  )

export const getMoreUnreadPartnersListEpic: Epic<
  AnyAction,
  AnyAction,
  State
> = (action$, state$) =>
  action$.pipe(
    ofType(UsersListActionType.GetUnreadPartnersListSuccess),
    withLatestFrom(state$),
    map(([, state]) => {
      return state.usersList.partners.allUnreadPartnerLoaded
        ? UsersListAction.resetUnreadPartnersList()
        : UsersListAction.getUnreadPartnersList()
    })
  )

export const startUpdateUsersListEpic: Epic<UserAction, AnyAction, State> = (
  action$
) =>
  action$.pipe(
    ofType(
      UserActionType.CreateGuestUserSuccess,
      UserActionType.GetUserSuccess
    ),
    mapTo(UsersListAction.getUsersList())
  )

export const startUpdatePartnersListEpic: Epic<AnyAction, AnyAction, State> = (
  action$
) =>
  action$.pipe(
    ofType(UserActionType.GetUserSuccess),
    mergeMap(() =>
      from([
        UsersListAction.getUnreadPartnersList(),
        ChatAction.startNotifying(),
      ])
    )
  )

export const delayedStartUpdatePartnersListEpic: Epic<
  AnyAction,
  AnyAction,
  State
> = (action$) =>
  action$.pipe(
    ofType(OnboardingActionType.HideOnboarding),
    delay(4000),
    mergeMap(() =>
      from([
        UsersListAction.getUnreadPartnersList(),
        ChatAction.startNotifying(),
      ])
    )
  )

export const stopGettingUsersListEpic: Epic<AnyAction, AnyAction, State> = (
  action$,
  state$
) =>
  action$.pipe(
    ofType(UsersListActionType.StopGettingUsersList),
    withLatestFrom(state$),
    switchMap(() =>
      unsubscribeFromUsers().pipe(map(() => UsersListAction.unsubscribeDone()))
    )
  )

export const unreadMessagesSeenEpic: Epic<UsersListAction, AnyAction, State> = (
  action$,
  state$
) =>
  action$.pipe(
    ofType(UsersListActionType.UnreadMessagesSeen),
    withLatestFrom(state$),
    switchMap(([, state]) => {
      const token = selectToken(state)
      const myUuid = selectMyUuid(state)

      return markInboxAsChecked(myUuid, token).pipe(
        map(UsersListAction.unreadMessagesSeenSuccess),
        catchError((error) =>
          of(UsersListAction.unreadMessagesSeenFailure(error))
        )
      )
    })
  )

export const scrollToTopEpic: Epic<AnyAction, UsersListAction, State> = (
  action$
) =>
  action$.pipe(
    ofType(UserActionType.UpdateUserSuccess),
    mapTo(UsersListAction.scrollChatboxesToggle())
  )

export const blockUserEpic: Epic<AnyAction, UsersListAction, State> = (
  action$,
  state$
) =>
  action$.pipe(
    ofType(UsersListActionType.BlockUser),
    withLatestFrom(state$),
    switchMap(([action, state]) =>
      blockUser(action.payload, state.user.authentication_token).pipe(
        mapTo(UsersListAction.blockUserSuccess(action.payload.uuid)),
        catchError((error) => of(UsersListAction.blockUserFailure(error)))
      )
    )
  )

export const usersListEpic = combineEpics(
  stopGettingUsersListEpic,
  getPartnersListEpic,
  getParticipantsEpic,
  getUsersListEpic,
  startUpdatePartnersListEpic,
  startUpdateUsersListEpic,
  delayedStartUpdatePartnersListEpic,
  unreadMessagesSeenEpic,
  scrollToTopEpic,
  getUnreadPartnersListEpic,
  getMoreUnreadPartnersListEpic,
  blockUserEpic
)
