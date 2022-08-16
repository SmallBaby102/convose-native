import React from "react"
import { StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { withSafeAreaInsets } from "react-native-safe-area-context"

import { color } from "convose-styles"
import { SafeAreaProps } from "convose-lib/generalTypes"
import {
  AlertDialog,
  AlertDialogTriangle,
  AlertModal,
  CircleButton,
  TextWrapper,
  AlertButton,
  UnmuteAlertContainer,
} from "./Styled"

const styles = StyleSheet.create({
  textWrapper1: { width: 180 },
  circleButton: { position: "absolute", bottom: 256, right: 21 },
  alertDialogTriangle: {
    borderTopWidth: 10,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 0,
  },
  alertButton: { width: "80%" },
  textWrapper2: { width: 280 },
})
type UnmuteAlertType = {
  toggleAudio: () => void
  unsetUnmuteAlert: () => void
}
const UnmuteAlertComponent: React.FunctionComponent<
  UnmuteAlertType & SafeAreaProps
> = ({ toggleAudio, unsetUnmuteAlert, insets }) => {
  return (
    <AlertModal onPress={unsetUnmuteAlert}>
      <UnmuteAlertContainer insetBottom={insets?.bottom || 0}>
        <AlertDialog>
          <TextWrapper fontSize={25} style={styles.textWrapper1}>
            Tap here to unmute your mic
          </TextWrapper>
          <AlertButton onPress={unsetUnmuteAlert} label="OK" />
        </AlertDialog>
        <AlertDialogTriangle style={styles.alertDialogTriangle} />
        <CircleButton
          backgroundColor={color.white}
          onPress={() => {
            toggleAudio()
            unsetUnmuteAlert()
          }}
          style={styles.circleButton}
        >
          <Ionicons name="mic-off" size={30} color={color.red} />
        </CircleButton>
      </UnmuteAlertContainer>
    </AlertModal>
  )
}
export const UnmuteAlert: React.FunctionComponent<UnmuteAlertType> = withSafeAreaInsets(
  UnmuteAlertComponent
)

export const PermissionAlert = (
  toggleDisplayPermissionAlert: () => void,
  requestPermission: () => Promise<boolean>,
  initialize: () => void
): React.ReactElement => {
  return (
    <AlertModal onPress={toggleDisplayPermissionAlert}>
      <AlertDialog isPermissionAlert>
        <TextWrapper fontSize={20} style={styles.textWrapper2}>
          Keep Convose calls upfront while using other apps?
        </TextWrapper>
        <AlertButton
          onPress={() => {
            requestPermission().then(() => {
              initialize()
            })
            toggleDisplayPermissionAlert()
          }}
          label="Grant Permission"
          style={styles.alertButton}
        />
        <AlertButton
          onPress={toggleDisplayPermissionAlert}
          label="Not now"
          type="text"
          isTextMainBlue
        />
      </AlertDialog>
    </AlertModal>
  )
}
