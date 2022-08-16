import * as React from "react"

import { RatingLevel, WheelColors } from "convose-lib/interests"
import { isNumber } from "lodash"
import { KnowledgeContainer } from "./Style"
import { KnowledgeLevel } from "./KnowledgeLevel"

type Props = {
  readonly changeLevel: (level: RatingLevel) => void
  readonly colors?: WheelColors
  readonly level: RatingLevel
  readonly margin?: number
  readonly width: number
}

const levels: { title: string; level: number }[] = Object.values(RatingLevel)
  .filter((val) => isNumber(val) && val > 0)
  .map((level) => ({
    title: `${RatingLevel[Number(level)]}`,
    level: Number(level),
  }))

export const LinearKnowledgeLevelDisplay: React.FunctionComponent<Props> = ({
  changeLevel,
  // colors,
  level,
  // margin,
  // width,
}) => {
  return (
    <KnowledgeContainer>
      {levels.map(({ title, level: titleLevel }) => (
        <KnowledgeLevel
          key={title}
          title={title}
          active={level >= titleLevel}
          changeLevel={changeLevel}
          level={titleLevel}
          selectedLevel={level}
        />
      ))}
    </KnowledgeContainer>
  )
}
