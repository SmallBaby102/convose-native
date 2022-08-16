import { CenteredText, font, Props, statusBarHeight } from "convose-styles"
import { View } from "react-native"
import styled from "styled-components"
import { Svg, Path } from "react-native-svg"

export const ChatboxListScreenWrapper = styled(View)`
  flex: 1;
  width: 100%;
`
type StatusBarBackgroundType = Props & { bgColor?: string }
export const StatusBarBackground = styled(View)`
  width: 100%;
  height: ${statusBarHeight};
  background: ${(props: StatusBarBackgroundType) =>
    props.bgColor ? props.bgColor : props.theme.statusBar};
`
export const Modal = styled(View)`
  height: 100%;
  z-index: 2;
  position: absolute;
  width: 100%;
`
export const TermsModal = styled(Modal)`
  z-index: 5;
`
const spacing = 29

export const TermsText = styled(CenteredText)`
  font-size: 14px;
  color: ${(props: Props) => props.theme.terms.text};
  text-align: center;
  align-self: center;
  font-family: ${font.normal};
  margin-bottom: ${spacing}px;
  width: 90%;
`

export const TermsLink = styled(TermsText)`
  color: ${(props: Props) => props.theme.mainBlue};
`

export const AgreementSvg = styled(Svg)`
  margin-bottom: 29px;
`
export const AgreementPath = styled(Path)``
