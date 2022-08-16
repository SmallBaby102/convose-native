/* eslint-disable @typescript-eslint/explicit-module-boundary-types, import/no-extraneous-dependencies */
import { AjaxError } from "rxjs/ajax"
import { ActionsUnion, createAction } from "convose-lib/utils"
import { AuthToken, LoginType, User, PushNotificationToken } from "./dto"

export enum UserActionType {
  CreateGuestUser = "[User] Create guest user",
  CreateGuestUserFailure = "[User] Create guest user - failure",
  CreateGuestUserSuccess = "[User] Create guest user - success",
  FetchProfile = "[User] Fetch user profile",
  GetUser = "[User] Get user",
  GetUserFailure = "[User] Get user - failure",
  GetUserServerFailure = "[User] Get user - server failure",
  GetUserSuccess = "[User] Get user - success",
  SetTokenFailure = "[User] Set token - failure",
  SetTokenSuccess = "[User] Set token - success",
  UpdateUser = "[User] Update user",
  UpdateUserFailure = "[User] Update user - failure",
  UpdateUserSuccess = "[User] Update user - success",
  ChangeUsername = "[User] Change username",
  UpdateAvatar = "[User] Update avatar",
  UpdateAvatarSuccess = "[User] Update avatar - success",
  UpdateAvatarFailure = "[User] Update avatar - failure",
  SetUserActive = "[User] Set user active",
  SetUserInactive = "[User] Set user inactive",
  SetUserActivitySuccess = "[User] Set user activity - success",
  SetUserActivityFailure = "[User] Set user activity - failure",
  RegisterPushNotifications = "[User] Register push notifications",
  RegisterPushNotificationsSuccess = "[User] Register push notifications - success",
  RegisterPushNotificationsFailure = "[User] Register push notifications - failure",
  CleanUserStateAfterSignOut = "[User] Clean user state after sign out",
  InitLocalInterests = "[User] init local interests",
  OpenSocialLogin = "[User] open social login",
  CloseSocialLogin = "[User] close social login",
  ClearPushNotification = "[User] Clear push notification",
  RequestingPushNotifications = "[User] Requesting for push notification",
  RequestingPushNotificationsFailure = "[User] Requesting for push notification - failure",
}

export const UserAction = {
  changeUsername: (username: string) =>
    createAction(UserActionType.ChangeUsername, username),
  createGuestUser: () => createAction(UserActionType.CreateGuestUser),
  createGuestUserFailure: (error: AjaxError) =>
    createAction(UserActionType.CreateGuestUserFailure, error),
  createGuestUserSuccess: (user: User) =>
    createAction(UserActionType.CreateGuestUserSuccess, user),
  fetchProfile: () => createAction(UserActionType.FetchProfile),
  getUser: (token: AuthToken) => createAction(UserActionType.GetUser, token),
  getUserFailure: (error: AjaxError) =>
    createAction(UserActionType.GetUserFailure, error),
  getUserServerFailure: (error: AjaxError) =>
    createAction(UserActionType.GetUserServerFailure, error),
  getUserSuccess: (user: User) =>
    createAction(UserActionType.GetUserSuccess, user),
  registerPushNotificationsFailure: (error: AjaxError) =>
    createAction(UserActionType.RegisterPushNotificationsFailure, error),
  registerPushNotificationsSuccess: (token: PushNotificationToken) =>
    createAction(UserActionType.RegisterPushNotificationsSuccess, token),
  registerPushNotifications: (token: PushNotificationToken) =>
    createAction(UserActionType.RegisterPushNotifications, token),
  setTokenFailure: (error: AjaxError) =>
    createAction(UserActionType.SetTokenFailure, error),
  setTokenSuccess: () => createAction(UserActionType.SetTokenSuccess),
  setUserActive: () => createAction(UserActionType.SetUserActive),
  setUserActivityFailure: (error: AjaxError) =>
    createAction(UserActionType.SetUserActivityFailure, error),
  setUserActivitySuccess: () =>
    createAction(UserActionType.SetUserActivitySuccess),
  setUserInactive: () => createAction(UserActionType.SetUserInactive),
  updateAvatar: (file: FormData) =>
    createAction(UserActionType.UpdateAvatar, file),
  updateAvatarFailure: (error: AjaxError) =>
    createAction(UserActionType.UpdateAvatarFailure, error),
  updateAvatarSuccess: (user: User) =>
    createAction(UserActionType.UpdateAvatarSuccess, user),
  updateUser: (payload: Partial<User>) =>
    createAction(UserActionType.UpdateUser, payload),
  updateUserFailure: (error: AjaxError) =>
    createAction(UserActionType.UpdateUserFailure, error),
  updateUserSuccess: (user: User) =>
    createAction(UserActionType.UpdateUserSuccess, user),
  cleanUserStateAfterSignOut: () =>
    createAction(UserActionType.CleanUserStateAfterSignOut),
  initLocalInterests: () => createAction(UserActionType.InitLocalInterests),
  openSocialLogin: (loginType: LoginType) =>
    createAction(UserActionType.OpenSocialLogin, { loginType }),
  closeSocialLogin: () => createAction(UserActionType.CloseSocialLogin),
  clearPushNotification: () =>
    createAction(UserActionType.ClearPushNotification),
  requestingPushNotifications: () =>
    createAction(UserActionType.RequestingPushNotifications),
  requestingPushNotificationsFailure: () =>
    createAction(UserActionType.RequestingPushNotificationsFailure),
}

export type UserAction = ActionsUnion<typeof UserAction>
