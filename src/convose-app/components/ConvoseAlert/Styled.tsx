import { Text, View, TouchableOpacity } from "react-native"
import styled from "styled-components"
import { Ionicons } from "@expo/vector-icons"

import { Props } from "convose-styles"

export const Wrapper = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  position: absolute;
  background: rgba(0, 0, 0, 0.75);
  width: 100%;
  height: 100%;
  padding-horizontal: 10%;
  z-index: 1000;
  elevation: 1000;
`
export const Modal = styled(View)`
  background-color: ${(props: Props) => props.theme.main.background};
  border-radius: 14px;
  padding: 42px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`
const StyledText = styled(Text)`
  font-family: Popins-bold;
  text-align: center;
  include-font-padding: false;
  text-align-vertical: center;
  color: ${(props: Props) => props.theme.main.text};
`
export const Title = styled(StyledText)`
  font-weight: 600;
  font-size: 24;
  padding-bottom: 29px;
`
export const Description = styled(StyledText)`
  font-family: Popins;
  font-weight: 400;
  font-size: 14;
  padding-bottom: 29px;
`
export const Icon = styled(Ionicons)`
  color: ${(props: Props) => props.theme.main.text};
  margin-bottom: 29px;
`
type ButtonProps = Props & { isCancel: boolean; isLast: boolean }
export const ButtonLabel = styled(StyledText)`
  font-size: 18px;
  color: ${(props: ButtonProps) =>
    props.isCancel ? props.theme.mainBlue : "white"};
  align-self: center;
`
export const Button = styled(TouchableOpacity)`
  background-color: ${(props: ButtonProps) =>
    props.isCancel ? "transparent" : props.theme.mainBlue};
  height: 57px;
  border-radius: 40px;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: row;
  margin-bottom: ${(props: ButtonProps) => (props.isLast ? "0" : "29")}px;
`
export const ButtonsContainer = styled(View)`
  width: 100%;
`
