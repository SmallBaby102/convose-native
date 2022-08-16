// eslint-disable-next-line import/no-extraneous-dependencies
import React, { useEffect, useState } from "react"
// eslint-disable-next-line import/no-extraneous-dependencies
import { Keyboard, KeyboardEvent, Platform } from "react-native"

export const useKeyboard = (): [number] => {
  const [keyboardHeight, setKeyboardHeight] = useState(0)

  function onKeyboardDidShow(e: KeyboardEvent): void {
    setKeyboardHeight(e.endCoordinates.height)
  }

  function onKeyboardDidHide(): void {
    setKeyboardHeight(0)
  }
  useEffect(() => {
    function getShowEvent() {
      if (Platform.OS === "ios") {
        return "keyboardWillShow"
      }
      return "keyboardDidShow"
    }
    function getHideEvent() {
      if (Platform.OS === "ios") {
        return "keyboardWillHide"
      }
      return "keyboardDidHide"
    }
    const showEvent = getShowEvent()
    const hideEvent = getHideEvent()
    const showKeyboardListener = Keyboard.addListener(
      showEvent,
      onKeyboardDidShow
    )
    const hideKeyboardListener = Keyboard.addListener(
      hideEvent,
      onKeyboardDidHide
    )

    return (): void => {
      showKeyboardListener.remove()
      hideKeyboardListener.remove()
    }
  }, [])

  return [keyboardHeight]
}

export function withKeyboard<T>(Component: React.ComponentType<T>) {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/no-explicit-any
  return (props: any) => {
    const [keyboardHeight] = useKeyboard()
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Component keyboardHeight={keyboardHeight} {...props} />
  }
}
