/* eslint-disable import/no-extraneous-dependencies, complexity */
import { AnyAction } from "redux"

import { AuthActionType } from "./actions"
import { setAuthError } from "./utils"

export type AuthState = {
  readonly authErrorMessage: string
  readonly loading: boolean
}

const AuthInitial: AuthState = {
  authErrorMessage: "",
  loading: false,
}

export const authReducer = (
  state: AuthState = AuthInitial,
  action: AnyAction
): AuthState => {
  switch (action.type) {
    case AuthActionType.AuthThirdParty:
    case AuthActionType.AuthThirdPartyRequest:
    case AuthActionType.SignInUser:
    case AuthActionType.SignUpUser:
      return { ...state, loading: true }
    case AuthActionType.AuthThirdPartyRequestCancel:
      return { ...state, loading: false }
    case AuthActionType.SetAuthErrors:
      return { ...state, authErrorMessage: action.payload }

    case AuthActionType.SignInUserSuccess:
    case AuthActionType.SignUpUserSuccess:
      return { ...state, authErrorMessage: "", loading: false }
    case AuthActionType.AuthThirdPartySuccess:
      return { ...state, authErrorMessage: "", loading: false }
    case AuthActionType.SignUpUserFailure:
    case AuthActionType.SignInUserFailure:
      return {
        ...state,
        authErrorMessage: setAuthError(action.payload),
        loading: false,
      }

    default:
      return state
  }
}
