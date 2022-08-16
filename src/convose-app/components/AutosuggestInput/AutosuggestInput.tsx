import _ from "lodash"
import React, { FunctionComponent, useContext, useRef, useState } from "react"
import { BehaviorSubject, Subscription } from "rxjs"
import { debounceTime, filter } from "rxjs/operators"
import { Keyboard, TextInput } from "react-native"

import { Interest, InterestType } from "convose-lib/interests"
import { DEFAULT_DEBOUNCE_TIME } from "convose-lib/utils"
import { ThemeContext } from "styled-components"
import {
  AutosuggestWrapper,
  Label,
  LabelWrapper,
  StyledAutosuggestInput,
} from "./Styled"

export type AutosuggestInputProps = {
  readonly onAddInterest: (interest: Interest) => void
  readonly onSearch: (text: string) => void
  readonly searchResults: ReadonlyArray<Interest> | null
  readonly setInterestValue: (text: string) => void
  readonly interestValue: string
}

const randomInterestList: ReadonlyArray<string> = [
  "English",
  "Football",
  "Swimming",
  "Paris, France",
  "Programming ",
]
enum KeyboardStatuses {
  Open = "open",
  Close = "close",
}
export const AutosuggestInput: FunctionComponent<AutosuggestInputProps> = ({
  onAddInterest,
  onSearch,
  searchResults,
  interestValue,
  setInterestValue,
}) => {
  const inputRef = useRef<TextInput>(null)
  const [keyboardStatus, setKeyboardStatus] = useState("")
  const [placeholder, setPlaceholder] = useState(randomInterestList[0])
  const phrase$: BehaviorSubject<string> = new BehaviorSubject("")
  const phraseSub: Subscription = phrase$
    .pipe(
      debounceTime(DEFAULT_DEBOUNCE_TIME),
      filter((v) => !!v)
    )
    .subscribe({
      next(value: string) {
        onSearch(value)
      },
    })

  React.useEffect(() => {
    const timer1 = setInterval(
      () =>
        setPlaceholder(_.sample(randomInterestList) || randomInterestList[0]),
      2000
    )
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardStatus(KeyboardStatuses.Open)
    })
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardStatus(KeyboardStatuses.Close)
    })
    return () => {
      phraseSub.unsubscribe()
      clearTimeout(timer1)
      showSubscription.remove()
      hideSubscription.remove()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleOnPress = (): void => {
    if (keyboardStatus === KeyboardStatuses.Close) {
      if (inputRef.current?.isFocused) {
        inputRef.current?.blur()
      }
      inputRef.current?.focus()
      return
    }
    if (!interestValue.trim().length) {
      return
    }
    const interestType =
      searchResults?.find(
        (interest) =>
          interest.name.toLowerCase() === interestValue.toLowerCase()
      )?.type === InterestType.Language
        ? InterestType.Language
        : InterestType.General

    onAddInterest({
      match: 0,
      name: interestValue.trim(),
      type: interestType,
    })
    setInterestValue("")
    onSearch("")
  }
  const handleChangeText = (text: string) => {
    if (text === "") {
      onSearch("")
    }
    setInterestValue(text)
    phrase$.next(text)
  }

  const renderLabel = (): React.ReactNode => {
    const displayValue = interestValue.length ? `Add "${interestValue}"` : ""

    return (
      <LabelWrapper>
        <Label>{displayValue}</Label>
      </LabelWrapper>
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const theme: any = useContext(ThemeContext)

  return (
    <AutosuggestWrapper onPress={handleOnPress} text={interestValue}>
      <StyledAutosuggestInput
        placeholder={`E.g., ${placeholder}`}
        placeholderTextColor={theme.interests.input.placeholder}
        value={interestValue}
        onChangeText={handleChangeText}
        autoFocus
        caretHidden={!!interestValue.length}
        onSubmitEditing={handleOnPress}
        spellCheck={false}
        autoCorrect={false}
        onFocus={() => {
          setInterestValue("")
        }}
        ref={inputRef}
      />
      {renderLabel()}
    </AutosuggestWrapper>
  )
}
