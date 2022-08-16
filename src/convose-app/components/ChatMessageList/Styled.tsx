/* eslint-disable react/jsx-props-no-spreading */
import * as React from "react"
import { View, TouchableOpacity, Dimensions } from "react-native"
import styled from "styled-components"

import { AVATAR_SIZE, CenteredText, color, Props } from "convose-styles"
import { Avatar, AvatarProps } from "../../components/Avatar"

const { height } = Dimensions.get("screen")

function getHeightPercentage(percentage: number, reduceFromHeight?: number) {
  const reduce = reduceFromHeight || 0
  return ((height - reduce) * percentage) / 100
}

interface CallingScreenProps {
  isInCallingChat: boolean
  callingFullScreenMode: boolean
  keyboardHeight?: number
}

type MessageWrapperProps = {
  isInCallingChat: boolean
}

export const MainChatWrapper = styled(View)`
  justify-content: flex-end;
  height: ${(props: CallingScreenProps) => {
    if (props.callingFullScreenMode) {
      return getHeightPercentage(40)
    }
    if (props.isInCallingChat) {
      return getHeightPercentage(70, props.keyboardHeight || 0)
    }
    return getHeightPercentage(100)
  }};
  width: ${(props: CallingScreenProps) =>
    props.isInCallingChat ? "75%" : "100%"};
  margin-bottom: -55px;
`

export const ChatAvatar = styled((props: AvatarProps) => <Avatar {...props} />)`
  align-self: center;
  height: 32px;
  width: 32px;
`

export const CommonInterests = styled(View)`
  align-content: center;
  justify-content: center;
`

export const CommonInterestsList = styled(View)`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: -5px;
  margin-bottom: -5px;
`

export const MessageWrapper = styled(View)`
  scale-y: -1;
  ${(props: MessageWrapperProps) =>
    props.isInCallingChat && "align-items: flex-start"};
`

export const RetrievingHistoryText = styled(CenteredText)`
  color: ${(props: Props) => props.theme.chatInfo};
  align-content: center;
  font-size: 11px;
  justify-content: center;
  margin-bottom: 10px;
  margin-top: 10px;
  text-align: center;
  font-family: Popins-light;
`
type BlankType = Props & { topInsets: number }
const BLANK_HEIGHT = 80
export const Blank = styled(View)`
  height: ${(props: BlankType) => {
    const topInsets = props.topInsets || 0
    return BLANK_HEIGHT + topInsets
  }}px;
`

export const AvatarContainer = styled(TouchableOpacity)`
  width: ${(props: Props) => (props.size ? props.size : AVATAR_SIZE)};
  height: ${(props: Props) => (props.size ? props.size : AVATAR_SIZE)};
  /* margin-right:20 */
`

export const GroupAvatarWrapper = styled(View)`
  bottom: ${(props: Props) => (props.size ? props.size * 0.5 : AVATAR_SIZE)};
  left: ${(props: Props) => (props.size ? props.size * 0.25 : AVATAR_SIZE)};
`

export const ButtonWrapper = styled(TouchableOpacity)`
  border-radius: 50px;
  text-align: center;
  background: ${(props: Props) => props.theme.mainBlue};
  overflow: visible;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  position: absolute;
  ${(props: Props) =>
    props.top && props.top !== 0
      ? `top: ${props.top}`
      : "bottom: 100px; padding-right: 15px"};
  align-self: center;
`

export const Label = styled(CenteredText)`
  font-family: Popins-medium;
  font-size: 15px;
  text-align: center;
  color: ${color.white};
  include-font-padding: false;
  text-align-vertical: center;
`
export const MessageListFooter = styled.View`
  scale-y: -1;
`
