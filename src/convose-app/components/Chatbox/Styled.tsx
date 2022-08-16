/* eslint-disable no-nested-ternary */
import { TouchableOpacity, View } from "react-native"
import styled from "styled-components"

import { ThemeColor } from "convose-lib/user"
import { isTablet } from "convose-lib/utils"
import { CenteredText, chatHeight, color, Props } from "convose-styles"

type ChatboxHeaderProps = {
  readonly themeColor: ThemeColor
  readonly isGroup: boolean
  readonly isGroupCallChat: boolean
  readonly darkMode?: boolean | null
}

type ChatboxVisibleProps = {
  readonly fullHeight?: boolean
  readonly isGroupCallChat: boolean
}

type ChatboxWrapperProps = {
  readonly fullWidth?: boolean
}

export const ChatboxWrapper = styled(TouchableOpacity)`
  border-radius: 33px;
  margin-vertical: 9px;
  width: ${(props: ChatboxWrapperProps) =>
    props.fullWidth ? `100%` : `${isTablet() ? 40 : 90}%`};
  background: ${(props: Props & ChatboxHeaderProps) =>
    props.isGroupCallChat
      ? props.theme.main.chatBoxOnCall
      : props.theme.main.chatBox};
  padding: 8px;
  padding-bottom: ${(props: Props & ChatboxHeaderProps) =>
    !props.isGroupCallChat ? 8 : 15};
`
export const ChatboxMainContent = styled(View)`
  flex: 1;
`

export const ChatboxVisible = styled(View)`
  overflow: hidden;
  ${({ fullHeight, isGroupCallChat }: ChatboxVisibleProps) =>
    isGroupCallChat
      ? `min-height: 235`
      : fullHeight
      ? `min-height: ${chatHeight}`
      : `height: ${chatHeight}`};
  min-width: 100%;
  padding: 8px;
`

export const ChatboxAvatar = styled(View)``

export const ChatboxHeader = styled(View)`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`

export const HeaderTextWrapper = styled(View)`
  flex-direction: column;
  margin-left: 15;
`

export const ChatboxHeaderText = styled(CenteredText)`
  color: ${(props: Props & ChatboxHeaderProps) =>
    props.isGroupCallChat
      ? props.darkMode
        ? color.white
        : color.black
      : props.themeColor || props.theme.mainBlue};
  font-family: Popins-extra-bold;
  font-size: 22px;
  font-weight: 700;
  line-height: 27;
`

export const ChatboxSubheaderText = styled(CenteredText)`
  color: ${(props: Props & ChatboxHeaderProps) =>
    props.isGroup
      ? props.theme.main.text
      : props.themeColor || props.theme.mainBlue};
  font-family: Popins;
  font-size: 20px;
`

export const ChatboxContent = styled(View)`
  padding-top: 10px;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
  width: 100%;
  overflow: hidden;
  max-height: 100%;
  flex-shrink: 2;
`
export const CallProfileWrapper = styled(View)``

export const CallButtonWrapper = styled(TouchableOpacity)`
  width: 100%;
  height: 60;
  border-radius: 99;
  padding-horizontal: 25;
  background-color: ${color.darkGreen};
  justify-content: center;
  align-items: center;
  flex-direction: row;
`

export const JoinCallText = styled(CenteredText)`
  color: white;
  font-size: 20;
  font-family: Popins-bold;
  margin-horizontal: 10;
`

export const InCallUsersNumbertext = styled(CenteredText)`
  color: white;
  font-size: 18;
  font-family: Popins;
`

export const CallProfileRow = styled(View)`
  flex-direction: row;
  justify-content: flex-start;
`
