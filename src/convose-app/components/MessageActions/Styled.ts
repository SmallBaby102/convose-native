import { View, TouchableOpacity, Text } from "react-native"
import styled from "styled-components"
import { interestsBarHeight, Props } from "convose-styles"
import { Ionicons } from "@expo/vector-icons"

type ComponentWrapperType = {
  isVisible: boolean
}
const componentWrapperHeight = interestsBarHeight + 45
export const ComponentWrapper = styled(View)`
  background: rgba(0, 0, 0, 0);
  background-color: ${(props: Props) => props.theme.messageActions.wrapper};
  width: 100%;
  height: ${componentWrapperHeight};
  flex-direction: row;
  elevation: 4;
  z-index: 4;
  position: absolute;
  bottom: ${(props: ComponentWrapperType) =>
    props.isVisible ? 0 : -componentWrapperHeight}px;
`
export const MessageActionsWrapper = styled(View)`
  background-color: ${(props: Props) => props.theme.messageActions.background};
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  padding-horizontal: 55;
`
export const ActionButton = styled(TouchableOpacity)`
  flex: 0.2;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* background-color: red; */
`
type IconProps = Props & { size: number }
export const ActionIcon = styled(Ionicons)`
  color: ${(props: Props) => props.theme.mainBlue};
  width: ${(props: IconProps) => props.size};
  height: ${(props: IconProps) => props.size};
`
export const ActionTitle = styled(Text)`
  color: ${(props: Props) => props.theme.main.text};
  padding-top: 5px;
  font-family: Popins-bold;
  font-weight: 500;
  font-size: 13px;
  text-align: center;
  include-font-padding: false;
  text-align-vertical: center;
`
