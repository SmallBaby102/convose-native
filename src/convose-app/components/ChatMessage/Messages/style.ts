import { CenteredText, color } from "convose-styles"
import { Platform, TouchableOpacity } from "react-native"
import styled from "styled-components"

// Audio
export const AudioMessageTimer = styled(CenteredText)`
  font-family: Popins
  color: ${(props: { myMessage: boolean }) =>
    props.myMessage ? color.white : color.darkGray}
  font-size: 7px
  ${Platform.OS === "ios" ? "marginLeft: 10px" : ""}
`

export const AudioMessageWrapper = styled(TouchableOpacity)`
  flex-direction: row
  align-items: center
  justify-content: space-between
  padding: 0 15px
  width: 80%
  height: 40
`

export const AudioIconsWrapper = styled(TouchableOpacity)`
  ${Platform.OS === "ios" ? "marginRight: 10px" : ""}
`
