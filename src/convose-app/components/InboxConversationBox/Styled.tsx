import { Animated, TouchableOpacity, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import styled from "styled-components"

import { AVATAR_SIZE, CenteredText, color, Props } from "convose-styles"

export const getIconColor = (count: number, notification: boolean): string => {
  if (notification) {
    return color.white
  }

  return count > 0 ? color.black : color.darkGray
}

// const getMessageTextColor = (
//   props: { notification: boolean; newMessage: boolean } & Props
// ) => {
//   if (props.notification) {
//     return "red" // color.darkGray
//   }

//   return props.newMessage
//     ? props.theme.inboxConversationBox.newMessage
//     : color.darkGray
// }

export const InboxContainer = styled(View)`
  align-self: center;
  width: 100%;
  padding: 20px;
  background: ${(props: Props) => props.theme.statusBar};
`

export const NotificationContainer = styled(Animated.View)`
  background: ${(props: Props) => props.theme.notification};
  position: absolute;
  width: 95%;
  z-index: 999;
  align-self: center;
  border-radius: 90;
  padding: 10px;
`

export const TouchableWrapper = styled(TouchableOpacity)`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

export const AvatarContainer = styled(View)`
  /* margin-right: 20; */
  width: ${AVATAR_SIZE};
  height: ${AVATAR_SIZE};
`

export const Body = styled(View)`
  flex: 2;
  flex-direction: column;
  margin-left: 15px;
`

export const Section = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex: 1;
`

export const DateComponent = styled(CenteredText)`
  color: ${(props: Props) => props.theme.timeStamp};
  font-size: 12px;
  font-family: Popins;
  opacity: 0.5;
`

export const Username = styled(CenteredText)`
  color: ${(props: Props) =>
    props.color && props.color !== "SystemDefualt"
      ? props.color
      : props.theme.main.text};
  font-family: Popins-bold;
  font-size: 18px;
`

export const TextMessage = styled(CenteredText)`
  color: ${(props: { notification: boolean; newMessage: boolean } & Props) =>
    props.theme.inboxConversationBox.newMessage};
  font-style: italic;
  font-family: ${(props: { newMessage: boolean }) =>
    props.newMessage ? "Popins-bold" : "Popins"};
  font-size: 16px;
  max-width: 90%;
  flex-shrink: 1;
`
export const StyledIcon = styled(Ionicons)`
  color: ${(props: Props) => props.theme.inboxConversationBox.newMessage};
  margin-right: 5px;
`

export const GroupTextWrapper = styled(View)`
  max-width: 90%;
  flex-direction: row;
`

export const MediaMessageContainer = styled(View)`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`

export const BadgeView = styled(View)`
  justify-content: center;
  align-items: center;
  width: 11;
  padding-bottom: 10px;
`

export const GroupUserName = styled(CenteredText)`
  color: ${(props: Props) =>
    props.color && props.color !== "SystemDefualt"
      ? props.color
      : props.theme.main.text};
  font-family: Popins-bold;
  font-size: 16px;
  margin-right: 9px;
`
