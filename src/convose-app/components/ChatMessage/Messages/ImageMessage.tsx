import React, { useState, useContext, useRef, useEffect } from "react"
import { Animated } from "react-native"
import { ThemeContext } from "styled-components"

import { StyledImageContainer, StyledImage } from "../Styled"

type Props = {
  uri: { uri: string }
  ratio: number | null
  resizeMode: string
  isInCallingChat: boolean
}

export const ImageMessage: React.FunctionComponent<Props> = ({
  ratio,
  resizeMode,
  uri,
  isInCallingChat,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const theme: any = useContext(ThemeContext)
  const colorAnim = useRef(new Animated.Value(0)).current

  const [isLoading, setLoading] = useState(true)
  const animationLoop = useRef(
    Animated.loop(
      Animated.spring(colorAnim, {
        toValue: 1,
        friction: 5,
        tension: 0,
        useNativeDriver: false,
      })
    )
  ).current

  useEffect(() => {
    if (isLoading) {
      animationLoop.start()
    } else {
      animationLoop.stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  const propertyAnimation = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      theme.message.loadingMessage,
      theme.message.loadingMessageDark,
    ],
  })
  // console.log(animationLoop)
  return (
    <StyledImageContainer
      ratio={ratio}
      isInCallingChat={isInCallingChat}
      // eslint-disable-next-line react-perf/jsx-no-new-object-as-prop
      style={{
        backgroundColor: propertyAnimation,
      }}
    >
      <StyledImage
        isInCallingChat={isInCallingChat}
        source={uri}
        ratio={ratio}
        resizeMode={resizeMode}
        onLoadStart={() => setLoading(true)}
        onLoad={() => setLoading(false)}
      />
    </StyledImageContainer>
  )
}
