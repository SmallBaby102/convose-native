import React from "react"
import { LayoutAnimation, Platform, UIManager } from "react-native"
import _ from "lodash"

import { hardShadow } from "convose-styles"
import { MessageActionType } from "convose-lib/chat"
import {
  ComponentWrapper,
  MessageActionsWrapper,
  ActionButton,
  ActionIcon,
  ActionTitle,
} from "./Styled"

type ButtonType = {
  iconName: string
  title: string
  onPress: () => void
}
const Button: React.FunctionComponent<ButtonType> = ({
  iconName,
  onPress,
  title,
}) => {
  return (
    <ActionButton onPress={onPress}>
      <ActionIcon name={iconName} size={22} />
      <ActionTitle>{title}</ActionTitle>
    </ActionButton>
  )
}
// const mutationLayout = {
//   duration: 100,
//   type: LayoutAnimation.Types.easeInEaseOut,
//   property: LayoutAnimation.Properties.scaleY,
// }
const layoutAnimConfig = {
  duration: 100,
  update: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.scaleY,
  },
  // delete: mutationLayout,
  // create: mutationLayout,
}

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}
export type MessageActionsType = {
  actions: MessageActionType[]
  isVisible: boolean
}
export class MessageActions extends React.Component<MessageActionsType> {
  public shouldComponentUpdate(prevProps: MessageActionsType): boolean {
    return !_.isEqual(this.props, prevProps)
  }

  componentDidUpdate(): void {
    LayoutAnimation.configureNext(layoutAnimConfig)
  }

  render(): React.ReactNode {
    const { isVisible, actions } = this.props
    return (
      <ComponentWrapper isVisible={isVisible}>
        <MessageActionsWrapper style={hardShadow}>
          {actions.map((action) => (
            <Button
              key={action.title}
              title={action.title}
              iconName={action.ioniconName}
              onPress={action.onPress}
            />
          ))}
        </MessageActionsWrapper>
      </ComponentWrapper>
    )
  }
}

// MessageActions.whyDidYouRender = {
//   logOnDifferentValues: false,
//   customName: "MessageActions",
//   diffNameColor: "red",
// }
