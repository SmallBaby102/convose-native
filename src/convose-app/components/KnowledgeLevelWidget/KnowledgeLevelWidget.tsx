import * as React from "react"
import { Dimensions } from "react-native"

import { InterestType, RatingLevel, UserInterest } from "convose-lib/interests"
import { isTablet } from "convose-lib/utils"
import { KnowledgeLevelDisplay } from "../KnowledgeLevelDisplay"
import {
  RatingLevelWrapper,
  StyledButton,
  TopTextViewWrapper,
  TopTextWrapper,
} from "./Styled"
import { LinearKnowledgeLevelDisplay } from "../LinearKnowledgeLevelDisplay"

type RatingWheelProps = {
  readonly interest: UserInterest
  readonly onChange: (level: RatingLevel | null) => void
  readonly wheelMargin?: number
  readonly useLinear?: boolean
}

type RatingWheelState = {
  readonly level: RatingLevel
}

const widgetWidth = isTablet()
  ? Dimensions.get("window").width / 2
  : Dimensions.get("window").width * 0.9

export class KnowledgeLevelWidget extends React.Component<
  RatingWheelProps,
  RatingWheelState
> {
  public readonly state: RatingWheelState = {
    // eslint-disable-next-line react/destructuring-assignment
    level: this.props.interest.level || RatingLevel.Beginner,
  }

  private readonly changeLevel = (level: RatingLevel) => {
    this.setState({ level })
  }

  private readonly handleOnChange = () => {
    const { onChange } = this.props
    const { level } = this.state
    onChange(level)
  }

  private readonly removeInterest = () => {
    const { onChange } = this.props
    onChange(null)
  }

  public renderKnowledgeLevel = (): React.ReactNode => {
    const { wheelMargin, useLinear } = this.props
    const { level } = this.state

    if (useLinear) {
      return (
        <LinearKnowledgeLevelDisplay
          level={level}
          changeLevel={this.changeLevel}
          margin={wheelMargin}
          width={widgetWidth}
        />
      )
    }
    return (
      <KnowledgeLevelDisplay
        level={level}
        changeLevel={this.changeLevel}
        margin={wheelMargin}
        width={widgetWidth}
      />
    )
  }

  public render(): React.ReactNode {
    const { interest } = this.props

    return (
      <RatingLevelWrapper>
        <TopTextViewWrapper>
          <TopTextWrapper size={22}>{interest.name}</TopTextWrapper>
          <TopTextWrapper numberOfLines={1} ellipsizeMode="tail">
            My knowledge level:
          </TopTextWrapper>
        </TopTextViewWrapper>
        {this.renderKnowledgeLevel()}
        <StyledButton onPress={this.handleOnChange} label="Done" />
        {interest.type === InterestType.General && (
          <StyledButton
            onPress={this.removeInterest}
            label="Remove rating"
            type="text"
            isTextMainBlue
          />
        )}
      </RatingLevelWrapper>
    )
  }
}
