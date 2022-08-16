import { CenteredText, color, ongoingCallHeight, Props } from "convose-styles"
import { TouchableOpacity, View } from "react-native"
import styled from "styled-components"

interface TimerText {
  timerText: boolean
}

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
    height: 21
    justify-content: center
    font-size: 15px
    text-align: center
    color: ${(props: Props) => props.color || color.white}
    ${(props: Props) => props.italic && "font-style: italic;"}
    ${(props: TimerText) => props.timerText && "width: 40; left:10"}
`
