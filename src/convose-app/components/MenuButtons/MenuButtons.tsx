import React, { FunctionComponent, SFC } from "react"

import { DEFAULT_HIT_SLOP } from "convose-lib/utils"
import { color } from "convose-styles"
import { FontAwesome5 } from "@expo/vector-icons"
import {
  IconWrapper,
  MenuItemButton,
  MenuItemLabel,
  MenuWrapper,
} from "./Styled"

export type Item = {
  readonly onPress: () => void
  readonly label: string
  readonly icon: string | React.ReactNode
}
type MenuButtonsProps = {
  readonly items: ReadonlyArray<Item>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly style?: any
}
const size = 24
const renderItem = (
  item: Item,
  index: number,
  noMargin?: boolean
): React.ReactNode => (
  <MenuItemButton
    key={index}
    withMargin={!noMargin}
    onPress={item.onPress}
    hitSlop={DEFAULT_HIT_SLOP}
  >
    <IconWrapper>
      {typeof item.icon === "string" ? (
        <FontAwesome5 name={item.icon} size={size} color={color.black} />
      ) : (
        item.icon
      )}
    </IconWrapper>

    <MenuItemLabel>{item.label}</MenuItemLabel>
  </MenuItemButton>
)

export const MenuButtons: FunctionComponent<MenuButtonsProps> = ({ items }) => (
  <MenuWrapper>
    {items.map((item, index) => renderItem(item, index, items.length === 1))}
  </MenuWrapper>
)
