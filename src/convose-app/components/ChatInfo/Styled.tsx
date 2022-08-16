import { View } from "react-native"
import styled from "styled-components"

import { CenteredText, color, Props } from "convose-styles"

export const Info = styled(CenteredText)`
  align-self: center
  background: ${(props: Props & { withBgColor: boolean }) =>
    // eslint-disable-next-line no-nested-ternary
    props.theme.mode === "dark"
      ? color.transparent
      : props.withBgColor
      ? props.theme.textInput.background
      : color.white}
  color: ${(props: Props) => props.theme.chatInfo}}
  font-size: 10px
  margin: 5px
  padding: ${(props: { withBgColor: boolean }) =>
    props.withBgColor ? "5px 10px" : "0px 10px"}
  font-family: Popins-light
  border-radius: 10
  overflow:hidden
`

export const InfoBorder = styled(View)`
  border: 1px solid ${(props: Props) => props.theme.chatInfo}
  opacity: 0.3
  position: absolute
  top: 20px
  width: 100%
`
