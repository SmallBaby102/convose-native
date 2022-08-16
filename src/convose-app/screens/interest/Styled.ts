import { SafeAreaView, View } from "react-native"
import styled from "styled-components"

import { CenteredText, font, Props } from "convose-styles"

export const AddInterestHeader = styled(SafeAreaView)`
  width: 100%;
  /* padding: 15px; */
  padding-bottom: 15px;
  text-align: center;
  justify-content: center;
  align-items: center;
  background: ${(props: Props) =>
    props.theme.interests.autocompleteList.background};
`
export const StyledText = styled(CenteredText)`
  font-size: 16px;
  color: ${(props: Props) => props.theme.main.text};
  font-family: ${font.medium};
`
export const InterestComponentWrapper = styled(View)`
  background-color: ${(props: Props) => props.theme.statusBar};
  height: 100%;
  width: 100%;
`
