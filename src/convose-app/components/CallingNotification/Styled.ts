import { Animated, TouchableOpacity, View } from "react-native"
import styled from "styled-components"

import { CenteredText, color, ongoingCallHeight, Props } from "convose-styles"

export const ReceivingCallUIContainer = styled(Animated.View)`
  background: ${(props: Props) => props.theme.notification}
  flex-direction: row
  align-items: center
  justify-content: center
  position: absolute
  width: 95%
  z-index: 999
  align-self: center
  border-radius: 90
  padding: 10px
`

export const ButtonWrapper = styled(TouchableOpacity)`
    width: 100%
    height: ${ongoingCallHeight}
    background: ${(props: Props) => props.color || color.darkGreen}
    justify-content: center
    align-items: center
    flex-direction: row
`

export const TextWrapper = styled(View)`
    overflow: visible
    justify-content: center
    align-items: center
    flex-direction: row
`

export const Label = styled(CenteredText)`
    font-family: Popins-medium
    font-size: 15px
    text-align: center
    color: ${(props: Props) => props.color || color.white}
    include-font-padding: false
`
