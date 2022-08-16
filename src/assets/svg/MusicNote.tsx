import React from "react"
import { Svg, Path } from "react-native-svg"
import { SvgProps } from "./types"
import { getRatio, getWidth } from "./utils"

const defaultHeight = 34
const defaultWidth = 36
const ratio = getRatio(defaultHeight, defaultWidth)

export const MusicNoteSvg: React.FunctionComponent<SvgProps> = ({
  color,
  height,
}) => {
  const svgHeight = height || defaultHeight
  const svgWidth = height ? getWidth(ratio, height) : defaultWidth
  return (
    <Svg width={svgWidth} height={svgHeight} viewBox="0 0 36 34" fill="none">
      <Path
        d="M35.3459 0.771384C35.1545 0.318682 34.7016 -5.67552e-05 34.1787 -5.67552e-05H12.1278C11.5209 -5.67552e-05 11.0073 0.438789 10.8906 1.00697C10.8672 1.08089 10.8625 1.17327 10.8625 1.25642V8.10238V27.8873C10.8625 28.5802 11.4275 29.1392 12.1278 29.1392C12.8281 29.1392 13.3977 28.5802 13.3977 27.8873V8.10238H32.9088V27.8873C32.9088 28.5802 33.4784 29.1392 34.1787 29.1392C34.879 29.1392 35.4486 28.5802 35.4486 27.8873V8.10238V1.25642C35.4486 1.08088 35.4112 0.914586 35.3459 0.771384Z"
        fill={color || "#59EC56"}
      />
      <Path
        d="M28.8185 24.0374C25.1534 24.5548 22.1887 27.1232 22.1887 29.7747C22.1887 32.417 25.1534 34.1493 28.8185 33.6227C32.4788 33.1053 35.4482 30.5323 35.4482 27.89C35.4482 25.2385 32.4788 23.5108 28.8185 24.0374Z"
        fill={color || "#59EC56"}
      />
      <Path
        d="M6.7706 24.0374C3.10557 24.5548 0.140869 27.1232 0.140869 29.7747C0.140869 32.417 3.10557 34.1493 6.7706 33.6227C10.431 33.1053 13.4003 30.5323 13.4003 27.89C13.4003 25.2385 10.431 23.5108 6.7706 24.0374Z"
        fill={color || "#59EC56"}
      />
    </Svg>
  )
}
