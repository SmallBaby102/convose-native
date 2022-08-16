import { TouchableOpacity, View } from "react-native"
import styled from "styled-components"
import { CenteredText, Props } from "convose-styles"

const CONTAINER_PADDING = "15px"

export const Footer = styled(View)`
  width: 100%;
  background: ${(props: Props) => props.theme.main.background};
  justify-content: flex-start;
  align-items: center;
  padding-horizontal: ${CONTAINER_PADDING};
  margin-top: 30;
  margin-bottom: 50;
`

export const FooterItemWrapper = styled(TouchableOpacity)`
  width: 100%;
  z-index: 10;
  margin-bottom: 40px;
`

export const FooterItem = styled(View)`
  margin-left: 10px;
  flex-direction: row;
  align-items: center;
`

export const FooterText = styled(CenteredText)`
  position: absolute;
  color: ${(props: Props) =>
    props.color ? props.color : props.theme.main.text};
  font-family: Popins;
  font-size: 15px;
  left: 50px;
`
