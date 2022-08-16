import React from "react"
import { StatusBar } from "expo-status-bar"
import { ThemeContext } from "styled-components"

const StatusBarAutoComponent: React.FC = () => {
  const theme = React.useContext<any>(ThemeContext)

  return <StatusBar style={theme.mode === "dark" ? "light" : "dark"} />
}

export const StatusBarAuto = React.memo(StatusBarAutoComponent)
