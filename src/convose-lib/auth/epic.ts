import { AnyAction } from "redux"
import { combineEpics, Epic, ofType } from "redux-observable"
import { of } from "rxjs"
import { catchError, map, switchMap, withLatestFrom } from "rxjs/operators"

import { setAuthError } from "convose-lib/auth/utils"
import { ToastAction, ToastType } from "convose-lib/toast"
import { UserAction } from "convose-lib/user"
import { State } from "../store"
import { AuthAction, AuthActionType } from "./actions"
import {
  signInUser,
  signOutUser,
  signUpUser,
  forgetPassword,
  authThirdParty,
} from "./dao"

export const signUpUserEpic: Epic<AnyAction, AnyAction, State> = (
  action$,
  state$
) =>
  action$.pipe(
    ofType(AuthActionType.SignUpUser),
    withLatestFrom(state$),
    switchMap(([{ payload }, state]) =>
      signUpUser(
        payload.email,
        payload.password,
        state.user.authentication_token
      ).pipe(
        map((payload) => AuthAction.signUpUserSuccess(payload.user)),
        catchError((error) =>
          of(
            AuthAction.signUpUserFailure(error),
            ToastAction.showToast({
              message: setAuthError(error),
              type: ToastType.error,
            })
          )
        )
      )
    )
  )

export const signInUserEpic: Epic<AnyAction, AnyAction, State> = (action$) =>
  action$.pipe(
    ofType(AuthActionType.SignInUser),
    switchMap(({ payload }) =>
      signInUser(payload.email, payload.password).pipe(
        map((payload) => AuthAction.signInUserSuccess(payload.user)),
        catchError((error) =>
          of(
            AuthAction.signInUserFailure(error),
            ToastAction.showToast({
              message: setAuthError(error),
              type: ToastType.error,
            })
          )
        )
      )
    )
  )

export const signOutUserEpic: Epic<AnyAction, AnyAction, State> = (
  action$,
  state$
) =>
  action$.pipe(
    ofType(AuthActionType.SignOutUser),
    withLatestFrom(state$),
    switchMap(([{ payload }, { user }]) =>
      signOutUser(user.authentication_token).pipe(
        map(UserAction.createGuestUser)
      )
    )
  )

export const authThirdPartyEpic: Epic<AnyAction, AnyAction, State> = (
  action$,
  state$
) =>
  action$.pipe(
    ofType(AuthActionType.AuthThirdParty),
    withLatestFrom(state$),
    switchMap(([{ payload }, state]) =>
      authThirdParty(payload.response, state.user.authentication_token).pipe(
        map((res) => AuthAction.authThirdPartySuccess(res)),
        catchError((error) =>
          of(
            AuthAction.signUpUserFailure(error),
            ToastAction.showToast({
              message: error,
              type: ToastType.error,
            })
          )
        )
      )
    )
  )

export const forgetPasswordEpic: Epic<AnyAction, AnyAction, State> = (
  action$,
  state$
) =>
  action$.pipe(
    ofType(AuthActionType.ForgetPassword),
    withLatestFrom(state$),
    switchMap(([{ payload }]) =>
      forgetPassword(payload.email).pipe(
        map((res) => AuthAction.forgetPsswordSuccess()),
        catchError((err) => of(AuthAction.forgetPasswordFailure()))
      )
    )
  )

export const authEpic = combineEpics(
  signUpUserEpic,
  signInUserEpic,
  signOutUserEpic,
  forgetPasswordEpic,
  authThirdPartyEpic
)
