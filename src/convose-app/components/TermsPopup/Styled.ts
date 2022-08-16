import { TouchableHighlight, View } from "react-native"
import styled from "styled-components"

import { CenteredText, color, font, Props } from "convose-styles"
import { SvgButton } from "../../components/IconButton"
import { PrimaryButton } from "../../components/PrimaryButton"

const spacing = 20

export const AlertCard = styled(TouchableHighlight)`
  border-radius: 30px;
  background: ${(props: Props) => props.theme.main.chatBox};
  width: 90%;
`

export const Container = styled(View)`
  align-items: center;
  justify-content: center;
  padding: 50px 40px;
`

export const Title = styled(CenteredText)`
  font-family: ${font.extraBold};
  font-size: 22px;
  color: ${(props: Props) => props.theme.terms.title};
  text-align: center;
  margin-bottom: ${spacing - 10}px;
  width: 90%;
`

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
  color: ${color.blue};
`

export const ConfirmButton = styled(PrimaryButton)`
  width: 100%;
  max-width: 250;
`

export const ImageContainer = styled(View)`
  width: 100%auto;
  margin-bottom: ${spacing};
  justify-content: center;
  align-items: center;
  flex-direction: row;
`

export const Icon = styled(SvgButton)`
  margin-horizontal: 15px;
`
