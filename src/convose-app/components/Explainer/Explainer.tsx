import React, { FunctionComponent } from "react"
import { ViewStyle } from "react-native"
import { hardShadow } from "convose-styles"
import { Svg, Path } from "react-native-svg"
import { withTheme } from "styled-components"

import { getRatio, getWidth } from "../../../assets/svg/utils"
import {
  ExplainerIcon,
  ExplainerIconsWrapper,
  ExplainerBox,
  ExplainerTitle,
  ExplainerTextWrapper,
  ExplainerButton,
  ExplainerButtonLabel,
  ExplainerArrow,
  ExplainerWrapper,
  CloseButton,
  CloseIcon,
  CloseButtonContainer,
  ExplainerDescription,
} from "./Styled"

const EXPLAINER_ICON_SIZE = 50

type ArrowProps = {
  color: string
}
const ARROW_SVG_WIDTH = 66
const ARROW_SVG_HEIGHT = 42
const ratio = getRatio(ARROW_SVG_HEIGHT, ARROW_SVG_WIDTH)
const arrowNewHeight = 25
const arrowNewWidth = getWidth(ratio, arrowNewHeight)
const Arrow: FunctionComponent<ArrowProps> = ({ color }) => {
  return (
    <ExplainerArrow>
      <Svg height={arrowNewHeight} width={arrowNewWidth} viewBox="0 0 66 42">
        <Path
          d="M35.7567 39.7125C34.161 41.5634 31.2933 41.5634 29.6976 39.7125L1.4248 6.91848C-0.810181 4.32609 1.03154 0.306614 4.45435 0.306614L60.9999 0.306614C64.4228 0.306614 66.2645 4.32609 64.0295 6.91848L35.7567 39.7125Z"
          fill={color}
        />
      </Svg>
    </ExplainerArrow>
  )
}

type ExplainerProps = {
  onButtonPress?: () => void
  buttonTitle?: string
  isShowing: boolean
  ioniconsNames?: string[]
  title?: string
  explanation?: string
  bottomPosition?: number
  iconSize?: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly theme: any
  onClosePress?: () => void
  iconComponent: React.ReactElement
  wrapperStyle?: ViewStyle
}

const ExplainerComponent: FunctionComponent<ExplainerProps> = ({
  onButtonPress,
  buttonTitle,
  isShowing,
  ioniconsNames,
  title,
  explanation,
  bottomPosition,
  iconSize = EXPLAINER_ICON_SIZE,
  theme,
  onClosePress,
  iconComponent,
  wrapperStyle,
}) => {
  if (!isShowing) {
    return null
  }
  const renderCloseButton = (): React.ReactElement | null => {
    if (!onClosePress) {
      return null
    }
    return (
      <CloseButtonContainer>
        <CloseButton onPress={onClosePress}>
          <CloseIcon name="md-close" size={30} />
        </CloseButton>
      </CloseButtonContainer>
    )
  }
  const renderIcons = (): React.ReactElement | null => {
    if (!ioniconsNames?.length) {
      return null
    }
    return (
      <ExplainerIconsWrapper>
        {ioniconsNames?.map((iconName) => (
          <ExplainerIcon key={iconName} name={iconName} size={iconSize} />
        ))}
      </ExplainerIconsWrapper>
    )
  }
  const renderIconComponent = (): React.ReactElement | null => {
    if (!iconComponent) {
      return null
    }
    return iconComponent
  }
  const renderTitle = (): React.ReactElement | null => {
    if (!title) {
      return null
    }
    return (
      <ExplainerTextWrapper>
        <ExplainerTitle>{title}</ExplainerTitle>
      </ExplainerTextWrapper>
    )
  }
  const renderExplanation = (): React.ReactElement | null => {
    if (!explanation) {
      return null
    }
    return (
      <ExplainerTextWrapper>
        <ExplainerDescription>{explanation}</ExplainerDescription>
      </ExplainerTextWrapper>
    )
  }
  const renderButton = (): React.ReactElement | null => {
    if (!buttonTitle || !onButtonPress) {
      return null
    }
    return (
      <ExplainerButton onPress={onButtonPress}>
        <ExplainerButtonLabel>{buttonTitle}</ExplainerButtonLabel>
      </ExplainerButton>
    )
  }
  return (
    <ExplainerWrapper style={wrapperStyle} bottom={bottomPosition}>
      <ExplainerBox
        style={hardShadow}
        addPaddingTop={!(iconComponent || ioniconsNames)}
      >
        <Arrow color={theme.mainBlue} />
        {renderCloseButton()}
        {renderIconComponent()}
        {renderIcons()}
        {renderTitle()}
        {renderExplanation()}
        {renderButton()}
      </ExplainerBox>
    </ExplainerWrapper>
  )
}

type Props = Omit<ExplainerProps, "theme">
export const Explainer: FunctionComponent<Props> = withTheme(ExplainerComponent)
