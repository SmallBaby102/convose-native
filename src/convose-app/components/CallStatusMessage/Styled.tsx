/* eslint-disable no-nested-ternary */
import { View } from "react-native"
import styled from "styled-components"

import { CenteredText, color, Props } from "convose-styles"
import { MaterialCommunityIcons } from "@expo/vector-icons"

export const TextWrapper = styled(View)`
    align-self: center
    background: ${(props: Props & { withBgColor: boolean }) =>
      props.theme.mode === "dark"
        ? color.transparent
        : props.withBgColor
        ? props.theme.textInput.background
        : color.white}
    justify-content: center
    align-items: center
    flex-direction: row
    left: 5
    margin-vertical:2
    padding: 5px 10px
    border-radius: 10
`
export const Label = styled(CenteredText)`
    font-family: Popins-medium
    font-style: italic
    font-size: 10px
    text-align: center
    color: ${(props: Props) => props.theme.callStatusMsg}
`
export const CallStatusIcon = styled(MaterialCommunityIcons)`
    margin-right: 4
    align-self: center
    color: ${(props: Props) => props.theme.callStatusMsg}
`
