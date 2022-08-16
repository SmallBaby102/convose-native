import { View } from "react-native"
import styled from "styled-components"

export const RatingWheelTabletView = styled(View)`
  align-items: center
  align-self: center
  height: auto
  justify-content: center
  max-width: 50%
`

export const RatingWheelMobileView = styled(RatingWheelTabletView)`
  max-width: 75%;
`
