/* eslint-disable react-perf/jsx-no-new-object-as-prop */
/* eslint-disable react-perf/jsx-no-new-array-as-prop */
import React, { PureComponent } from "react"
import { Animated } from "react-native"
import { InterestLocation, UserInterest } from "convose-lib/interests"
import { Routes } from "convose-lib/router"
import { interestsBarHeight } from "convose-styles"
import { StyledText } from "./Style"
import { InterestButton } from "../InterestButton"
import * as RootNavigation from "../../RootNavigation"

type InterestPopupProps = {
  readonly interest: UserInterest
  readonly opacity?: Animated.AnimatedInterpolation
}

const POPUP_TEXT = "Added"
const POPUP_STYLE = {
  backgroundColor: "rgba(61, 61, 61, 1)",
  borderRadius: 10,
  bottom: interestsBarHeight,
  elevation: 5,
  height: 88,
  position: "absolute",
  left: "2%",
  width: 123,
  zIndex: 120,
}

export class InterestPopup extends PureComponent<InterestPopupProps> {
  public readonly openRatingWheel = (): void => {
    const { interest } = this.props
    RootNavigation.navigate(Routes.Rating, { interest })
  }

  public render(): React.ReactNode {
    const { opacity, interest } = this.props
    return (
      <Animated.View style={[POPUP_STYLE, { opacity }]}>
        <InterestButton
          interestLocation={InterestLocation.Popup}
          interest={{
            ...interest,
            level: interest.level,
          }}
          disabled
          onPress={this.openRatingWheel}
        />
        <StyledText>{POPUP_TEXT}</StyledText>
      </Animated.View>
    )
  }
}
