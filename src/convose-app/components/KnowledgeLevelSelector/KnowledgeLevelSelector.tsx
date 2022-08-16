/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Svg from "react-native-svg"
import * as React from "react"

import {
  generateSlicePath,
  RatingLevel,
  Slice,
  WheelColors,
} from "convose-lib/interests"
import { color } from "convose-styles"
import { withTheme } from "styled-components"

type Props = {
  readonly changeLevel: (level: RatingLevel) => void
  readonly colors?: WheelColors
  readonly index: number
  readonly radius: number
  readonly slice: Slice
  readonly theme: any
}

const { Path } = Svg

class KnowledgeLevelSelectorComponent extends React.Component<Props> {
  private readonly getFillColor = (): string => {
    const { theme } = this.props
    const {
      colors = {
        active: color.darkGreen,
        inactive: theme.mode === "dark" ? color.darkLevel4 : color.lightBlue,
      },
      slice,
    } = this.props

    return slice.active ? colors.active : colors.inactive
  }

  private readonly getStrokeColor = (): string => {
    const { colors, theme } = this.props

    return colors ? colors.stroke : theme.interests.ratingWheel.stroke
  }

  private readonly changeLevelOnPress = (): void => {
    const { changeLevel, index } = this.props

    changeLevel(RatingLevel[RatingLevel[index + 1] as keyof typeof RatingLevel])
  }

  public render(): React.ReactNode {
    const { radius, slice } = this.props

    return (
      <Path
        d={generateSlicePath(slice, radius) || ""}
        fill={this.getFillColor()}
        onPressIn={this.changeLevelOnPress}
        stroke={this.getStrokeColor()}
        strokeWidth="3"
      />
    )
  }
}

export const KnowledgeLevelSelector = withTheme(KnowledgeLevelSelectorComponent)
