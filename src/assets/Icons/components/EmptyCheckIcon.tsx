import React from "react"
import BaseIcon, { SvgProps } from "./BaseIcon"

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="14.5" cy="14.5" r="14.5" fill="#F1F1F1"/>
</svg>`

const EmptyCheckIcon = (props: SvgProps) => (
  <BaseIcon width={props.width} height={props.height} xml={xml} />
)

export default EmptyCheckIcon
