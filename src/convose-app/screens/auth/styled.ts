import { ScrollView, StyleSheet } from "react-native"
import styled from "styled-components"

import { CenteredText, color, height, Props } from "convose-styles"
import { IconButton } from "../../components/IconButton"

export const styles = StyleSheet.create({
  scrollContainer: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: height,
  },
})

export const StyledScrollView = styled(ScrollView)`
  background-color: ${(props: Props) => props.theme.main.background};
  padding: 20px;
`

export const Title = styled(CenteredText)`
  font-family: Popins-extra-bold;
  font-size: 30px;
  align-items: center;
  text-align: center;
  color: ${(props: Props) => props.theme.main.text};
`

export const SocialsLabel = styled(CenteredText)`
  font-family: Popins;
  font-size: 14px;
  align-items: center;
  color: ${color.darkGray};
  margin-bottom: 20px;
  align-self: center;
`

export const BackButton = styled(IconButton)`
  position: absolute;
  top: ${(props: Props) => (props.top ? props.top : "11px")};
  left: ${(props: Props) => (props.left ? props.left : "5px")};
`
