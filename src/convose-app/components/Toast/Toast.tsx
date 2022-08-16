import * as React from "react"

import { ToastProps } from "convose-lib/toast"
import { Message, StyledToast, ToastWrapper } from "./Styled"

export const Toast: React.FunctionComponent<ToastProps> = ({
  message,
  type,
}) => {
  return (
    <ToastWrapper>
      <StyledToast type={type}>
        <Message>{message}</Message>
      </StyledToast>
    </ToastWrapper>
  )
}
