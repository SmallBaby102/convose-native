import Svg, { G, Text } from "react-native-svg"
import * as React from "react"

import {
  generateWheelSlices,
  NUMBER_OF_SLICES,
  RatingLevel,
  WheelColors,
} from "convose-lib/interests"
import { ThemeContext } from "styled-components"
import { KnowledgeLevelSelector } from "../KnowledgeLevelSelector"

type Props = {
  readonly changeLevel: (level: RatingLevel) => void
  readonly colors?: WheelColors
  readonly level: RatingLevel
  readonly margin?: number
  readonly width: number
  readonly withText?: boolean
}

const HALF_WIDTH = 50
const FONT_SIZE = 5
const DEFAULT_MARGIN = 5

export const KnowledgeLevelDisplay: React.FunctionComponent<Props> = ({
  changeLevel,
  colors,
  level,
  margin,
  width,
  withText = true,
}) => {
  const slices = generateWheelSlices(NUMBER_OF_SLICES, level)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const theme: any = React.useContext(ThemeContext)
  const mappedSlices = slices.map((slice, index) => (
    <KnowledgeLevelSelector
      changeLevel={changeLevel}
      colors={colors}
      index={index}
      // eslint-disable-next-line react/no-array-index-key
      key={index}
      radius={HALF_WIDTH - (margin || DEFAULT_MARGIN)}
      slice={slice}
    />
  ))

  const levelText = (
    <Text
      x={HALF_WIDTH}
      y={HALF_WIDTH + 2}
      fill={theme.main.text}
      fontSize={FONT_SIZE}
      textAnchor="middle"
    >
      {RatingLevel[level]}
    </Text>
  )

  return (
    <Svg height={width} width={width} viewBox="0 0 100 100">
      <G x={HALF_WIDTH} y={HALF_WIDTH}>
        {mappedSlices}
      </G>
      {withText && levelText}
    </Svg>
  )
}
