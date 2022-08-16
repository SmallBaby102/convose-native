/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable eqeqeq */
import * as React from "react"
import { ViewStyle } from "react-native"
import { noop } from "rxjs"

import { InterestLocation, UserInterest } from "convose-lib/interests"
import { DEFAULT_HIT_SLOP } from "convose-lib/utils"
import {
  color as Color,
  DEFAULT_INTEREST_SIZE,
  // softShadows,
} from "convose-styles"
import { withTheme } from "styled-components"
import {
  ButtonWrapperView,
  IconButton,
  Label,
  PopupButton,
  PopupButtonWrapper,
  StyledIcon,
  LoadingSpinner,
  IconButtonOnPopup,
  // WheelIconButton,
  LevelRatingContainer,
  LevelRating,
  LabelLevelContainer,
  DeleteButtonContainer,
} from "./Styled"
import { KnowledgeLevelDisplay } from "../../components/KnowledgeLevelDisplay"

type InterestButtonProps = {
  readonly interest: UserInterest
  readonly onDelete?: (interest: UserInterest) => void
  readonly onPress?: () => void
  readonly disabled?: boolean
  readonly interestLocation: InterestLocation
  readonly size?: number
  readonly deleteSuccess?: (interest: UserInterest) => void
  readonly color?: string
  readonly theme: any
  readonly addBorder?: boolean
  readonly transparentBackground?: boolean
  readonly wrapperStyle?: ViewStyle
}

type LocalState = {
  deleting: boolean
}

class InterestButtonComponent extends React.Component<
  InterestButtonProps,
  LocalState
> {
  constructor(props: InterestButtonProps) {
    super(props)
    this.state = {
      deleting: false,
    }
  }

  componentWillUnmount() {
    const { deleteSuccess, interest } = this.props
    const { deleting } = this.state
    if (deleting && deleteSuccess != undefined) {
      deleteSuccess(interest)
    }
  }

  private getIconSize = (): number => {
    const { size } = this.props
    return size ? size * 2.5 : DEFAULT_INTEREST_SIZE * 2.5
  }

  private readonly renderPopupButton = (): React.ReactNode => {
    const { interest, onPress, disabled, theme } = this.props
    const iconWidth = this.getIconSize()
    const interestWheelColors =
      theme.mode === "dark"
        ? { ...theme.interests.ratingWheel, stroke: Color.darkLevel3 }
        : theme.interests.ratingWheel
    return (
      <PopupButtonWrapper hitSlop={DEFAULT_HIT_SLOP} onPress={onPress}>
        {interest.level != null && interest.level !== 0 ? (
          <IconButtonOnPopup
            hitSlop={DEFAULT_HIT_SLOP}
            disabled={disabled}
            onPress={onPress}
          >
            <KnowledgeLevelDisplay
              colors={interestWheelColors}
              changeLevel={noop}
              level={interest.level}
              margin={0}
              width={iconWidth}
              withText={false}
            />
          </IconButtonOnPopup>
        ) : null}
        <PopupButton ellipsizeMode="tail" numberOfLines={1}>
          {interest.name}
        </PopupButton>
      </PopupButtonWrapper>
    )
  }

  private checkHasRating = (): boolean => {
    const { interest } = this.props
    return !(interest.level === null || interest.level === 0)
  }

  private readonly renderRating = () => {
    const { interest, interestLocation } = this.props
    const notHasRating = !this.checkHasRating()
    if (notHasRating) {
      return null
    }
    return (
      <LevelRatingContainer>
        {Array(interest.level)
          .fill(1)
          .map((_, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <LevelRating key={index} location={interestLocation} />
          ))}
      </LevelRatingContainer>
    )
  }

  private readonly renderDeleteIcon = () => {
    const { disabled, size } = this.props
    return (
      !disabled && (
        <DeleteButtonContainer>
          <IconButton
            onPress={this.handleOnDelete}
            hitSlop={DEFAULT_HIT_SLOP}
            size={size}
          >
            <StyledIcon name="close" size={this.getIconSize()} />
          </IconButton>
        </DeleteButtonContainer>
      )
    )
  }

  private readonly handleOnDelete = () => {
    const { interest, onDelete } = this.props
    this.setState({ deleting: true })
    if (onDelete) {
      onDelete(interest)
    }
  }

  private readonly handleOnPress = () => {
    const { onPress } = this.props
    requestAnimationFrame(() => {
      onPress && onPress()
    })
  }

  public render(): React.ReactNode {
    const {
      disabled,
      interest,
      interestLocation,
      onPress,
      size,
      color,
      theme,
      addBorder,
      transparentBackground,
      wrapperStyle,
    } = this.props
    const { deleting } = this.state
    const interestName =
      interestLocation === InterestLocation.Popup
        ? interest.name
        : interest.name.split("[")[0]

    // const shadows =
    //   interestLocation === InterestLocation.MyInterests &&
    //   theme.mode === "light"
    //     ? softShadows
    //     : null

    if (interestLocation === InterestLocation.Popup) {
      return this.renderPopupButton()
    }
    const hasRating = this.checkHasRating()
    return (
      <ButtonWrapperView
        onPress={this.handleOnPress}
        hitSlop={DEFAULT_HIT_SLOP}
        size={size}
        disabled={disabled}
        color={color}
        addBorder={addBorder}
        transparentBackground={transparentBackground}
        style={wrapperStyle}
      >
        <LabelLevelContainer size={size} location={interestLocation}>
          <Label
            location={interestLocation}
            ellipsizeMode="tail"
            hitSlop={DEFAULT_HIT_SLOP}
            numberOfLines={1}
            onPress={onPress}
            size={size}
            hasDelete={!disabled}
            hasRating={hasRating}
          >
            {interestName}
          </Label>
          {this.renderRating()}
        </LabelLevelContainer>
        {deleting ? (
          <LoadingSpinner color={theme.mainBlue} size={22} />
        ) : (
          this.renderDeleteIcon()
        )}
      </ButtonWrapperView>
    )
  }
}

type Props = Omit<InterestButtonProps, "theme">
export const InterestButton: React.FunctionComponent<Props> = withTheme(
  InterestButtonComponent
)
