import { View, Text, TouchableOpacity } from "react-native"
import styled from "styled-components"
import { Ionicons } from "@expo/vector-icons"
import { Props } from "convose-styles"

export const ExplainerIcon = styled(Ionicons)`
  color: ${(props: Props) => props.theme.explainerText};
`
export const ExplainerIconsWrapper = styled(View)`
  flex-direction: row;
  justify-content: space-around;
  padding-bottom: 20px;
  padding-top: 10px;
`
type ExplainerBoxType = Props & { addPaddingTop?: boolean }
export const ExplainerBox = styled(View)`
  background-color: ${(props: Props) => props.theme.mainBlue};
  border-radius: 23px;
  padding: 15px;
  padding-top: ${(props: ExplainerBoxType) =>
    props.addPaddingTop ? "45px" : "30px"};
  margin-bottom: 20px;
`
export const ExplainerTitle = styled(Text)`
  font-size: 25px;
  font-family: Popins-bold;
  color: ${(props: Props) => props.theme.explainerText};
  text-align: center;
`
export const ExplainerDescription = styled(ExplainerTitle)`
  font-family: Popins-bold;
  font-size: 13px;
  line-height: 20px;
`
export const ExplainerTextWrapper = styled(View)`
  padding-horizontal: 10px;
`
export const ExplainerButton = styled(TouchableOpacity)`
  background-color: ${(props: Props) => props.theme.explainerText};
  height: 57px;
  border-radius: 40px;
  justify-content: center;
  margin-bottom: 20px;
  margin-left: 10px;
  margin-right: 10px;
  align-items: center;
  text-align: center;
  flex-direction: row;
`
export const ExplainerButtonLabel = styled(ExplainerTitle)`
  color: ${(props: Props) => props.theme.mainBlue};
  font-size: 23px;
  include-font-padding: false;
  text-align-vertical: center;
`
export const ExplainerArrow = styled(View)`
  position: absolute;
  bottom: -16px;
  align-self: center;
  z-index: 15;
`
type ExplainerWrapperProps = Props & { bottom: number }
export const ExplainerWrapper = styled(View)`
  position: absolute;
  width: 100%;
  bottom: ${(props: ExplainerWrapperProps) => props.bottom || 0};
  padding-left: 15%;
  padding-right: 15%;
  left: 0;
  right: 0;
  top: 0;
  justify-content: flex-end;
  align-items: center;
  z-index: 5;
`
export const CloseButtonContainer = styled(View)`
  justify-content: flex-end;
  flex-direction: row;
  position: absolute;
  right: 5;
  top: 5;
  width: 100%;
  z-index: 10;
`
export const CloseButton = styled(TouchableOpacity)`
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
`
export const CloseIcon = styled(ExplainerIcon)``
