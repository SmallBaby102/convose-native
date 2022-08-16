import { Props } from "convose-styles"
import { View } from "react-native"
import styled from "styled-components"

export const InboxTabletView = styled(View)`
  align-self: flex-end
  height: 100%
  width: 50%
`
export const WhiteBackgroundWrapper = styled(View)`
  background-color: ${(props: Props) => props.theme.statusBar}
  height: 100%
  width: 100%
`
