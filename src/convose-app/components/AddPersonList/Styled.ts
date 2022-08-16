import { Props } from "convose-styles"
import { View } from "react-native"
import styled from "styled-components"

export const InboxWrapper = styled(View)`
  flex: 1
  background: ${(props: Props) => props.theme.main.background}
`

export const ConversationsWrapper = styled(View)`
  flex: 1;
`
