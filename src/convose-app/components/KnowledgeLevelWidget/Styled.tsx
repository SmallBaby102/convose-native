import { View } from "react-native"
import styled from "styled-components"

import { CenteredText, Props } from "convose-styles"
import { PrimaryButton } from "../PrimaryButton"

export const RatingLevelWrapper = styled(View)`
  align-self: center;
  align-items: center;
  background-color: ${(props: Props) => props.theme.main.background};
  border-radius: 10px;
  height: auto;
  width: 100%;
`

export const TopTextViewWrapper = styled(View)`
  margin-top: 14px;
  padding: 0 10px;
`

export const TopTextWrapper = styled(CenteredText)`
  color: ${(props: Props) => props.theme.main.text};
  font-size: ${(props: Props) => (props.size ? props.size : 16)};
  font-family: Popins-bold;
  margin-top: 10;
  text-align: center;
`
export const StyledButton = styled(PrimaryButton)`
  align-self: center;
  margin-bottom: 30;
  width: 200;
`
