import {
  SafeAreaView,
  TouchableOpacity,
  View,
  TouchableHighlight,
} from "react-native"
import styled from "styled-components"

import { CenteredText, color, Props } from "convose-styles"

export const AppHeader = styled(SafeAreaView)`
  align-items: center;
  flex-direction: column;
  flex-wrap: nowrap;
  width: 100%;
  background-color: ${(props: Props) =>
    props.color ? props.color : props.theme.header};
  overflow: visible;
  ${(props: { sticky: boolean }) =>
    props.sticky ? "position: absolute; z-index: 10; top: 0" : ""};
`

export const ReturnToCallWrapper = styled(View)`
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

export const AppHeaderContentWrapper = styled(View)`
  padding: ${(props: { paddingTop: boolean }) =>
      props.paddingTop ? props.paddingTop : 0}px
    14px 0 14px;
  flex-direction: row;
  align-items: center;
  flex-wrap: nowrap;
  height: 50px;
`

export const AppHeaderContent = styled(View)`
  flex-direction: row;
  justify-content: ${(props: { withAvatar: boolean }) =>
    props.withAvatar ? "flex-start" : "center"};
  padding: 5px 0;
  align-items: center;
  flex: 1;
  margin: 5px 5px;
  overflow: hidden;
`
export const AvatarContainer = styled.View`
  width: 35px;
  height: 35px;
  align-items: flex-start;
  justify-content: center;
`
export const TextWrapper = styled(TouchableOpacity)`
  flex-direction: column;
  align-items: center;
  height: 22;
  justify-content: center;
  flex: 1;
  margin-left: ${(props: { withAvatar: boolean }) =>
    props.withAvatar ? 0 : -40};
  align-items: ${(props: { withAvatar: boolean }) =>
    props.withAvatar ? "flex-start" : "center"};
`

export const HeaderText = styled(CenteredText)`
  font-family: Popins-bold;
  font-size: 20px;
  text-align: center;
  color: ${(props: Props) =>
    props.color && props.color !== "SystemDefualt"
      ? props.color
      : props.theme.main.text};
  margin-top: -2px;
`

export const Subtext = styled(CenteredText)`
  font-family: Popins-light;
  color: ${(props: Props) => (props.color ? props.color : color.dark)};
  font-size: 10px;
  position: absolute;
  bottom: -12;
`
export const CallText = styled(CenteredText)`
  font-family: Popins-bold;
  color: ${color.white};
  font-size: 16px;
  left: 2;
`

export const ButtonWrapper = styled(TouchableHighlight)`
  background: ${(props: Props) =>
    props.color ? props.color : color.transparent};
  align-items: center;
  justify-content: center;
  border-radius: 50;
  flex-direction: row;
  width: ${(props: Props) => (props.width ? props.width : 40)};
  height: ${(props: Props) => (props.height ? props.height : 40)};
`
