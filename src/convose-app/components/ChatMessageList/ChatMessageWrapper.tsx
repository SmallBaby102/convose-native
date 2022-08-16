/* eslint-disable no-nested-ternary */
import React, { Component } from "react"
import { TouchableWithoutFeedback } from "react-native"
import {
  ChatUser,
  Message,
  MessageToPublish,
  setCallStatusMessage,
  AudioMessagePlayer,
  DeleteMessageTypes,
} from "convose-lib/chat"
import { CallStatusMessage, ChatInfo, ChatMessage } from ".."
import { MessageWrapper } from "./Styled"

type ChatMessageWrapperProps = {
  message: Message | MessageToPublish
  isInCallingChat: boolean | undefined
  chatInfoText: string | null
  chatTimeText: string | null
  isSystemMessage: boolean
  isCallStatusMessage: boolean
  isFirstMessage: boolean
  isLastMessage: boolean
  hasNextMessage: boolean
  isSameSenderWithUpMsg: boolean
  isGroup: boolean
  me: ChatUser
  participants: ChatUser[]
  readonly deleteMessage: (message: Message) => void
  readonly setFullScreenImage: (uri: { uri: string } | undefined) => void
}
type AllProps = ChatMessageWrapperProps &
  AudioMessagePlayer &
  DeleteMessageTypes
export class ChatMessageWrapper extends Component<AllProps> {
  // eslint-disable-next-line react/destructuring-assignment
  private uri = { uri: this.props.message.data }

  // eslint-disable-next-line complexity
  shouldComponentUpdate(nextProps: AllProps): boolean {
    const {
      isInCallingChat,
      isFirstMessage,
      isLastMessage,
      hasNextMessage,
      isSameSenderWithUpMsg,
      message,
      shouldPlay,
      shouldLoad,
      selectedMessageUUID,
    } = this.props
    const { data } = message
    const { data: oldData } = nextProps.message
    return (
      isInCallingChat !== nextProps.isInCallingChat ||
      isFirstMessage !== nextProps.isFirstMessage ||
      isLastMessage !== nextProps.isLastMessage ||
      hasNextMessage !== nextProps.hasNextMessage ||
      isSameSenderWithUpMsg !== nextProps.isSameSenderWithUpMsg ||
      (!!message.publishing && !nextProps.message.publishing) ||
      shouldPlay !== nextProps.shouldPlay ||
      shouldLoad !== nextProps.shouldLoad ||
      selectedMessageUUID !== nextProps.selectedMessageUUID ||
      data !== oldData
    )
  }

  render(): React.ReactNode {
    const {
      message,
      isInCallingChat,
      chatInfoText,
      chatTimeText,
      isSystemMessage,
      isCallStatusMessage,
      isFirstMessage,
      isLastMessage,
      hasNextMessage,
      isSameSenderWithUpMsg,
      isGroup,
      me,
      participants,
      setFullScreenImage,
      requestPlay,
      shouldPlay,
      shouldLoad,
      requestStop,
      selectMessage,
      dismissSelectedMessage,
      selectedMessageUUID,
    } = this.props

    const sender =
      message.sender === me.uuid
        ? me
        : participants.find((p) => p.uuid === message.sender)

    const callStatusMessage = setCallStatusMessage(
      message.data,
      message.senderUsername,
      isGroup,
      message.sender === me.uuid
    )

    return (
      <TouchableWithoutFeedback onPress={dismissSelectedMessage}>
        <MessageWrapper isInCallingChat={isInCallingChat}>
          {chatInfoText && (
            <ChatInfo
              text={chatInfoText}
              withBorder={false}
              withBgColor={isInCallingChat}
            />
          )}
          {!chatInfoText && chatTimeText && (
            <ChatInfo
              text={chatTimeText}
              withBorder={false}
              withBgColor={isInCallingChat}
            />
          )}
          {isSystemMessage ? (
            <ChatInfo
              text={message.data}
              withBorder={false}
              withBgColor={isInCallingChat}
            />
          ) : isCallStatusMessage ? (
            callStatusMessage && (
              <CallStatusMessage
                message={callStatusMessage}
                withBgColor={isInCallingChat}
              />
            )
          ) : (
            <ChatMessage
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...message}
              isGroup={isGroup}
              fromUser={sender}
              sameSender={isSameSenderWithUpMsg}
              firstMessage={isFirstMessage}
              lastMessage={isLastMessage}
              hasNext={hasNextMessage}
              isInCallingChat={!!isInCallingChat}
              setFullScreenImage={setFullScreenImage}
              me={me}
              uri={this.uri}
              requestPlay={requestPlay}
              shouldPlay={shouldPlay}
              shouldLoad={shouldLoad}
              requestStop={requestStop}
              dismissSelectedMessage={dismissSelectedMessage}
              selectMessage={selectMessage}
              selectedMessageUUID={selectedMessageUUID}
            />
          )}
        </MessageWrapper>
      </TouchableWithoutFeedback>
    )
  }
}
// ChatMessageWrapper.whyDidYouRender = {
//   logOnDifferentValues: false,
//   customName: "ChatMessageWrapper",
//   diffNameColor: "red",
// }
export default ChatMessageWrapper
