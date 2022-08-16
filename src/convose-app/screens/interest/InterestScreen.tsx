/* eslint-disable react/style-prop-object */
import React, { FunctionComponent, useEffect, useState } from "react"
import { Keyboard } from "react-native"
// eslint-disable-next-line import/no-extraneous-dependencies
import { NavigationInjectedProps } from "react-navigation"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import { withSafeAreaInsets } from "react-native-safe-area-context"

import { selectOnboarding, State } from "convose-lib"
import {
  Interest,
  InterestsAction,
  InterestType,
  selectHasMore,
  selectSearchResults,
  selectSearchText,
  UserInterest,
} from "convose-lib/interests"
import { Routes } from "convose-lib/router"
import { selectUserLocalInterests, UserAction } from "convose-lib/user"

import { uniqBy } from "lodash"
import { SafeAreaProps } from "convose-lib/generalTypes"
import { InterestsBar, StyledOptionList } from "../../components"
import { InterestComponentWrapper } from "./Styled"
import { InterestHeader } from "./InterestHeader"

type InterestScreenProps = NavigationInjectedProps & {
  readonly searchResults: ReadonlyArray<Interest> | null
  readonly clearInterestsResults: () => void
  readonly searchInterest: (text: string) => void
  readonly updateInterests: (interests: ReadonlyArray<UserInterest>) => void
  readonly addNewInterest: (interest: UserInterest) => void
  readonly onboardingStatus: boolean
  readonly hasMore: boolean
  readonly searchText: string
  readonly clearNewInterest: () => void
  readonly removeInterest: (interest: UserInterest) => void
  readonly localInterests: ReadonlyArray<UserInterest>
  readonly initLocalInterests: () => void
}
const headerTextStyle = { fontSize: 17 }
const headerStyle = {
  zIndex: 100000,
  elevation: 100000,
}
type AllProps = InterestScreenProps & SafeAreaProps

const InterestScreenComponent: FunctionComponent<AllProps> = ({
  searchResults,
  clearInterestsResults,
  updateInterests,
  navigation,
  searchInterest,
  addNewInterest,
  hasMore,
  searchText,
  clearNewInterest,
  removeInterest,
  localInterests,
  initLocalInterests,
  insets,
}) => {
  const [interestValue, setInterestValue] = useState("")
  useEffect(() => {
    initLocalInterests()
    return () => clearNewInterest()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const onDeleteInterest = (interest: UserInterest): void => {
    const newInterestsAfterRemove = localInterests.filter(
      (userInterest) => userInterest.name !== interest.name
    )
    updateInterests(newInterestsAfterRemove)
    removeInterest(interest)
  }

  const goBack = () => {
    clearInterestsResults()
    navigation.goBack()
  }

  const returnToMostPopularInterests = (): void => {
    if (interestValue) {
      setInterestValue("")
      searchInterest("")
    }
  }
  const interestToUserInterest = ({ ...interest }: Interest): UserInterest => ({
    ...interest,
    level: 0,
  })

  const addInterest = (userInterest: UserInterest) => {
    addNewInterest(userInterest)
    updateInterests([userInterest, ...localInterests])
  }
  const openRatingPage = (interest: UserInterest, isEdit?: boolean): void => {
    Keyboard.dismiss()
    navigation.navigate(Routes.Rating, {
      interest,
      isFromInterestScreen: true,
      isEdit,
    })
  }
  const handleOnInterestAddPress = (interest: Interest): void => {
    returnToMostPopularInterests()
    const userInterest = interestToUserInterest(interest)
    if (interest.type === InterestType.Language) {
      openRatingPage(userInterest, false)
      return
    }
    addInterest(userInterest)
  }
  const onEditRatingPress = (interest: UserInterest) => {
    openRatingPage(interest, true)
  }
  const loadMoreInterest = (): void => {
    if (hasMore) {
      searchInterest(searchText)
    }
  }
  const resultsToList = uniqBy(searchResults, "name")
  const renderNewInterest =
    !(!resultsToList || resultsToList.length) && !!searchText

  const insetBottom = insets?.bottom || 0

  return (
    <InterestComponentWrapper>
      <InterestHeader
        onBackPress={goBack}
        title="Add interests to Your Profile"
        textColor="SystemDefualt"
        headerTextStyle={headerTextStyle}
        headerStyle={headerStyle}
      />
      <StyledOptionList
        results={resultsToList}
        onSelect={handleOnInterestAddPress}
        hasMoreInterests={hasMore}
        onLoadMoreInterest={loadMoreInterest}
        searchText={searchText}
        hasSelectedInterest={!!localInterests.length}
        onRemove={onDeleteInterest}
        renderNewInterest={renderNewInterest}
      />
      <InterestsBar
        onClose={goBack}
        onSearch={searchInterest}
        onAddInterest={handleOnInterestAddPress}
        searchResults={searchResults}
        currentInterests={localInterests}
        onDeleteInterest={onDeleteInterest}
        openRatingWheel={onEditRatingPress}
        interestValue={interestValue}
        setInterestValue={setInterestValue}
        renderNewInterest={renderNewInterest}
        insetBottom={insetBottom}
      />
    </InterestComponentWrapper>
  )
}

const mapStateToProps = (state: State) => ({
  searchResults: selectSearchResults(state),
  onboardingStatus: selectOnboarding(state),
  searchText: selectSearchText(state),
  hasMore: selectHasMore(state),
  localInterests: selectUserLocalInterests(state) || [],
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  clearInterestsResults: () => {
    dispatch(InterestsAction.clearInterestsResults())
  },
  searchInterest: (text: string) =>
    dispatch(InterestsAction.searchInterests(text)),
  updateInterests: (interests: ReadonlyArray<UserInterest>) => {
    dispatch(UserAction.updateUser({ interests }))
  },
  addNewInterest: (interest: UserInterest) => {
    dispatch(InterestsAction.addNewInterestSuccess(interest))
  },
  clearNewInterest: () => dispatch(InterestsAction.clearNewInterest()),
  removeInterest: (interest: UserInterest) => {
    dispatch(InterestsAction.removeInterestSuccess(interest))
  },
  initLocalInterests: () => {
    dispatch(UserAction.initLocalInterests())
  },
})
// InterestScreenComponent.whyDidYouRender = {
//   logOnDifferentValues: false,
//   customName: "InterestScreenComponent",
//   diffNameColor: "red",
// }
export const InterestScreen = withSafeAreaInsets(
  connect(mapStateToProps, mapDispatchToProps)(InterestScreenComponent)
)
