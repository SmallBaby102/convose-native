import React from "react"
import { FontAwesome } from "@expo/vector-icons"

import { AutoSuggestInterest } from "convose-lib/interests"
import { roundNumberTo } from "convose-lib/utils"
import {
  InterestTextWrapper,
  StyledOptionText,
  StyledOptionView,
  StyledExistingIndicatorText,
  AddedMarkerWrapper,
  StyledFontAwesomeAddedMarker,
  InterestWrapper,
} from "./Styled"

interface IOptionProps {
  readonly interest: AutoSuggestInterest
  readonly onSelect: (interest: AutoSuggestInterest) => void
  readonly existing?: boolean
  readonly onRemove: (interest: AutoSuggestInterest) => void
}
type AutosuggestOptionState = {
  readonly removed: boolean
}
export default class AutosuggestOption extends React.PureComponent<
  IOptionProps,
  AutosuggestOptionState
> {
  public timeout!: ReturnType<typeof setTimeout>

  public state: AutosuggestOptionState = {
    removed: false,
  }

  componentDidUpdate(
    prevProps: IOptionProps,
    prevState: AutosuggestOptionState
  ): void {
    const { removed } = this.state
    if (prevState.removed !== removed) {
      this.removeRemovedMarked()
    }
  }

  componentWillUnmount(): void {
    clearTimeout(this.timeout)
  }

  private readonly selectInterest = (): void => {
    const { onSelect, interest, onRemove } = this.props
    if (interest.existing) {
      onRemove(interest)
      this.setState({ removed: true })
      return
    }
    onSelect(interest)
  }

  public removeRemovedMarked = (): void => {
    const { removed } = this.state
    if (removed) {
      this.timeout = setTimeout(() => {
        this.setState({
          removed: false,
        })
      }, 1000)
    }
  }

  public renderExistingMarker = (
    exists: boolean | undefined,
    removed: boolean
  ): React.ReactElement | null => {
    if (exists) {
      return (
        <AddedMarkerWrapper>
          <StyledFontAwesomeAddedMarker name="check" size={13} />
          <StyledExistingIndicatorText>Added</StyledExistingIndicatorText>
        </AddedMarkerWrapper>
      )
    }
    if (removed) {
      return (
        <AddedMarkerWrapper>
          <StyledFontAwesomeAddedMarker name="close" size={13} removed />
          <StyledExistingIndicatorText removed>
            Removed
          </StyledExistingIndicatorText>
        </AddedMarkerWrapper>
      )
    }
    return null
  }

  public render(): React.ReactNode {
    const { removed } = this.state
    const { interest } = this.props
    const interestMatchCountDividedTo1000 = interest.match / 1000
    const interestMatchCount =
      interestMatchCountDividedTo1000 > 1
        ? `${roundNumberTo(interestMatchCountDividedTo1000)}k`
        : interest.match
    return (
      <StyledOptionView onPress={this.selectInterest}>
        <InterestWrapper hasAdded={interest.existing} removed={removed}>
          <InterestTextWrapper>
            <StyledOptionText ellipsizeMode="tail" numberOfLines={1}>
              {interest.name}
            </StyledOptionText>
          </InterestTextWrapper>
          <StyledOptionText>
            {` ( ${interestMatchCount} `}
            <FontAwesome name="user" />
            {` )`}
          </StyledOptionText>
          {this.renderExistingMarker(interest.existing, removed)}
        </InterestWrapper>
      </StyledOptionView>
    )
  }
}
