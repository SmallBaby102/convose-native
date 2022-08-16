import React, { FunctionComponent, useRef, useState } from "react"
import {
  NativeSyntheticEvent,
  TextInput,
  TextInputProps,
  TextInputFocusEventData,
  Keyboard,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native"

import { EditButton, InputWrapper, StyledInput } from "./Styled"

import EditIcon from "../../../../assets/Icons/components/EditIcon"

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

type UsernameInputProps = TextInputProps & {
  readonly color: string
}
const EDIT_ICON_SIZE = 17
export const UsernameInput: FunctionComponent<UsernameInputProps> = ({
  color,
  ...InputProps
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<TextInput>()

  const focusInput = () => {
    inputRef.current && inputRef.current.focus()
  }
  const onFocus = () => {
    setIsFocused(true)
    LayoutAnimation.configureNext(layoutAnimConfig)
  }
  const onBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    const callback = InputProps.onBlur
    setIsFocused(false)
    Keyboard.dismiss()
    callback && callback(e)
    LayoutAnimation.configureNext(layoutAnimConfig)
  }

  return (
    <InputWrapper>
      <StyledInput
        ref={inputRef}
        maxLength={12}
        blurOnSubmit
        selectTextOnFocus
        spellCheck={false}
        autoCorrect={false}
        textAlign="center"
        color={color}
        onFocus={onFocus}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...InputProps}
        onBlur={onBlur}
      />
      {!isFocused && (
        <EditButton
          onPress={focusInput}
          iconComponent={
            <EditIcon
              width={`${EDIT_ICON_SIZE}`}
              height={`${EDIT_ICON_SIZE}`}
            />
          }
          // eslint-disable-next-line react-perf/jsx-no-new-object-as-prop
          style={{ width: EDIT_ICON_SIZE, height: EDIT_ICON_SIZE }}
        />
      )}
    </InputWrapper>
  )
}
