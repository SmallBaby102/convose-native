/* eslint-disable react/destructuring-assignment */
/* eslint-disable react-perf/jsx-no-new-object-as-prop */
/* eslint-disable react-perf/jsx-no-new-array-as-prop */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-nested-ternary */
/* eslint-disable complexity */
import { format } from "date-fns"
import * as React from "react"
import {
  Pressable,
  TouchableWithoutFeedback,
  View,
  Text,
  Linking,
  Animated,
  Easing,
  Vibration,
} from "react-native"
import Autolink from "react-native-autolink"

import {
  CHAT_MESSAGE_TIME_FORMAT,
  Message,
  ChatUser,
  UserStatus,
  AudioMessagePlayer,
  DeleteMessageTypes,
} from "convose-lib/chat"
import { LONG_PRESS_DURATION, MENTION_EVERYONE_ID } from "convose-lib/utils"
import { CenteredText, color } from "convose-styles"
import { Routes } from "convose-lib/router"
import FastImage from "react-native-fast-image"
import { withTheme } from "styled-components"
import { PresenceIndicator } from "../../components"
import { AudioMessage, ImageMessage } from "./Messages"
import {
  GuestMessage,
  GroupMessage,
  ImageWrapper,
  MessageDateImage,
  MessageText,
  MyMessage,
  AvatarContainer,
  Username,
  UserWrapper,
} from "./Styled"
import * as AvatarComponent from "../../components/Avatar"
import {
  isMentionPartType,
  parseValue,
  Part,
} from "../../../../self-maintained-packages/react-native-controlled-mentions"
import * as RootNavigation from "../../RootNavigation"

type ChatMessageState = {
  selectAnimation: Animated.Value
  denyAnimation: Animated.Value
}

type ChatMessageProps = {
  readonly isGroup: boolean
  readonly fromUser?: ChatUser
  readonly sameSender: boolean
  readonly firstMessage: boolean
  readonly lastMessage: boolean
  readonly hasNext: boolean
  readonly isInCallingChat: boolean
  readonly setFullScreenImage: (uri: { uri: string } | undefined) => void
  readonly me: ChatUser
  readonly uri: { uri: string }
  readonly publishing: boolean
}

const autoLinkStyle = {
  flexWrap: "wrap",
  alignItems: "flex-start",
  flexDirection: "row",
}

const mentionStyle = {
  meMentioned: {
    backgroundColor: color.mentionYellow,
    fontWeight: "bold",
  },
  otherMentioned: {
    backgroundColor: color.mentionBlue,
    fontWeight: "bold",
  },
}
type AllProps = Message &
  ChatMessageProps &
  AudioMessagePlayer &
  DeleteMessageTypes

// const ONE_SECOND_IN_MS = 1000

// const PATTERN = [
//   1 * ONE_SECOND_IN_MS,
//   2 * ONE_SECOND_IN_MS,
//   3 * ONE_SECOND_IN_MS,
// ]
class ChatMessageComponent extends React.PureComponent<
  AllProps,
  ChatMessageState
