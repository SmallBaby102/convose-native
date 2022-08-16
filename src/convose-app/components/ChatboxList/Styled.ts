import { View, StyleSheet } from "react-native"
import styled from "styled-components"

import { CenteredText, Props } from "convose-styles"

type ChatboxListProps = {
  bottomInset?: number
}
export const ChatboxListWrapper = styled(View)`
  background: ${(props: Props) => props.theme.main.background};
  flex: 1;
  width: 100%;
  height: 100%;
  padding-bottom: ${(props: ChatboxListProps) => props.bottomInset || 0}px;
`

export const EmptyListAlert = styled(CenteredText)`
  font-family: Popins-extra-bold;
  font-size: 16px;
  text-align: center;
  text-transform: uppercase;
  color: ${(props: Props) => props.theme.mainBlue};
  margin-top: 20px;
`

export const styles = StyleSheet.create({
  // Flex to fill, position absolute,
  // Fixed left/top, and the width set to the window width
  overlay: {
    position: "relative",
    bottom: "50",
    zIndex: 1,
  },
})
