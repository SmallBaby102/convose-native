/* eslint-disable import/no-extraneous-dependencies */
import { AnyAction } from "redux"
import { combineEpics, Epic, ofType } from "redux-observable"
import { from, of } from "rxjs"
import {
  catchError,
  map,
  mergeMap,
  switchMap,
  withLatestFrom,
} from "rxjs/operators"

import { HTTP_STATUS_CODE } from "convose-lib/api/http-status-codes"
import { AuthActionType } from "convose-lib/auth"
import { UsersListAction } from "convose-lib/users-list"
import { ChatAction } from "convose-lib/chat"
import { State } from "../store"
import { getToken, handleRequestError, setToken } from "../utils"
import { UserAction, UserActionType } from "./actions"
import {
  createGuestUser,
  getUser,
  registerPushNotifications,
  setUserActive,
  setUserInactive,
  updateAvatar,
  updateUser,
} from "./dao"

export const fetchProfileEpic: Epic<UserAction, UserAction, State> = (
  action$
) =>
  action$.pipe(
    ofType(UserActionType.FetchProfile),
    switchMap(() =>
      getToken().pipe(
        map((token) =>
          token ? UserAction.getUser(token) : UserAction.createGuestUser()
        )
      )
    )
  )

export const createGuestUserEpic: Epic<AnyAction, AnyAction, State> = (
  action$
) =>
  action$.pipe(
    ofType(UserActionType.CreateGuestUser),
    switchMap(() =>
      createGuestUser().pipe(
        map(UserAction.createGuestUserSuccess),
        catchError((error) => handleRequestError(error))
      )
    )
  )

export const getUserAfterAuth: Epic<AnyAction, UserAction, State> = (action$) =>
  action$.pipe(
    ofType(
      AuthActionType.SignUpUserSuccess,
      AuthActionType.SignInUserSuccess,
      AuthActionType.AuthThirdPartySuccess
    ),
    switchMap(({ payload }) =>
      getUser(payload.authentication_token).pipe(
        map(UserAction.getUserSuccess),
        catchError((error) => of(UserAction.getUserFailure(error)))
      )
    )
  )

export const setTokenEpic: Epic<AnyAction, UserAction, State> = (action$) =>
  action$.pipe(
    ofType<AnyAction>(
      UserActionType.CreateGuestUserSuccess,
      AuthActionType.SignUpUserSuccess,
      AuthActionType.SignInUserSuccess,
      AuthActionType.AuthThirdPartySuccess
    ),
    switchMap(({ payload }) =>
      setToken(payload.authentication_token).pipe(
        map(UserAction.setTokenSuccess),
        catchError((error) => of(UserAction.setTokenFailure(error)))
      )
    )
  )

export const getUserEpic: Epic<AnyAction, AnyAction, State> = (action$) =>
  action$.pipe(
    ofType(UserActionType.GetUser),
    switchMap(({ payload }) =>
      getUser(payload).pipe(
        map(UserAction.getUserSuccess),
        catchError((error) => of(UserAction.getUserFailure(error)))
      )
    )
  )

export const getUserFailureEpic: Epic<AnyAction, UserAction, State> = (
  action$
) =>
  action$.pipe(
    ofType(UserActionType.GetUserFailure),
    map(({ payload }) => {
      if (payload.status === HTTP_STATUS_CODE.NOT_FOUND) {
        return UserAction.createGuestUser()
      }

      return UserAction.getUserServerFailure(payload)
    })
  )

export const updateUserEpic: Epic<AnyAction, UserAction, State> = (
  action$,
  state$
) =>
  action$.pipe(
    ofType(UserActionType.UpdateUser),
    withLatestFrom(state$),
    switchMap(([{ payload }, state]) =>
      updateUser(payload, state.user.authentication_token).pipe(
        map(UserAction.updateUserSuccess),
        catchError((error) => of(UserAction.updateUserFailure(error)))
      )
    )
  )

export const updateAvatarEpic: Epic<AnyAction, UserAction, State> = (
  action$,
  state$
) =>
  action$.pipe(
    ofType(UserActionType.UpdateAvatar),
    withLatestFrom(state$),
    switchMap(([{ payload }, state]) =>
      updateAvatar(payload, state.user.authentication_token).pipe(
        map(UserAction.updateAvatarSuccess),
        catchError((error) => of(UserAction.updateAvatarFailure(error)))
      )
    )
  )

export const setUserActiveEpic: Epic<AnyAction, UserAction, State> = (
  action$,
  state$
) =>
  action$.pipe(
    ofType(UserActionType.SetUserActive),
    withLatestFrom(state$),
    switchMap(([, state]) =>
      setUserActive(state.user.authentication_token).pipe(
        map(UserAction.setUserActivitySuccess),
        catchError((error) => of(UserAction.setUserActivityFailure(error)))
      )
    )
  )

export const setUserInactiveEpic: Epic<AnyAction, UserAction, State> = (
  action$,
  state$
) =>
  action$.pipe(
    ofType(UserActionType.SetUserInactive),
    withLatestFrom(state$),
    switchMap(([, state]) =>
      setUserInactive(state.user.authentication_token).pipe(
        map(UserAction.setUserActivitySuccess),
        catchError((error) => of(UserAction.setUserActivityFailure(error)))
      )
    )
  )

export const cleanUserStateAfterSignOutEpic: Epic<
  AnyAction,
  AnyAction,
  State
> = (action$) =>
  action$.pipe(
    ofType(AuthActionType.SignOutUser),
    mergeMap(() =>
      from([
        UserAction.cleanUserStateAfterSignOut(),
        ChatAction.resetHistory(),
        UsersListAction.resetPartnersList(),
      ])
    )
  )

export const registerPushNotificationsEpic: Epic<
  AnyAction,
  UserAction,
  State
> = (action$, state$) =>
  action$.pipe(
    ofType(UserActionType.RegisterPushNotifications),
    withLatestFrom(state$),
    switchMap(([{ payload }, state]) =>
      registerPushNotifications(payload, state.user.authentication_token).pipe(
        map(() => UserAction.registerPushNotificationsSuccess(payload)),
        catchError((error) =>
          of(UserAction.registerPushNotificationsFailure(error))
        )
      )
    )
  )

export const userEpic = combineEpics(
  setUserInactiveEpic,
  setUserActiveEpic,
  createGuestUserEpic,
  getUserEpic,
  getUserFailureEpic,
  fetchProfileEpic,
  setTokenEpic,
  updateAvatarEpic,
  updateUserEpic,
  getUserAfterAuth,
  cleanUserStateAfterSignOutEpic,
  registerPushNotificationsEpic
)