> {
  public readonly state: ChatMessageState = {
    selectAnimation: new Animated.Value(0),
    denyAnimation: new Animated.Value(0),
  }

  public componentDidUpdate(prevProps: AllProps): void {
    const { selectedMessageUUID, uuid } = this.props
    if (prevProps.selectedMessageUUID !== selectedMessageUUID) {
      if (selectedMessageUUID === uuid) {
        this.animateSelectedMessage()
      } else {
        this.animateToNonSelectedMessage()
      }
    }
  }

  public animateSelectedMessage = (): void => {
    Animated.timing(this.state.selectAnimation, {
      toValue: 1,
      duration: 150,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start()
  }

  public animateToNonSelectedMessage = (): void => {
    Animated.timing(this.state.selectAnimation, {
      toValue: 0,
      duration: 150,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start()
  }

  private readonly showProfile = (userId: string | undefined): void => {
    const { me } = this.props
    userId &&
      userId !== me.uuid &&
      userId !== MENTION_EVERYONE_ID &&
      RootNavigation.navigate(Routes.UserProfile, {
        chatUserId: userId,
        myUuid: me.uuid,
      })
  }

  public onLongPressToSelectMessage = (message: Message) => (): void => {
    const { selectMessage } = this.props
    const { publishing, deleted } = message
    if (publishing || deleted) {
      this.shakeMessage()
      return
    }
    selectMessage(message)
  }

  public shakeMessage = (): void => {
    const { denyAnimation } = this.state
    Vibration.vibrate()
    Animated.sequence([
      Animated.timing(denyAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(denyAnimation, {
        toValue: -1,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(denyAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(denyAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
      }),
    ]).start(() => {
      Vibration.cancel()
    })
  }

  // render methods
  public renderMessage(type: string): React.ReactNode {
    const {
      isInCallingChat,
      requestPlay,
      shouldPlay,
      shouldLoad,
      requestStop,
      dismissSelectedMessage,
      selectedMessageUUID,
    } = this.props
    switch (type) {
      case "image":
        return this.renderImage()
      case "audio":
        return (
          <AudioMessage
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...this.props}
            isInCallingChat={isInCallingChat}
            requestPlay={requestPlay}
            shouldPlay={shouldPlay}
            shouldLoad={shouldLoad}
            requestStop={requestStop}
            selectMessage={this.onLongPressToSelectMessage(this.props)}
            dismissSelectedMessage={dismissSelectedMessage}
            selectedMessageUUID={selectedMessageUUID}
          />
        )
      default:
        return this.renderText()
    }
  }

  public renderText(): React.ReactNode {
    const {
      myMessage,
      data,
      isInCallingChat,
      dismissSelectedMessage,
      deleted,
    } = this.props

    const linkStyle = {
      color: isInCallingChat
        ? color.darkGray
        : myMessage
        ? color.white
        : color.mainBlue,
      textDecorationLine: "underline",
    }

    return (
      <>
        <Autolink
          text={data}
          email
          component={View}
          style={autoLinkStyle}
          linkDefault
          stripPrefix={false}
          renderText={(txt) => {
            const { parts } = parseValue(txt, [
              {
                trigger: "@",
              },
            ])
            return (
              <MessageText
                myMessage={myMessage && !isInCallingChat}
                deleted={deleted}
              >
                {parts.map(this.renderTextPart)}
              </MessageText>
            )
          }}
          renderLink={(text, match) => (
            <Pressable
              onPress={() => {
                dismissSelectedMessage()
                Linking.openURL(match.getAnchorHref())
              }}
              onLongPress={this.onLongPressToSelectMessage(this.props)}
              delayLongPress={LONG_PRESS_DURATION}
              // eslint-disable-next-line react/no-children-prop
              children={({ pressed }) => (
                <CenteredText
                  // eslint-disable-next-line react-perf/jsx-no-new-array-as-prop
                  style={[
                    {
                      backgroundColor: pressed ? color.gray : color.transparent,
                    },
                    linkStyle,
                  ]}
                >
                  {text}
                </CenteredText>
              )}
            />
          )}
        />
      </>
    )
  }

  public renderTextPart = (part: Part, index: number): React.ReactNode => {
    const { me } = this.props
    if (!part.partType) {
      return <Text key={index}>{part.text}</Text>
    }

    if (isMentionPartType(part.partType)) {
      return (
        <Text
          key={`${index}-${part.data?.trigger}`}
          style={
            part.data?.id === me.uuid
              ? mentionStyle.meMentioned
              : mentionStyle.otherMentioned
          }
          onPress={() => this.showProfile(part.data?.id)}
        >
          {part.text}
        </Text>
      )
    }

    return <Text key={`${index}-pattern`}>{part.text}</Text>
  }

  public renderImage(): React.ReactNode {
    const {
      myMessage,
      uri,
      setFullScreenImage,
      ratio,
      dismissSelectedMessage,
      isInCallingChat,
    } = this.props
    if (!uri) return null

    return (
      <>
        <ImageWrapper
          myMessage={myMessage}
          onPress={() => {
            dismissSelectedMessage()
            setFullScreenImage(uri)
          }}
          onLongPress={this.onLongPressToSelectMessage(this.props)}
          delayLongPress={LONG_PRESS_DURATION}
        >
          <ImageMessage
            uri={uri}
            ratio={ratio}
            resizeMode={FastImage.resizeMode.contain}
            isInCallingChat={isInCallingChat}
          />
        </ImageWrapper>
      </>
    )
  }

  public renderSenderAvatar(): React.ReactNode {
    const { fromUser, avatar, senderUsername, isInCallingChat } = this.props
    const isOnline = fromUser?.status === UserStatus.Online
    const messageAvatar = avatar || fromUser?.avatar
    const messageName = senderUsername || fromUser?.username
    if (!messageAvatar) {
      return undefined
    }

    return (
      <UserWrapper isInCallingChat={isInCallingChat}>
        <AvatarContainer>
          {isInCallingChat ? (
            <AvatarComponent.Avatar
              height={20}
              width={20}
              userAvatar={messageAvatar}
            />
          ) : (
            <PresenceIndicator isOnline={isOnline}>
              <AvatarComponent.Avatar
                height={30}
                width={30}
                userAvatar={messageAvatar}
              />
            </PresenceIndicator>
          )}
        </AvatarContainer>
        {messageName && (
          <Username
            color={fromUser?.theme_color}
            // color={'#' + Math.floor(Math.random() * 16777215)
            //   .toString(16)
            //   .padStart(6, '0')}
            isInCallingChat={isInCallingChat}
          >
            {messageName}
          </Username>
        )}
      </UserWrapper>
    )
  }

  public readonly renderImageDate = (): React.ReactNode => (
    <MessageDateImage>
      {format(this.props.created_at, CHAT_MESSAGE_TIME_FORMAT)}
    </MessageDateImage>
  )

  public render(): React.ReactNode {
    const {
      myMessage,
      type,
      fromUser,
      isGroup,
      sameSender,
      firstMessage,
      lastMessage,
      hasNext,
      avatar,
      isInCallingChat,
      publishing,
      deleted,
      dismissSelectedMessage,
    } = this.props

    const Component =
      myMessage && !isInCallingChat
        ? MyMessage
        : isGroup
        ? GroupMessage
        : GuestMessage
    const renderAvatar =
      (!myMessage && (fromUser || avatar) && isGroup && !sameSender) ||
      (isInCallingChat && !sameSender)
    const { selectAnimation, denyAnimation } = this.state

    const viewBackground = selectAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ["transparent", "#19AAEB15"],
    })
    const shakeAnimation = denyAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 10],
    })

    return (
      <TouchableWithoutFeedback
        onLongPress={this.onLongPressToSelectMessage(this.props)}
        onPress={dismissSelectedMessage}
        delayLongPress={250}
      >
        <Animated.View
          style={{
            paddingHorizontal: 9,
            backgroundColor: viewBackground,
          }}
        >
          <Animated.View
            style={{
              transform: [{ translateX: shakeAnimation }],
            }}
          >
            {!isInCallingChat && renderAvatar && this.renderSenderAvatar()}
            <Component
              type={type}
              publishing={publishing}
              myMessage={myMessage}
              firstMessage={firstMessage}
              lastMessage={lastMessage}
              hasNext={hasNext}
              isInCallingChat={isInCallingChat}
              deleted={deleted}
            >
              {isInCallingChat && renderAvatar && this.renderSenderAvatar()}
              {this.renderMessage(type)}
            </Component>
          </Animated.View>
        </Animated.View>
      </TouchableWithoutFeedback>
    )
  }
}

// ChatMessageComponent.whyDidYouRender = {
//   logOnDifferentValues: false,
//   customName: "ChatMessageComponent",
//   diffNameColor: "red",
// }
export const ChatMessage = withTheme(ChatMessageComponent)
