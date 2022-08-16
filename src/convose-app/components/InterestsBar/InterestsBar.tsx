/* eslint-disable react-perf/jsx-no-new-object-as-prop */
import React, { FunctionComponent, useEffect } from "react"

import { Interest, InterestLocation, UserInterest } from "convose-lib/interests"
import { MY_INTEREST_SIZE, softShadows } from "convose-styles"
import { useKeyboard } from "convose-lib/utils/useKeyboard"
import {
  Platform,
  TextInput,
  FlatList,
  ListRenderItemInfo,
  ListRenderItem,
  LayoutAnimation,
  UIManager,
} from "react-native"
import {
  DoneButton,
  StyledInterestsBarView,
  InterestBarActionsContainer,
  CurrentInterestsWrapper,
  DoneButtonTitle,
  InterestBarContainer,
} from "./Styled"
import { AutosuggestInput } from "../../components"
import { InterestButton } from "../InterestButton"

type InterestsBarProps = {
  readonly interestsCount?: number
  readonly onClose?: () => void
  readonly onCancel?: () => void
  readonly onCreate?: (interest: Interest) => void
  readonly partners?: boolean
  readonly showResults?: boolean
  readonly showInterests?: boolean
  readonly unreadMessagesCount?: number
  readonly onSearch: (text: string) => void
  readonly onAddInterest: (interest: Interest) => void
  readonly getProfilePosition?: (profile: React.RefObject<TextInput>) => void
  readonly searchResults: ReadonlyArray<Interest> | null
  readonly currentInterests: ReadonlyArray<UserInterest>
  readonly onDeleteInterest: (interest: UserInterest) => void
  readonly openRatingWheel: (interest: UserInterest) => void
  readonly setInterestValue: (text: string) => void
  readonly interestValue: string
  readonly renderNewInterest: boolean
  readonly insetBottom: number
}
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
const InterestsBarComponent: FunctionComponent<InterestsBarProps> = ({
  onClose,
  onAddInterest,
  onSearch,
  searchResults,
  currentInterests,
  onDeleteInterest,
  openRatingWheel,
  interestValue,
  setInterestValue,
  renderNewInterest,
  insetBottom,
}) => {
  useEffect(() => {
    LayoutAnimation.configureNext(layoutAnimConfig)
  }, [currentInterests.length])

  const renderDoneButton = () => (
    <DoneButton onPress={onClose}>
      <DoneButtonTitle>Done</DoneButtonTitle>
    </DoneButton>
  )
  const [keyboardHeight] = useKeyboard()

  const renderCurrentInterestItem: ListRenderItem<UserInterest> = (
    info: ListRenderItemInfo<UserInterest>
  ) => {
    const interest = info.item
    return (
      <InterestButton
        size={MY_INTEREST_SIZE}
        interestLocation={InterestLocation.MyInterests}
        interest={interest}
        key={interest.name}
        onDelete={(userInterest: UserInterest) => {
          onDeleteInterest(userInterest)
          LayoutAnimation.configureNext(layoutAnimConfig)
        }}
        onPress={() => openRatingWheel(interest)}
        addBorder
        transparentBackground
        wrapperStyle={{
          marginTop: 0,
        }}
      />
    )
  }
  const renderInterests = (): React.ReactElement | null => {
    if (currentInterests.length) {
      return (
        <CurrentInterestsWrapper>
          <FlatList
            horizontal
            data={currentInterests}
            keyExtractor={(data) => data.name}
            renderItem={renderCurrentInterestItem}
            removeClippedSubviews={Platform.OS === "android"}
            maxToRenderPerBatch={50}
            initialNumToRender={50}
            keyboardShouldPersistTaps="handled"
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          />
        </CurrentInterestsWrapper>
      )
    }
    return null
  }

  const insetBottomWithKeyboard = keyboardHeight ? 0 : insetBottom
  return (
    <StyledInterestsBarView
      style={{
        ...softShadows,
        marginBottom: Platform.OS === "ios" ? keyboardHeight : null,
      }}
      insetBottom={insetBottomWithKeyboard}
    >
      <InterestBarContainer renderNewInterest={renderNewInterest}>
        {renderInterests()}
        <InterestBarActionsContainer>
          <AutosuggestInput
            onAddInterest={onAddInterest}
            onSearch={onSearch}
            searchResults={searchResults}
            interestValue={interestValue}
            setInterestValue={setInterestValue}
          />
          {renderDoneButton()}
        </InterestBarActionsContainer>
      </InterestBarContainer>
    </StyledInterestsBarView>
  )
}
// InterestsBarComponent.whyDidYouRender = {
//   logOnDifferentValues: false,
//   customName: "InterestsBarComponent",
//   diffNameColor: "red",
// }
export const InterestsBar = React.memo(InterestsBarComponent)
