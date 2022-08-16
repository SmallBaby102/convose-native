/* eslint-disable @typescript-eslint/no-var-requires */
import React, { useRef, useEffect } from "react"
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  ListRenderItemInfo,
  Platform,
} from "react-native"

import {
  Interest,
  AutoSuggestInterest,
  LIMIT_OF_INTERESTS,
} from "convose-lib/interests"
import { color } from "convose-styles"
import AutosuggestOption from "../AutosuggestOption/AutosuggestOption"
import {
  AutosuggestOptionListFooterContainer,
  EmptyListContainer,
  EmptyListScrollView,
  FlatListWrapper,
  InfoText,
  StyledImage,
  styles,
  Title,
} from "./Styled"
import { PointerArrow } from "./PointerArrow"

const noResultImage = require("../../../assets/no-results.png")

export interface IAutosuggestOptionListProps {
  readonly results: ReadonlyArray<AutoSuggestInterest>
  readonly onSelect: (interest: Interest) => void
  readonly hasMoreInterests: boolean
  readonly onLoadMoreInterest?: () => void
  readonly searchText: string
  readonly hasSelectedInterest: boolean
  readonly onRemove: (interest: Interest) => void
  readonly renderNewInterest: boolean
}

const AutosuggestOptionListComponent: React.FunctionComponent<IAutosuggestOptionListProps> = ({
  results,
  onSelect,
  hasMoreInterests,
  onLoadMoreInterest,
  searchText,
  hasSelectedInterest,
  onRemove,
  renderNewInterest,
}) => {
  const isAndroid = Platform.OS === "android"
  const flatListRef = useRef<FlatList>(null)

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ animated: true, offset: 0 })
    }
  }, [searchText])

  const keyExtractor = (interest: Interest) => interest.name

  const renderRow: ListRenderItem<Interest> = (
    info: ListRenderItemInfo<Interest>
  ) => (
    <AutosuggestOption
      onSelect={onSelect}
      interest={info.item}
      onRemove={onRemove}
    />
  )

  const renderEmptyList = () => {
    return (
      <EmptyListContainer>
        <EmptyListScrollView
          // eslint-disable-next-line react-perf/jsx-no-new-object-as-prop
          style={{
            bottom: hasSelectedInterest ? -70 : -10,
          }}
          keyboardShouldPersistTaps="none"
          keyboardDismissMode="none"
          contentContainerStyle={styles.scrollContainer}
        >
          <StyledImage source={noResultImage} />
          <Title>You found a new interest!</Title>
          <InfoText>
            Tap to add the new interest to your profile and to this list for
            other Convose users to search for.
          </InfoText>
          <PointerArrow />
        </EmptyListScrollView>
      </EmptyListContainer>
    )
  }
  const renderFooter = (): React.ReactElement | null => {
    if (hasMoreInterests) {
      return (
        <AutosuggestOptionListFooterContainer>
          <ActivityIndicator size={isAndroid ? 25 : 8} color={color.dusk} />
        </AutosuggestOptionListFooterContainer>
      )
    }
    return null
  }
  const onLoadMore = () => {
    !!onLoadMoreInterest && onLoadMoreInterest()
  }

  return (
    <FlatListWrapper>
      {!renderNewInterest ? (
        <FlatList
          ref={flatListRef}
          data={results}
          inverted
          renderItem={renderRow}
          keyExtractor={keyExtractor}
          keyboardShouldPersistTaps="handled"
          alwaysBounceVertical
          removeClippedSubviews={isAndroid}
          maxToRenderPerBatch={LIMIT_OF_INTERESTS}
          initialNumToRender={LIMIT_OF_INTERESTS}
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.01}
          ListFooterComponent={renderFooter()}
        />
      ) : (
        renderEmptyList()
      )}
    </FlatListWrapper>
  )
}
// AutosuggestOptionListComponent.whyDidYouRender = {
//   logOnDifferentValues: false,
//   customName: "AutosuggestOptionListComponent",
//   diffNameColor: "red",
// }
export const AutosuggestOptionList = React.memo(AutosuggestOptionListComponent)
