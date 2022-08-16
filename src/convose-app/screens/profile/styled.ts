import { View, ScrollView, StatusBar } from "react-native"
import styled from "styled-components"

import { CenteredText, Props, statusBarHeight } from "convose-styles"
import { PrimaryButton } from "../../components/PrimaryButton"

export const ProfileScreenWrapper = styled(ScrollView)`
  flex: 1;
  /* margin-top: -${statusBarHeight + 10}
  padding-top: ${statusBarHeight} */
  background: ${(props: Props) => props.theme.main.background};
  ${!!StatusBar.currentHeight && `padding-top:${StatusBar.currentHeight}px`};
`

type ContainerProps = {
  insetTop?: number
  insetBottom?: number
}
export const ProfileContainer = styled.View`
  margin-top: ${(props: ContainerProps) => props.insetTop || 0}px;
  margin-bottom: ${(props: ContainerProps) => props.insetBottom || 0}px;
`

export const AuthButton = styled(PrimaryButton)`
  margin-bottom: 15px;
`

export const AuthButtonsWrapper = styled(View)`
  padding: 0 20px;
  margin-top: 20px;
`

export const SectionLabel = styled(CenteredText)`
  font-family: Popins-light;
  font-size: 15px;
  color: ${(props: Props) => props.theme.main.text};
  margin-bottom: 10px;
`
