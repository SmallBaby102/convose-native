import { View } from "react-native"
import styled from "styled-components"

import { ToastProps } from "convose-lib/toast"
import { CenteredText, color, statusBarHeight } from "convose-styles"

export const ToastWrapper = styled(View)`
  top: ${statusBarHeight + 15}
  position: absolute
  justify-content: center
  align-items: center
  width: 100%
`

export const StyledToast = styled(View)`
  background-color: ${(props: ToastProps) => color.toast[props.type]}
  justify-content: center
  align-items: center
  min-height: 50px
  width: 90%
  padding: 5px
  border-radius: 50
`

export const Message = styled(CenteredText)`
  color: white
  font-size: 18px
  font-family: Popins
  text-align: center
`
