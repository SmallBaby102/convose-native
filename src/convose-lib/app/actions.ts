/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ActionsUnion, createAction } from "../utils/action"

export enum AppType {
  InitializeApp = "[App] Initialize app ",
  HideSplash = "[App] Hide splash screen",
  ChangeTheme = "[App] Change color theme",
  UnexpectedError = "[App] Unexpected error",
  SetFayeIsReady = "[Chat] Set Faye is ready",
}

export const AppAction = {
  changeTheme: (darkMode: boolean) =>
    createAction(AppType.ChangeTheme, darkMode),
  hideSplash: () => createAction(AppType.HideSplash),
  initializeApp: () => createAction(AppType.InitializeApp),
  unexpectedError: (error: Error) =>
    createAction(AppType.UnexpectedError, error),
  setFayeIsReady: () => createAction(AppType.SetFayeIsReady),
}

export type AppAction = ActionsUnion<typeof AppAction>
