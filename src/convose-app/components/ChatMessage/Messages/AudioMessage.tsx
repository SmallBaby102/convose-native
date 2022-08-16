/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Component } from "react"
import { ActivityIndicator, Platform } from "react-native"
import { FontAwesome } from "@expo/vector-icons"
import { Audio } from "expo-av"
import { activateKeepAwake, deactivateKeepAwake } from "expo-keep-awake"
import Slider from "@react-native-community/slider"
import _ from "lodash"
import {
  AudioMessagePlayer,
  DeleteMessageTypes,
  Message,
} from "convose-lib/chat"
import {
  DEFAULT_HIT_SLOP,
  LONG_PRESS_DURATION,
  millisToMinutesAndSeconds,
} from "convose-lib/utils"
import { color } from "convose-styles"
import { withTheme } from "styled-components"
import {
  AudioIconsWrapper,
  AudioMessageTimer,
  AudioMessageWrapper,
} from "./style"
import { convoseAlertRef } from "../../../RootConvoseAlert"

type AudioMessageProps = {
  isInCallingChat: boolean
  theme: any
}
type AudioMessageState = {
  readonly soundObject: Audio.Sound | null
  readonly soundInfo: any | null
  readonly positionMillis: number
  readonly isPlaying: boolean
  readonly loading: boolean
}
const minimumInterval = 50
const sliderStyle = { flex: 1, height: 20 }
const iosButtonStyle =
  Platform.OS === "ios" ? { marginRight: 10, width: 25 } : {}

function getDurationFromLength(length: string | number | null): number {
  if (!length) {
    return 0
  }
  if (typeof length === "number") {
    return length
  }
  const lengthParts = length.split(":")

  const minutes = Number(lengthParts[lengthParts.length - 2])
  const seconds = Number(lengthParts[lengthParts.length - 1])
  const minutesInSeconds = minutes * 60
  const allSeconds = seconds + minutesInSeconds
  return allSeconds * 1000
}

type AllProps = Message &
  AudioMessageProps &
  AudioMessagePlayer &
  DeleteMessageTypes
// AudioMessagePlayer props are coming from "ChatMessageList.tsx" component!
class AudioMessageComponent extends Component<AllProps, AudioMessageState> {
  public sliderTimeout: any

  public readonly state: AudioMessageState = {
    isPlaying: false,
    loading: false,
    positionMillis: 0,
    soundInfo: null,
    soundObject: null,
  }

  public shouldComponentUpdate(
    prevProps: AllProps,
    prevState: AudioMessageState
  ): boolean {
    return (
      !_.isEqual(this.props, prevProps) || !_.isEqual(this.state, prevState)
    )
  }

  public componentDidUpdate(prevProps: AllProps, prevState: AudioMessageState) {
    const { shouldPlay } = this.props
    const { isPlaying } = this.state
    if (prevProps.shouldPlay !== shouldPlay) {
      this.handlePlayPauseEffect(shouldPlay, isPlaying)
    }
    if (isPlaying !== prevState.isPlaying) {
      this.preventAutoLock(isPlaying)
    }
  }

  public componentWillUnmount(): void {
    const { soundObject } = this.state
    if (soundObject) {
      soundObject.unloadAsync()
    }
  }

  public preventAutoLock = (isPlaying: boolean): void => {
    if (isPlaying) {
      activateKeepAwake()
    } else {
      deactivateKeepAwake()
    }
  }

  public handlePlayPauseEffect = (
    shouldPlay: boolean,
    isPlaying: boolean
  ): void => {
    if (shouldPlay && !isPlaying) {
      this.handlePlay()
    } else if (!shouldPlay && isPlaying) {
      this.handlePauseClick()
    }
  }

