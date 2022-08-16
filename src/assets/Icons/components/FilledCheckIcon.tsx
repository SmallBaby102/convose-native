import React from "react"
import BaseIcon, { SvgProps } from "./BaseIcon"

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="14.8025" cy="14.986" r="14.5085" fill="#04E000"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M8.12837 14.019L6.09718 16.1469L12.1907 22.5306L22.3467 11.8911L20.3155 9.76318L12.1907 18.2748L8.12837 14.019Z" fill="white"/>
</svg>
`

const FilledCheckIcon = (props: SvgProps) => (
  <BaseIcon width={props.width} height={props.height} xml={xml} />
)

export default FilledCheckIcon
