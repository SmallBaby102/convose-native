import React from "react"
import { MaterialIndicator } from "react-native-indicators"
import { color } from "convose-styles"
import { Container } from "./Styled"

type ConvoseLoadingProps = {
  isShowing: boolean
}
const ConvoseLoadingComponent: React.FunctionComponent<ConvoseLoadingProps> = ({
  isShowing,
}) => {
  if (!isShowing) {
    return null
  }
  return (
    <Container>
      <MaterialIndicator color={color.mainBlue} />
    </Container>
  )
}
// ConvoseLoadingComponent.whyDidYouRender = {
//   logOnDifferentValues: false,
//   customName: "ConvoseLoadingComponent",
//   diffNameColor: "red",
// }

export const ConvoseLoading = React.memo(ConvoseLoadingComponent)
