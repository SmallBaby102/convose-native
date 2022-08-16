/* eslint-disable no-nested-ternary */
/* eslint-disable complexity */
import { isTablet } from "convose-lib/utils"
import { CenteredText, color, Props, width } from "convose-styles"
import { Pressable, View, Animated } from "react-native"
import FastImage from "react-native-fast-image"
import styled from "styled-components"

const messageBorderRadius = 20
const messageBorderRadiusSml = 10
const getImageMaxWidth = (isInCallingChat: boolean) => {
  if (isInCallingChat) {
    return width * 0.8 * 0.82
  }
  return width * 0.8
}
const imageMaxHeight = isTablet() ? 400 : 300

type borderProps = {
  myMessage: boolean
  firstMessage: boolean
  lastMessage: boolean
  hasNext: boolean
  isInCallingChat: boolean
  ratio: number
  deleted: boolean
}

function calculateBorders(props: borderProps): string {
  if (!props.hasNext && props.firstMessage) {
    return `border-radius: ${messageBorderRadius}`
  }
  if (props.firstMessage) {
    return `
        border-top-left-radius: ${messageBorderRadius}px
        border-top-right-radius: ${messageBorderRadius}px
        border-bottom-right-radius: ${
          props.myMessage ? messageBorderRadiusSml : messageBorderRadius
        }px
        border-bottom-left-radius: ${
          props.isInCallingChat
            ? 0
            : props.myMessage
            ? messageBorderRadius
            : messageBorderRadiusSml
        }px
      `
  }
  if (props.lastMessage) {
    return `
        border-top-left-radius: ${
          props.isInCallingChat
            ? 0
            : props.myMessage
            ? messageBorderRadius
            : messageBorderRadiusSml
        }px
        border-top-right-radius: ${
          props.myMessage ? messageBorderRadiusSml : messageBorderRadius
        }px
        border-bottom-right-radius: ${messageBorderRadius}px
        border-bottom-left-radius: ${messageBorderRadius}px
      `
  }
  return `
        border-top-left-radius: ${
          props.isInCallingChat
            ? 0
            : props.myMessage
            ? messageBorderRadius
            : messageBorderRadiusSml
        }px
        border-top-right-radius: ${
          props.myMessage ? messageBorderRadiusSml : messageBorderRadius
        }px
        border-bottom-right-radius: ${
          props.myMessage ? messageBorderRadiusSml : messageBorderRadius
        }px
        border-bottom-left-radius: ${
          props.isInCallingChat
            ? 0
            : props.myMessage
            ? messageBorderRadius
            : messageBorderRadiusSml
        }px
      `
}
type ImageProps = borderProps & { isInCallingChat: boolean }

function calculateImageSize(props: ImageProps): string {
  const imageMaxWidth = getImageMaxWidth(props.isInCallingChat)
  if (!props.ratio) {
    return `
    width: ${imageMaxWidth}px
    height: ${imageMaxHeight}px
    `
  }
  const imageHeight =
    props.ratio * imageMaxWidth > imageMaxHeight
      ? imageMaxHeight
      : props.ratio * imageMaxWidth
  const imageWidth =
    props.ratio * imageMaxWidth > imageMaxHeight
      ? imageMaxHeight / props.ratio
      : imageMaxWidth
  return `
    width: ${imageWidth}px
    height: ${imageHeight}px
    `
}

export const MessageDate = styled(CenteredText)`
  color: ${(props: borderProps & Props) =>
    props.myMessage ? color.white : props.theme.main.text};
  bottom: 5px;
  font-size: 10px;
  position: absolute;
  right: 15px;
  font-family: Popins;
`
export const MessageDateImage = styled(CenteredText)`
  color: ${(props: borderProps & Props) =>
    props.myMessage ? color.white : props.theme.main.text};
  font-size: 10px;
  margin-bottom: 5px;
  text-align: center;
  font-family: Popins;
`

export const MessageText = styled(CenteredText)`
  font-size: 14px;
  padding-horizontal: 4px;
  color: ${(props: borderProps & Props) => {
    if (props.deleted) {
      return props.theme.message.deletedText
    }
    if (props.myMessage) {
      return color.white
    }
    return props.theme.main.text
  }};
  font-family: Popins;
`

export const GuestMessage = styled(View)`
  align-self: flex-start;
  background: ${(props: { type: string } & borderProps & Props) => {
    if (props.deleted) {
      return "transparent"
    }
    if (props.isInCallingChat) {
      return props.theme.textInput.background
    }
    if (props.type !== "image") {
      return props.theme.textInput.background
    }
    return "transparent"
  }};
  ${(props: borderProps) => calculateBorders(props)};
  ${(props: borderProps & Props) => {
    if (props.deleted) {
      return `border-width: 1px;
      border-color: ${props.theme.message.deletedTextBorder};`
    }
    return ``
  }};
  margin-bottom: 2px;
  ${(props: borderProps) => !props.isInCallingChat && `max-width: 90%`};
  /* padding: ${(props: { type: string }) =>
    props.type === "text" || props.type === "audio" ? "9px" : "5px"}; */
  padding: 9px;
  opacity: ${(props: { publishing: boolean }) => (props.publishing ? 0.3 : 1)};
`

export const GroupMessage = styled(GuestMessage)`
  margin-left: ${(props: borderProps) => (props.isInCallingChat ? 0 : 35)};
  margin-top: ${(props: borderProps) =>
    props.isInCallingChat && props.firstMessage ? 10 : 0};
`

export const MyMessage = styled(GuestMessage)`
  align-self: flex-end;
  background: ${(props: { type: string } & Props & borderProps) => {
    if (props.deleted) {
      return "transparent"
    }
    if (props.type !== "image") {
      return props.theme.mainBlue
    }
    return "transparent"
  }};
  ${(props: borderProps) => calculateBorders(props)};
`
export const StyledImage = styled(FastImage)`
  ${(props: ImageProps) => calculateImageSize(props)};
  resize-mode: contain;
`
export const StyledImageContainer = styled(Animated.View)`
  ${(props: ImageProps) => calculateImageSize(props)};
`
export const MentionText = styled(CenteredText)`
  color: ${(props: Props) =>
    props.color ? props.color : props.theme.main.text};
  ${(props: Props) => props.color && `background: ${props.color}80`};
`

export const ImageWrapper = styled(Pressable)`
  ${(props: borderProps) => calculateBorders(props)};
  overflow: hidden;
`
export const AvatarContainer = styled(View)`
  width: 32px;
  height: 36px;
  margin-bottom: -15px;
`
export const UserWrapper = styled(View)`
  flex-direction: row;
  justify-content: flex-start;
  padding-top: ${(props: borderProps) => (props.isInCallingChat ? 0 : 5)};
`

export const Username = styled(CenteredText)`
  color: ${(props: Props) => (props.color ? props.color : color.darkGray)};
  font-family: Popins-bold;
  font-size: 13px;
  ${(props: borderProps) => props.isInCallingChat && "left: -5"};
  padding-left: ${(props: borderProps) => (props.isInCallingChat ? 0 : 5)};
  padding-top: ${(props: borderProps) => (props.isInCallingChat ? 0 : 5)};
`
export const Null = styled.View`
  width: 20px;
  height: 20px;
  background-color: red;
`
export const NullUsername = styled.View`
  width: 30px;
  height: 15px;
  background-color: green;
`
export const NullAudio = styled.View`
  width: 60px;
  height: 40px;
  background-color: yellow;
  margin-horizontal: 14px;
`
