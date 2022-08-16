import { TouchableOpacity } from "react-native"
import styled from "styled-components"

import { CenteredText, color, Props } from "convose-styles"

export const ButtonWrapper = styled(TouchableOpacity)`
  border-radius: 50px;
  text-align: center;
  padding-vertical: 15px;
  padding-right: 35px;
  padding-left: 30px;
  background: ${(props: Props) => props.theme.mainBlue};
  overflow: visible;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`

export const Label = styled(CenteredText)`
  font-family: Popins-medium;
  font-size: 15px;
  text-align: center;
  color: ${color.white};
  margin-left: 8;
  include-font-padding: false;
  text-align-vertical: center;
`
