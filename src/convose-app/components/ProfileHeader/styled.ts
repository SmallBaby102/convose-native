import { TouchableOpacity, View, Text } from "react-native"
import styled from "styled-components"
import { MaterialIndicator } from "react-native-indicators"

import { appHeaderHeight, Props } from "convose-styles"

const CONTAINER_PADDING = "15px"

export const MaxCharAlertText = styled(Text)`
  color: ${(props: Props) => props.theme.profile.alert};
  font-family: Popins-bold;
  font-weight: 600;
  font-size: 10;
  line-height: 16;
  margin-left: 10;
`
export const NameInputAndAlertContainer = styled(View)`
  align-items: flex-start;
`
export const Header = styled(View)`
  height: ${appHeaderHeight}px;
  width: 100%;
  background: ${(props: Props) => props.theme.main.background};
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding-horizontal: ${CONTAINER_PADDING};
`

export const AvatarWrapper = styled(TouchableOpacity)`
  z-index: 10;
  margin-right: 15px;
`
export const LoadingSpinner = styled(MaterialIndicator)`
  margin-right: 15px;
  margin-left: 15px;
`
