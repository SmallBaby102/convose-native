// eslint-disable-next-line import/no-extraneous-dependencies
import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  thumb: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    resizeMode: "contain",
  },
  pressedIndicator: {
    position: "absolute",
    opacity: 0.2,
  },
})
