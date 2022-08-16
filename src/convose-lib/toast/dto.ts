export enum ToastType {
  error = "error",
  success = "success",
}

export type ToastProps = {
  readonly message: string
  readonly type: ToastType
}
