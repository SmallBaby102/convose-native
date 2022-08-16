import React from "react"
import { Keyboard } from "react-native"
import { useDrawerStatus } from "@react-navigation/drawer"

export const CloseKeyboard: React.FC = () => {
  const drawerStatus = useDrawerStatus()
  React.useEffect(() => {
    if (drawerStatus === "closed") {
      Keyboard.dismiss()
    }
  }, [drawerStatus])
  return null
}
