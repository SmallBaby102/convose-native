import { Ionicons } from "@expo/vector-icons"
import { TouchableOpacity, View } from "react-native"
import styled from "styled-components"

import { CenteredText, color, interestsBarHeight, Props } from "convose-styles"

export const PopupWrapper = styled(View)`
width: 198px
background-color: ${(props: Props) => props.theme.mainBlue}
position: absolute
border-radius: 5px
padding: 10px
bottom: ${interestsBarHeight - 5}px
left: ${(props: Props) => (props.left ? props.left : 0)}px
z-index: 130
`

export const StyledText = styled(CenteredText)`
color: ${color.white}
font-family: Popins-light
font-size:13px
bottom:-2.5px
left:34px
z-index: 125
`

export const StyledIcon = styled(Ionicons)`
  color: ${color.black};
`

export const CloseButton = styled(TouchableOpacity)`
  position: absolute;
  color: rgba(0, 0, 0, 0.6);
  right: 12px;
  top: -3px;
`

export const StyledShape = styled(View)`
  position: relative;
  bottom: 0;
  left: 10px;
  width: 0;
  height: 0;
  border: 15px solid transparent;
  border-top-color: ${(props: Props) => props.theme.mainBlue};
  border-bottom-width: 0;
  margin-left: -15px;
  margin-bottom: -15px;
`