  public readonly loadAudioData = async (autoPlay = false): Promise<void> => {
    const { data } = this.props
    this.setState({ loading: true })
    const soundObject = new Audio.Sound()
    try {
      soundObject.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate)
      const status = await soundObject.loadAsync({
        uri: data,
      })
      await soundObject.setProgressUpdateIntervalAsync(minimumInterval)
      this.setState({ soundObject, soundInfo: status })

      if (status.isLoaded) {
        this.setState({ loading: false })
        if (autoPlay) {
          await this.playAudio(soundObject)
        }
      }
    } catch (error) {
      this.setState({ loading: false })
      convoseAlertRef?.show({
        ioniconName: "ios-warning",
        title: `Playing the audio`,
        description:
          "Sorry, something went wrong while playing the audio file try again later",
      })
    }
  }

  public readonly playAudio = async (
    soundObject: Audio.Sound
  ): Promise<void> => {
    try {
      await soundObject.playAsync()
      this.setState({ isPlaying: true })
    } catch (error) {
      convoseAlertRef?.show({
        ioniconName: "ios-warning",
        title: `Playing the audio`,
        description:
          "Sorry, something went wrong while playing the audio file try again later",
      })
      // console.log('Playing audio error', error)
    }
  }

  // Event handlers
  public readonly handlePlayClick = async (): Promise<void> => {
    const { requestPlay, uuid, shouldPlay } = this.props
    const { isPlaying } = this.state
    if (shouldPlay && !isPlaying) {
      this.handlePlay()
      return
    }
    requestPlay(uuid)
  }

  public readonly handlePlay = async (): Promise<void> => {
    const { soundObject } = this.state
    if (soundObject) {
      await this.playAudio(soundObject)
    } else {
      this.loadAudioData(true)
    }
  }

  public readonly requestForStop = (pause = false): void => {
    const { requestStop } = this.props
    requestStop(pause)
  }

  public readonly handlePauseClick = async (): Promise<void> => {
    const { soundObject, isPlaying } = this.state
    if (soundObject) {
      try {
        await soundObject.pauseAsync()
        this.requestForStop(true)
        this.setState({ isPlaying: !isPlaying })
      } catch (error) {
        // console.log('Pausing audio error', error)
      }
    }
  }

  public readonly onPlaybackStatusUpdate = async (
    status: any
  ): Promise<void> => {
    const { soundObject } = this.state

    status.isPlaying && this.setState({ positionMillis: status.positionMillis })

    if (status.didJustFinish) {
      this.requestForStop()
      this.setState({ isPlaying: false, positionMillis: 0 })
      if (soundObject) {
        try {
          soundObject.pauseAsync()
          soundObject.setPositionAsync(0)
        } catch (error) {
          // console.log(error)
        }
      }
    }
  }

  public readonly onSlidingComplete = async (value: number): Promise<void> => {
    const { selectedMessageUUID } = this.props
    const { soundObject } = this.state
    if (soundObject) {
      try {
        await soundObject.setPositionAsync(value, {
          toleranceMillisBefore: 1000,
          toleranceMillisAfter: 1000,
        })
        if (!selectedMessageUUID) {
          this.setState({ isPlaying: true })
          await soundObject.playAsync()
        }
      } catch (error) {
        // console.log(error)
      }
    }
  }

  public readonly onValueChange = (value: number): void => {
    const { positionMillis } = this.state
    const dragDifference = Math.abs(positionMillis - value)
    if (dragDifference > 30) {
      this.cancelSliderLongPress()
    }
    const { soundObject } = this.state
    if (soundObject) {
      try {
        soundObject.pauseAsync()
      } catch (error) {
        // console.log(error)
      }
    }
  }

  public readonly onPlayPausePress = (): void => {
    const { dismissSelectedMessage } = this.props
    const { isPlaying } = this.state
    dismissSelectedMessage()
    if (isPlaying) {
      this.handlePauseClick()
    } else {
      this.handlePlayClick()
    }
  }

  // Render
  public readonly renderButtons = (): React.ReactNode => {
    const { loading } = this.state
    const { isInCallingChat, myMessage, theme } = this.props
    const buttonColor =
      myMessage && !isInCallingChat ? color.white : theme.mainBlue
    if (loading) {
      return (
        <ActivityIndicator
          size="small"
          color={buttonColor}
          style={iosButtonStyle}
        />
      )
    }
    const { isPlaying } = this.state
    const { selectMessage } = this.props
    const iconSize = isPlaying ? 23 : 25

    return (
      <AudioIconsWrapper
        onPress={this.onPlayPausePress}
        onLongPress={selectMessage}
        delayLongPress={LONG_PRESS_DURATION}
        hitSlop={DEFAULT_HIT_SLOP}
      >
        <FontAwesome
          name={isPlaying ? "pause" : "play"}
          color={buttonColor}
          size={Platform.OS === "ios" ? iconSize + 5 : iconSize}
        />
      </AudioIconsWrapper>
    )
  }

  public onTouchSliderStarted = (): void => {
    const { selectMessage } = this.props
    this.sliderTimeout = setTimeout(() => {
      selectMessage(this.props)
    }, LONG_PRESS_DURATION)
  }

  public cancelSliderLongPress = (): void => {
    if (this.sliderTimeout) {
      clearTimeout(this.sliderTimeout)
    }
  }

  // eslint-disable-next-line complexity
  public render(): React.ReactNode {
    const {
      myMessage,
      length,
      isInCallingChat,
      theme,
      selectMessage,
    } = this.props
    const { soundInfo, positionMillis, isPlaying } = this.state

    const buttonColor =
      myMessage && !isInCallingChat ? color.white : theme.mainBlue

    const durationFromLength = getDurationFromLength(length)
    const soundDuration = soundInfo
      ? soundInfo.durationMillis || soundInfo.playableDurationMillis
      : durationFromLength

    return (
      <>
        <AudioMessageWrapper
          onLongPress={selectMessage}
          delayLongPress={LONG_PRESS_DURATION}
        >
          {this.renderButtons()}
          <Slider
            onResponderStart={this.onTouchSliderStarted}
            onResponderEnd={this.cancelSliderLongPress}
            style={sliderStyle}
            minimumValue={0}
            maximumValue={soundDuration}
            minimumTrackTintColor={
              myMessage && !isInCallingChat ? color.white : theme.mainBlue
            }
            maximumTrackTintColor={
              myMessage && !isInCallingChat ? color.lightGray : color.darkGray
            }
            thumbTintColor={buttonColor}
            value={positionMillis}
            onValueChange={this.onValueChange}
            onSlidingComplete={this.onSlidingComplete}
          />
          <AudioMessageTimer myMessage={myMessage && !isInCallingChat}>
            {!isPlaying
              ? length || "0:00"
              : millisToMinutesAndSeconds(positionMillis)}
          </AudioMessageTimer>
        </AudioMessageWrapper>
      </>
    )
  }
}
// AudioMessageComponent.whyDidYouRender = {
//   logOnDifferentValues: false,
//   customName: "AudioMessageComponent",
//   diffNameColor: "red",
// }
export const AudioMessage = withTheme(AudioMessageComponent)
