/* eslint-disable react-perf/jsx-no-new-object-as-prop */
import * as React from "react"

import { color } from "convose-styles"
import { MaterialIcons } from "@expo/vector-icons"
import { Animated } from "react-native"
import { OutgoingCallWrapper, Ripple } from "./Styled"
import { CircleButton } from "../CallingComponents/Styled"

export const OutgoingCallAnimation: React.FunctionComponent = () => {
  const callAnim = React.useRef(new Animated.ValueXY({ x: 1, y: 0 })).current
  const callAnim1 = React.useRef(new Animated.ValueXY({ x: 1, y: 0 })).current
  const callAnim2 = React.useRef(new Animated.ValueXY({ x: 1, y: 0 })).current
  let stopped = false
  function createAnimation() {
    callAnim.setValue({ x: 1, y: 0 })
    callAnim1.setValue({ x: 1, y: 0 })
    callAnim2.setValue({ x: 1, y: 0 })
    Animated.parallel([
      Animated.timing(callAnim, {
        toValue: { x: 0, y: 2 },
        duration: 2500,
        useNativeDriver: true,
      }),
      Animated.timing(callAnim1, {
        toValue: { x: 0, y: 2 },
        duration: 2500,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(callAnim2, {
        toValue: { x: 0, y: 2 },
        duration: 2500,
        delay: 600,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (stopped) return
      createAnimation()
    })
  }

  const Ripple1Style = {
    opacity: callAnim.x,
    transform: [{ scale: callAnim.y }],
  }
  const Ripple2Style = {
    opacity: callAnim1.x,
    transform: [{ scale: callAnim1.y }],
  }
  const Ripple3Style = {
    opacity: callAnim2.x,
    transform: [{ scale: callAnim2.y }],
  }
  React.useEffect(() => {
    createAnimation()
    return function cleanUp() {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      stopped = true
    }
  }, [callAnim, callAnim1, callAnim2])

  return (
    <OutgoingCallWrapper>
      <Ripple style={Ripple1Style} />
      <Ripple style={Ripple2Style} />
      <Ripple style={Ripple3Style} />
      <CircleButton backgroundColor={color.green}>
        <MaterialIcons name="call" size={28} color="white" />
      </CircleButton>
    </OutgoingCallWrapper>
  )
}
