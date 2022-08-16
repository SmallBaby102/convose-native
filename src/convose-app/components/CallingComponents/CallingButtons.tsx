/* eslint-disable no-nested-ternary */
import React, { FunctionComponent } from "react"
import { Platform } from "react-native"
import _ from "lodash"

import { AudioSetting } from "convose-lib/calling"
import { color, defaultShadows } from "convose-styles"
import { FontAwesome5, MaterialIcons, Ionicons } from "@expo/vector-icons"
import { withSafeAreaInsets } from "react-native-safe-area-context"
import { SafeAreaProps } from "convose-lib/generalTypes"
import { ButtonWrapper, CircleButton, MuteIconWrapper, styles } from "./Styled"

type CallingButtonsProps = {
  audioSetting: AudioSetting
  isHost: boolean
  inputFormHeight: number
  toggleAudio: () => void
  toggleVideo: () => void
  toggleSpeaker: () => void
  endCall: () => void
}
type AllProps = CallingButtonsProps & SafeAreaProps
// eslint-disable-next-line complexity
const CallingButtonsComponent: FunctionComponent<AllProps> = ({
  audioSetting,
  isHost,
  inputFormHeight,
  toggleAudio,
  toggleVideo,
  toggleSpeaker,
  endCall,
  insets,
}) => {
  const isSpeakerActive =
    [3, 4].includes(audioSetting.speakerMode) ||
    (Platform.OS === "android" &&
      !isHost &&
      [3, 4].includes(audioSetting.speakerMode))

  const insetBottom = insets?.bottom || 0
  const buttonWrapperHeight = inputFormHeight || insetBottom

  return (
    <ButtonWrapper height={buttonWrapperHeight}>
      <CircleButton
        backgroundColor={
          !isHost
            ? color.white
            : audioSetting.isAudioEnabled
            ? color.mainBlue
            : color.white
        }
        onPress={toggleAudio}
        style={defaultShadows}
      >
        {!audioSetting.isAudioEnabled ? (
          <Ionicons name="mic-off" size={30} color={color.red} />
        ) : (
          <Ionicons
            name="mic"
            size={30}
            color={!isHost ? color.red : color.white}
            style={styles.minActiveIcon}
          />
        )}
      </CircleButton>

      <CircleButton
        backgroundColor={
          !isHost
            ? color.white
            : audioSetting.isVideoEnabled
            ? color.mainBlue
            : color.white
        }
        onPress={toggleVideo}
        style={defaultShadows}
      >
        {audioSetting.isVideoEnabled ? (
          <FontAwesome5
            name="video"
            size={20}
            color={!isHost ? color.red : color.white}
          />
        ) : (
          <FontAwesome5 name="video-slash" size={20} color={color.red} />
        )}
      </CircleButton>

      <CircleButton
        backgroundColor={isSpeakerActive ? color.mainBlue : color.white}
        onPress={toggleSpeaker}
        style={defaultShadows}
      >
        <Ionicons
          name={isSpeakerActive ? "volume-high" : "volume-mute"}
          size={28}
          color={isSpeakerActive ? color.white : color.red}
        />
        {/* <FontAwesome
          name="volume-up"
          size={24}
          color={
            [3, 4].includes(audioSetting.speakerMode) ||
            (Platform.OS === "android" &&
              !isHost &&
              [3, 4].includes(audioSetting.speakerMode))
              ? color.white
              : color.mainBlue
          }
        /> */}
      </CircleButton>

      <CircleButton
        backgroundColor={color.red}
        onPress={endCall}
        style={defaultShadows}
      >
        <MaterialIcons name="call-end" size={24} color="white" />
      </CircleButton>
    </ButtonWrapper>
  )
}

export const MuteIcon = (size: number, dark: boolean): React.ReactElement => (
  <MuteIconWrapper size={size} dark={dark}>
    <Ionicons name="mic-off" size={12} color={dark ? color.white : color.red} />
  </MuteIconWrapper>
)
// CallingButtonsComponent.whyDidYouRender = {
//   logOnDifferentValues: false,
//   customName: "CallingButtonsComponent",
//   diffNameColor: "red",
// }
const CallingButtonsUnMemo = withSafeAreaInsets(CallingButtonsComponent)

export const CallingButtons = React.memo(
  CallingButtonsUnMemo,
  (prevProps, nextProps) => {
    return _.isEqual(nextProps, prevProps)
  }
)
