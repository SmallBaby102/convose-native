import * as React from "react"
import { Image, ScrollView, StyleSheet, View } from "react-native"
import styled from "styled-components"

import { CenteredText, color, Props } from "convose-styles"
import Svg from "react-native-svg"
import {
  AutosuggestOptionList,
  IAutosuggestOptionListProps,
} from "../../components/AutosuggestOptionList"

export const styles = StyleSheet.create({
  scrollContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
})
export const AutosuggestOptionListFooterContainer = styled(View)`
  margin-top: 15px;
  margin-bottom: 5px;
`

export const FlatListWrapper = styled(View)`
  background: ${(props: Props) =>
    props.theme.interests.autocompleteList.background};
  flex: 1;
  z-index: 200;
  elevation: 20000;
`

export const EmptyListScrollView = styled(ScrollView)`
  background-color: ${(props: Props) =>
    props.theme.interests.autocompleteList.newInterestBackground};
  flex: 1;
  padding: 10px 15%;
  padding-bottom: 0;
  position: absolute;
  width: 100%;
  padding-bottom: 10px;
`
export const EmptyListContainer = styled(View)`
  flex: 1;
`

export const StyledImage = styled(Image)`
  width: 200px;
  height: 150px;
`

export const Title = styled(CenteredText)`
  font-size: 20px;
  color: ${(props: Props) => props.theme.main.text};
  text-align: center;
  font-family: Popins-bold;
`

export const InfoText = styled(Title)`
  font-size: 15px;
  font-family: Popins-light;
  padding-bottom: 10px;
`

export const FlatListSeparator = styled(View)`
  background: ${color.interests.autocompleteList.background};
  height: 5px;
  width: 100%;
`
export const StyledSvg = styled(Svg)`
  align-self: flex-start;
`
export const StyledOptionList = styled((props: IAutosuggestOptionListProps) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <AutosuggestOptionList {...props} />
))`
  align-items: flex-start;
  height: 100%;
  width: 100%;
`
