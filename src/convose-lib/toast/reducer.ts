import { AnyAction } from "redux"

import { UserActionType } from "convose-lib/user"
import { ToastActionType } from "./actions"
import { ToastProps, ToastType } from "./dto"

export type ToastState = ToastProps | null

export const ToastInitial: ToastState = null

export const toastReducer = (
  state: ToastState = ToastInitial,
  action: AnyAction
): ToastState => {
  switch (action.type) {
    case ToastActionType.HideToast:
      return null

    case ToastActionType.ShowToast:
      return action.payload

    case ToastActionType.showPersistantToast:
      return action.payload

    default:
      return state
  }
}
