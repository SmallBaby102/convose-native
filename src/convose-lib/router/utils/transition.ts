import { Animated, Easing } from "react-native"
import { TransitionConfig } from "react-navigation"

export const fromLeft = (duration = 300): TransitionConfig => ({
  screenInterpolator: ({ layout, position, scene }) => {
    const { index } = scene
    const { initWidth } = layout

    const translateX = position.interpolate({
      inputRange: [index - 1, index, index + 1],
      outputRange: [initWidth, 0, 0],
    })

    const opacity = position.interpolate({
      inputRange: [index - 1, index - 0.99, index],
      outputRange: [0, 1, 1],
    })

    return { opacity, transform: [{ translateX }] }
  },
  transitionSpec: {
    duration,
    easing: Easing.out(Easing.poly(4)),
    timing: Animated.timing,
  },
})
