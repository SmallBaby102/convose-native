/* eslint-disable react/style-prop-object */
/* eslint-disable react/destructuring-assignment */
import * as React from "react"

import { DEFAULT_HIT_SLOP } from "convose-lib/utils"
import { color } from "convose-styles"
import { Ionicons } from "@expo/vector-icons"
import { Platform, TextStyle, ViewStyle } from "react-native"
import {
  AppHeader,
  AppHeaderContent,
  HeaderText,
  Subtext,
  TextWrapper,
  ButtonWrapper,
  CallText,
  AppHeaderContentWrapper,
  AvatarContainer,
} from "./Styled"
import { IconButton } from "../../components/IconButton"
import ReturnToCall from "../ReturnToCall/ReturnToCall"
import { StatusBarBackground } from "../../screens/chatbox-list/Styled"
import JoinCallBar from "../ReturnToCall/JoinCallBar"

export type HeaderProps = {
  readonly avatar?: React.ReactNode
  readonly backgroundColor?: string
  readonly textColor?: string
  readonly onBackPress: () => void
  readonly onTitlePress?: () => void
  readonly subheader?: string
  readonly title: string
  readonly onMenuPress?: () => void
  readonly height?: number
  readonly paddingTop?: number
  readonly sticky?: boolean
  readonly hasMenu?: boolean
  readonly startCall?: () => void
  readonly rejoinCall?: () => void
  readonly canRejoinCall?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly isInCallingChat?: boolean
  readonly chatChannel?: string | undefined
  readonly headerTextStyle?: TextStyle
  readonly headerStyle?: ViewStyle
}

const ICONS_SIZE = 30
const style = { right: 2 }

const BackButton = (onPress: () => void): React.ReactNode => (
  <IconButton
    name="ios-chevron-back"
    iconColor={color.mainBlue}
    size={ICONS_SIZE}
    onPress={onPress}
  />
)
const JoinCallingButton = (
  startCall: () => void,
  rejoinCall: () => void,
  isJoinCall?: boolean
): React.ReactNode => {
  const callFunction = isJoinCall ? rejoinCall : startCall
  return (
    <IconButton
      name="ios-call"
      iconColor={color.mainBlue}
      size={22}
      onPress={callFunction}
    />
  )
}

const MenuButton = (onPress?: () => void): React.ReactNode => (
  <IconButton
    name="ios-ellipsis-vertical"
    iconColor={color.mainBlue}
    size={22}
    onPress={onPress}
  />
)
class HeaderComponent extends React.PureComponent<HeaderProps> {
  // eslint-disable-next-line complexity
  public render(): React.ReactNode {
    const {
      avatar,
      onBackPress,
      onTitlePress,
      subheader = "",
      textColor,
      title,
      onMenuPress,
      backgroundColor,
      height,
      paddingTop,
      sticky,
      hasMenu,
      startCall,
      rejoinCall,
      canRejoinCall,
      isInCallingChat,
      chatChannel,
      headerTextStyle,
      headerStyle,
    } = this.props

    return (
      <AppHeader
        color={backgroundColor}
        height={height}
        sticky={sticky || false}
        style={headerStyle}
      >
        {Platform.OS !== "ios" && (
          <StatusBarBackground bgColor={backgroundColor} />
        )}
        {!isInCallingChat && <ReturnToCall />}
        <AppHeaderContentWrapper paddingTop={paddingTop}>
          {BackButton(onBackPress)}
          <AppHeaderContent withAvatar={Boolean(avatar)}>
            {Boolean(avatar) && <AvatarContainer>{avatar}</AvatarContainer>}
            <TextWrapper
              withAvatar={Boolean(avatar)}
              hitSlop={DEFAULT_HIT_SLOP}
              onPress={onTitlePress}
              maxFontSizeMultiplier={1}
            >
              <HeaderText
                color={textColor}
                withAvatar={Boolean(avatar)}
                maxFontSizeMultiplier={1}
                style={headerTextStyle}
              >
                {title}
              </HeaderText>
              {subheader !== "" && (
                <Subtext maxFontSizeMultiplier={1}>{subheader}</Subtext>
              )}
            </TextWrapper>
          </AppHeaderContent>
          {Boolean(avatar) && hasMenu && !!startCall && !!rejoinCall && (
            <>
              {JoinCallingButton(startCall, rejoinCall, canRejoinCall)}
              {MenuButton(onMenuPress)}
            </>
          )}
        </AppHeaderContentWrapper>
        {canRejoinCall && !!rejoinCall && (
          <JoinCallBar rejoinCall={rejoinCall} chatChannel={chatChannel} />
        )}
      </AppHeader>
    )
  }
}

export const RejoinCallingButton = (
  rejoinCall: () => void,
  pressColor?: string
): React.ReactNode => (
  <ButtonWrapper
    onPress={rejoinCall}
    underlayColor={pressColor || color.ButtonOnPress}
    color={color.darkGreen}
    width={70}
    height={30}
  >
    <>
      <Ionicons name="ios-call" size={16} color="white" style={style} />
      <CallText>Join</CallText>
    </>
  </ButtonWrapper>
)
// HeaderComponent.whyDidYouRender = {
//   logOnDifferentValues: false,
//   customName: "HeaderComponent",
//   diffNameColor: "red",
// }
export const Header = HeaderComponent
