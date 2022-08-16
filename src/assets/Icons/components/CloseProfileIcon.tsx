import React from "react"
import BaseIcon, { SvgProps } from "./BaseIcon"

const xml = `<svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="26" cy="26" r="25.5" fill="white" stroke="white"/>
<rect x="36.4268" y="14.02" width="2.19718" height="31.7022" rx="1.09859" transform="rotate(45 36.4268 14.02)" fill="#808080"/>
<rect x="14.0206" y="15.5773" width="2.19718" height="31.7022" rx="1.09859" transform="rotate(-45 14.0206 15.5773)" fill="#808080"/>
</svg>
`

const CloseProfileIcon = (props: SvgProps) => (
  <BaseIcon width={props.width} height={props.height} xml={xml} />
)

export default CloseProfileIcon
