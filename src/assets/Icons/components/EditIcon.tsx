import React from "react"
import BaseIcon, { SvgProps } from "./BaseIcon"

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.66736 1.78069L8.84851 3.96181L3.32742 9.4829L1.14751 7.30178L6.66736 1.78069ZM10.5036 1.25465L9.53088 0.281939C9.15496 -0.0939796 8.54454 -0.0939796 8.16735 0.281939L7.23559 1.2137L9.41674 3.39485L10.5036 2.308C10.7951 2.01642 10.7951 1.54621 10.5036 1.25465ZM0.00606962 10.3675C-0.0336245 10.5462 0.127666 10.7062 0.30633 10.6628L2.73686 10.0735L0.556942 7.89236L0.00606962 10.3675Z" fill="#AAAAAA" fill-opacity="0.7"/>
</svg>`

const EditIcon = (props: SvgProps) => (
  <BaseIcon width={props.width} height={props.height} xml={xml} />
)

export default EditIcon
