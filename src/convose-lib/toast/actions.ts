import { ActionsUnion, createAction } from "../utils/action"
import { ToastProps } from "./dto"

export enum ToastActionType {
  HideToast = "[Toast] Hide toast",
  ShowToast = "[Toast] Show toast",
  showPersistantToast = "[Toast] Show Persistent Toast",
}

export const ToastAction = {
  hideToast: () => createAction(ToastActionType.HideToast),
  showToast: (payload: ToastProps) =>
    createAction(ToastActionType.ShowToast, payload),
  showPersistantToast: (payload: ToastProps) =>
    createAction(ToastActionType.showPersistantToast, payload),
}

export type ToastAction = ActionsUnion<typeof ToastAction>
