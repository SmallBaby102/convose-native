import { Props, statusBarHeight } from "convose-styles"
import { View } from "react-native"
import styled from "styled-components"

export const ChatMenuScreenWrapper = styled(View)`
  flex: 1;
  margin-top: -${statusBarHeight + 10};
  padding-top: ${statusBarHeight * 2};
  background: ${(props: Props) => props.theme.main.background};
`

export const ChatMenuHeaderWrapper = styled(View)`
  margin: 10px 0px 0px 25px;
`

export const ChatScreenWrapper = styled(View)`
  flex: 1;
  flex-direction: column;
  justify-content: flex-end;
`

export const FullscreenImageWrapper = styled(View)`
  position: absolute;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
  background: ${(props: Props) => props.theme.main.background};
  elevation: 8;
`
