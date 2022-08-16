import { View } from "react-native"
import styled from "styled-components"

import { CenteredText, color } from "convose-styles"

type StyledBadgeWrapperProps = {
  readonly inboxIndicator: boolean
}

export const StyledBadgeWrapper = styled(View)`
  background: ${(props: StyledBadgeWrapperProps) =>
    props.inboxIndicator ? color.red : color.darkGray}
  border-radius: 8px
  height: 15px
  justify-content: center
  position: absolute
  right: -5
  top: -5
  width: 15px
`
export const StyledBadge = styled(CenteredText)`
  color: ${color.white}
  font-size: 9px
  text-align: center
  justify-content: center
  font-family: Popins
`
