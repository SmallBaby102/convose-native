import { Platform, TouchableOpacity, View } from "react-native"
import styled from "styled-components"

import { CenteredText, color, Props } from "convose-styles"

export const ButtonWrapper = styled(TouchableOpacity)`
  border-radius: 50px;
  height: 60px;
  width: 88%;
  max-width: 500px;
  text-align: center;
  align-self: center;
  background: ${(props: Props) =>
    props.color ? props.color : props.theme.mainBlue};
  overflow: visible;
  margin-bottom: 15px;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`

export const Label = styled(CenteredText)`
  ${Platform.OS === "android" && "font-family: Popins-medium"};
  font-weight: 500;
  font-size: ${Platform.OS === "android" ? "17px" : "22px"};
  text-align: center;
  color: ${color.white};
  margin-left: ${Platform.OS === "android" ? 13 : 7};
  include-font-padding: false;
  text-align-vertical: center;
`
export const ButtonListWrapper = styled(View)`
  justify-content: center;
  align-items: center;
  background: ${(props: Props) => props.theme.main.background};
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 102;
  padding: 50px 0;
  border-top-left-radius: 22px;
  border-top-right-radius: 22px;
`
type AnimationContainerType = {
  isVisible: boolean
  maxHeight: number
}

export const AnimationContainer = styled.View`
  bottom: ${(props: AnimationContainerType) =>
    props.isVisible ? 0 : -props.maxHeight}px;
  z-index: 100;
  flex: 1;
  width: 100%;
  height: ${(props: AnimationContainerType) => props.maxHeight}px;
  position: absolute;
`
