import { MaterialCommunityIcons } from "@expo/vector-icons"
import styled from "styled-components"
import { Platform, TextInput, TouchableOpacity, View } from "react-native"

const MARGIN_BETWEEN_ELEMENTS = 10
const ICONS_SIZE = 30
const INPUT_BORDER_RADIUS = 30

export const IconWrapper = styled(TouchableOpacity)`
  justify-content: flex-end
  align-items: center
  margin: 2px ${MARGIN_BETWEEN_ELEMENTS}px
  width: 30px
`

export const EmoticonPickerWrapper = styled(IconWrapper)`
  margin: 3px 3px 3px 0;
`

export const EmoticonPickerIcon = styled(MaterialCommunityIcons)`
  color: ${(props) => props.theme.mainBlue}
  font-size: ${ICONS_SIZE}
`

export const InputWrapper = styled(View)`
  background: ${(props) => props.theme.textInput.background}
  flex-direction: row
  border-radius: 30
  align-items: center
`
