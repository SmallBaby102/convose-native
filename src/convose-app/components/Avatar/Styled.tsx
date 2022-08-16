import { View } from "react-native"
import styled from "styled-components"
import FastImage from "react-native-fast-image"
import { Props } from "convose-styles"

export const StyledAvatar = styled(View)`
  background: transparent;
  overflow: hidden;
  height: ${(props: Props) => (props.height ? props.height : 60)}px;
  width: ${(props: Props) => (props.height ? props.height : 60)}px;
  border-radius: ${(props: Props) => (props.height ? props.height / 2 : 30)}px;
`
export const StyledImage = styled(FastImage)`
  height: ${(props: Props) => (props.height ? props.height : 60)}px;
  width: ${(props: Props) => (props.height ? props.height : 60)}px;
  border-radius: ${(props: Props) => (props.height ? props.height / 2 : 30)}px;
`
