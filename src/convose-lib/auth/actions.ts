/* eslint-disable @typescript-eslint/explicit-module-boundary-types,import/no-extraneous-dependencies */
import { User, ThirdPartyUser } from "convose-lib/user"
import { AjaxError } from "rxjs/ajax"

import { ActionsUnion, createAction } from "../utils/action"

export enum AuthActionType {
  SignUpUser = "[User] Sign up user",
  SignUpUserSuccess = "[User] Sign up user - success",
  SignUpUserFailure = "[User] Sign up user - failure",
  SignInUser = "[User] Sign in user",
  SignInUserSuccess = "[User] Sign in user - success",
  SignInUserFailure = "[User] Sign in user - failure",
  SignOutUser = "[User] Sign out user",
  SetAuthErrors = "[User] Set auth errors",
  SignUpFacebook = "[User] Sign up facebook",
  SignUpFacebookSuccess = "[User] Sign up facebook - success",
  ForgetPassword = "[User] Forget password",
  ForgetPasswordSuccess = "[User] Forget password - success",
  ForgetPasswordFailure = "[User] Forget password - failure",
  AuthThirdParty = "[User] Sign up with third party",
  AuthThirdPartySuccess = "[User] Sign up with third party - success",
  AuthThirdPartyRequest = "[User] Auth with third party - request",
  AuthThirdPartyRequestCancel = "[User] Auth with third party - request cancel",
}

export const AuthAction = {
  signUpUser: (email: string, password: string) =>
    createAction(AuthActionType.SignUpUser, { email, password }),
  signUpUserFailure: (error: AjaxError) =>
    createAction(AuthActionType.SignUpUserFailure, error),
  signUpUserSuccess: (user: User) =>
    createAction(AuthActionType.SignUpUserSuccess, user),
  signInUser: (email: string, password: string) =>
    createAction(AuthActionType.SignInUser, { email, password }),
  signInUserFailure: (error: AjaxError) =>
    createAction(AuthActionType.SignInUserFailure, error),
  signInUserSuccess: (user: User) =>
    createAction(AuthActionType.SignInUserSuccess, user),
  signOutUser: () => createAction(AuthActionType.SignOutUser),
  setAuthErrors: (errors: string) =>
    createAction(AuthActionType.SetAuthErrors, errors),
  authThirdParty: (response: any) =>
    createAction(AuthActionType.AuthThirdParty, { response }),
  authThirdPartyRequest: () =>
    createAction(AuthActionType.AuthThirdPartyRequest),
  authThirdPartyRequestCancel: () =>
    createAction(AuthActionType.AuthThirdPartyRequestCancel),
  authThirdPartySuccess: (user: ThirdPartyUser) =>
    createAction(AuthActionType.AuthThirdPartySuccess, {
      authentication_token: user.token,
    }),
  forgetPassword: (email: string) =>
    createAction(AuthActionType.ForgetPassword, { email }),
  forgetPsswordSuccess: () =>
    createAction(AuthActionType.ForgetPasswordSuccess),
  forgetPasswordFailure: () =>
    createAction(AuthActionType.ForgetPasswordFailure),
}

export type AuthAction = ActionsUnion<typeof AuthAction>
