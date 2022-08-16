import { CenteredText, Props } from "convose-styles"
import { TouchableOpacity, View } from "react-native"
import styled from "styled-components"

const messageBorderRadius = 10

export const MenuWrapper = styled(View)`
  flex-direction: column
  border-radius: ${messageBorderRadius}
  background: ${(props: Props) => props.theme.main.background}
  padding: 10px 20px 0px 25px
  z-index: 20
`

export const MenuItemButton = styled(TouchableOpacity)`
  flex-direction: row
  align-items: center
  margin: ${(props: { withMargin: boolean }) =>
    props.withMargin ? "15px 0" : "0"}
`

export const IconWrapper = styled(View)`
  height: 100%
  width: 50
  align-items: center

`

export const MenuItemLabel = styled(CenteredText)`
font-family: Popins
font-style: normal
font-weight: normal
font-size: 15px
line-height: 20px
color: ${(props: Props) => props.theme.main.text}
margin-left: 10px
text-align: left
`
