import React from "react"
import { SvgXml } from "react-native-svg"

export type SvgProps = {
  width?: string
  height?: string
  xml?: string
}

const BaseIcon = (props: SvgProps) =>
  props.xml ? (
    <SvgXml
      width={props.width || "30px"}
      height={props.height || "30px"}
      xml={props.xml}
    />
  ) : null

export default BaseIcon
