import { View } from "react-native"
import styled from "styled-components"

type RatingContainerProps = {
  isTablet: boolean
}
export const RatingContainer = styled(View)`
  align-items: center;
  align-self: center;
  height: auto;
  justify-content: center;
  max-width: ${(props: RatingContainerProps) =>
    props.isTablet ? "50%" : "75%"};
`
