import React from "react"
import BaseIcon, { SvgProps } from "./BaseIcon"

const xml = `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15 29.9994C23.2843 29.9994 30 23.2838 30 14.9997C30 6.7156 23.2843 0 15 0C6.71573 0 0 6.7156 0 14.9997C0 18.7407 1.36953 22.1618 3.63458 24.789C4.02722 25.2445 4.03029 25.9311 3.60549 26.3567L1.04549 28.9214C0.648788 29.3189 0.930235 29.9975 1.49179 29.9976L15 29.9994C15.0823 30.0007 14.9174 29.9994 15 29.9994Z" fill="#19AAEB"/>
</svg>`

const InboxIcon = (props: SvgProps) => (
  <BaseIcon width={props.width} height={props.height} xml={xml} />
)

export default InboxIcon
