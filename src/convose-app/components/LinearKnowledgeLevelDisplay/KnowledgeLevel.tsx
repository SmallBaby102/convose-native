import React from "react"
import {
  LayoutAnimation,
  Platform,
  TouchableWithoutFeedback,
  UIManager,
} from "react-native"

import { RatingLevel } from "convose-lib"
import {
  KnowledgeLevelBubble,
  KnowledgeLevelContainer,
  KnowledgeLevelTitle,
  KnowledgeLevelTitleContainer,
} from "./Style"

const mutationLayout = {
  duration: 75,
  type: LayoutAnimation.Types.easeInEaseOut,
  property: LayoutAnimation.Properties.scaleXY,
}
const layoutAnimConfig = {
  duration: 75,
  update: mutationLayout,
  delete: mutationLayout,
  create: mutationLayout,
}

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

type Props = {
  active: boolean
  title: string
  readonly changeLevel: (level: RatingLevel) => void
  level: RatingLevel
  selectedLevel: RatingLevel
}
export const KnowledgeLevel: React.FunctionComponent<Props> = ({
  active,
  title,
  changeLevel,
  level,
  selectedLevel,
}) => {
  const onChangeLevelPress = () => {
    changeLevel(level)
    LayoutAnimation.configureNext(layoutAnimConfig)
  }
  return (
    <TouchableWithoutFeedback onPress={onChangeLevelPress}>
      <KnowledgeLevelContainer>
        <KnowledgeLevelBubble active={active} />
        <KnowledgeLevelTitleContainer
          active={active}
          // eslint-disable-next-line react-perf/jsx-no-new-object-as-prop
          style={{
            transform: [
              { translateX: -150 / 2 },
              { rotateZ: "45deg" },
              { translateX: 150 / 2 },
            ],
          }}
        >
          <KnowledgeLevelTitle active={level === selectedLevel}>
            {title}
          </KnowledgeLevelTitle>
        </KnowledgeLevelTitleContainer>
      </KnowledgeLevelContainer>
    </TouchableWithoutFeedback>
  )
}
