import React, { useRef } from "react"
import { connect } from "react-redux"
import { Dispatch } from "redux"

import { InterestLocation, UserInterest } from "convose-lib/interests"
import { Routes } from "convose-lib/router"
import { State } from "convose-lib/store"
import { selectUserInterests, UserAction } from "convose-lib/user"
import { MY_INTEREST_SIZE, softShadows } from "convose-styles"
import { LayoutAnimation, Platform, UIManager } from "react-native"
import { InterestButton } from "../../components"
import * as RootNavigation from "../../RootNavigation"
import {
  AddInterestButton,
  InterestContainer,
  InterestsLabel,
  InterestsList,
  InterestsWrapper,
  NoInterestText,
} from "./styled"
import { NoInterests } from "./NoInterests"

const addInterestText = `Add hobbies, skills, languages and locations here to find interesting people to talk with.`
const mutationLayout = {
  duration: 100,
  type: LayoutAnimation.Types.easeInEaseOut,
  property: LayoutAnimation.Properties.scaleXY,
}
const layoutAnimConfig = {
  duration: 300,
  update: {
    type: LayoutAnimation.Types.easeInEaseOut,
  },
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
  readonly onlyList?: boolean
}
type StateToProps = {
  readonly interests: ReadonlyArray<UserInterest>
}

type DispatchToProps = {
  readonly updateInterests: (interests: ReadonlyArray<UserInterest>) => void
}

type MyInterestListProps = StateToProps & DispatchToProps & Props

const MyInterestListComponent: React.SFC<MyInterestListProps> = ({
  interests,
  updateInterests,
  onlyList,
}) => {
  const deleteRefs = useRef<string[]>([])
  const onDelete = (interest: UserInterest): void => {
    deleteRefs.current = [interest.name, ...deleteRefs.current]
    updateInterests(
      interests.filter(
        (userInterest) => !deleteRefs.current.includes(userInterest.name)
      )
    )
  }

  const deleteSuccess = (interest: UserInterest): void => {
    deleteRefs.current = deleteRefs.current.filter(
      (interestName) => interestName !== interest.name
    )
    LayoutAnimation.configureNext(layoutAnimConfig)
  }

  const openRatingWheel = (interest: UserInterest) => () => {
    RootNavigation.navigate(Routes.Rating, { interest })
  }

  const renderAddInterestsButton = (): React.ReactNode => (
    <AddInterestButton length={interests.length} style={softShadows} />
  )

  const renderInterests = () =>
    interests &&
    interests.map((interest) => (
      <InterestButton
        size={MY_INTEREST_SIZE}
        interestLocation={InterestLocation.MyInterests}
        interest={interest}
        key={interest.name}
        onDelete={onDelete}
        onPress={openRatingWheel(interest)}
        deleteSuccess={deleteSuccess}
        addBorder
        transparentBackground
      />
    ))

  const renderInterestList = (): React.ReactNode => {
    if (onlyList && !interests.length) {
      return null
    }
    if (onlyList && interests.length) {
      return <InterestsList>{renderInterests()}</InterestsList>
    }
    return (
      <InterestContainer>
        {interests.length ? (
          <InterestsList>{renderInterests()}</InterestsList>
        ) : (
          <>
            <NoInterests />
            <NoInterestText>{addInterestText}</NoInterestText>
          </>
        )}
        {renderAddInterestsButton()}
      </InterestContainer>
    )
  }

  return (
    <InterestsWrapper>
      {!onlyList && <InterestsLabel>My interests:</InterestsLabel>}
      {renderInterestList()}
    </InterestsWrapper>
  )
}

const mapStateToProps = (state: State): StateToProps => ({
  interests: selectUserInterests(state),
})

const mapDispatchToProps = (dispatch: Dispatch): DispatchToProps => ({
  updateInterests: (interests: ReadonlyArray<UserInterest>) => {
    dispatch(UserAction.updateUser({ interests }))
  },
})
// MyInterestListComponent.whyDidYouRender = {
//   logOnDifferentValues: false,
//   customName: "MyInterestListComponent",
//   diffNameColor: "red",
// }
export const MyInterestList = React.memo(
  connect(mapStateToProps, mapDispatchToProps)(MyInterestListComponent)
)
