/* eslint-disable react/destructuring-assignment */
import React from "react"
import BaseIcon, { SvgProps } from "./BaseIcon"

const xml = `<svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13 0.75C6.26193 0.75 0.75 6.26193 0.75 13C0.75 19.7381 6.26193 25.25 13 25.25C19.7381 25.25 25.25 19.7381 25.25 13C25.25 6.26193 19.7381 0.75 13 0.75ZM3.65 13C3.65 7.85807 7.85807 3.65 13 3.65C15.0079 3.65 16.9088 4.28863 18.501 5.46544L5.46544 18.501C4.28863 16.9088 3.65 15.0079 3.65 13ZM13 22.35C10.9921 22.35 9.09121 21.7114 7.49899 20.5346L20.5346 7.49899C21.7114 9.09121 22.35 10.9921 22.35 13C22.35 18.1419 18.1419 22.35 13 22.35Z" fill="#FF6060" stroke="#FF6060" stroke-width="0.5"/>
</svg>`

const BlockIcon = (props: SvgProps): React.ReactElement => (
  <BaseIcon width={props.width} height={props.height} xml={xml} />
)

export default BlockIcon
