import * as React from "react"
// import { NavigationInjectedProps } from 'react-navigation'
import { connect } from "react-redux"
import { Dispatch } from "redux"
import {
  InterestsAction,
  InterestType,
  RatingLevel,
  UserInterest,
} from "convose-lib/interests"
import { Routes } from "convose-lib/router"
import { State } from "convose-lib/store"
import { selectUserLocalInterests, UserAction } from "convose-lib/user"
import { isTablet } from "convose-lib/utils"
import { defaultShadows } from "convose-styles"
import { StackScreenProps } from "@react-navigation/stack"
import { RatingContainer } from "./Styled"
import { KnowledgeLevelWidget, ModalWrapper } from "../../components"
import { MainStackParamList } from "./convose-app/router"

type NavProps = StackScreenProps<MainStackParamList, Routes.Rating>
type StateToProps = {
  readonly interests: ReadonlyArray<UserInterest>
  readonly localInterests: ReadonlyArray<UserInterest>
}

type DispatchToProps = {
  readonly updateInterests: (interests: ReadonlyArray<UserInterest>) => void
  readonly addNewInterestWithLevel: (interest: UserInterest) => void
}

type RatingWheelComponentProps = StateToProps & DispatchToProps & NavProps

const WHEEL_MARGIN = 15
class LinearRatingScreenComponent extends React.Component<RatingWheelComponentProps> {
  private readonly saveLevel = (level: RatingLevel | null) => {
    const {
      interests,
      updateInterests,
      addNewInterestWithLevel,
      route,
      navigation,
      localInterests,
    } = this.props
    const { interest, isFromInterestScreen } = route.params
    const interestWithLevel = { ...interest, level }
    const interestToFilter = isFromInterestScreen ? localInterests : interests
    updateInterests([
      interestWithLevel,
      ...interestToFilter.filter(
        (userInterest) => userInterest.name !== interest.name
      ),
    ])

    addNewInterestWithLevel(interestWithLevel)

    navigation.goBack()
  }

  private readonly goBack = () => {
    const { navigation, route } = this.props
    const { interest, isFromInterestScreen, isEdit } = route.params
    if (
      isFromInterestScreen &&
      interest.type === InterestType.Language &&
      !isEdit
    ) {
      return
    }
    navigation.goBack()
  }

  public render(): React.ReactNode {
    const { route } = this.props
    const { interest } = route.params

    return (
      <ModalWrapper onPress={this.goBack}>
        <RatingContainer style={defaultShadows} isTablet={isTablet()}>
          <KnowledgeLevelWidget
            onChange={this.saveLevel}
            interest={interest}
            wheelMargin={!isTablet() ? WHEEL_MARGIN : undefined}
            useLinear
          />
        </RatingContainer>
      </ModalWrapper>
    )
  }
}

const mapStateToProps = (state: State): StateToProps => ({
  interests: state.user.interests || [],
  localInterests: selectUserLocalInterests(state) || [],
})

const mapDispatchToProps = (dispatch: Dispatch): DispatchToProps => ({
  updateInterests: (interests: ReadonlyArray<UserInterest>) => {
    dispatch(UserAction.updateUser({ interests }))
  },
  addNewInterestWithLevel: (interest: UserInterest) => {
    dispatch(InterestsAction.addNewInterestWithLevel(interest))
  },
})

export const LinearRatingScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(LinearRatingScreenComponent)
