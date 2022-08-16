/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-var-requires */
import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useState,
} from "react"
import { Alert } from "react-native"
import { connect } from "react-redux"
import {
  ChatAction,
  ChatSummary,
  ChatUser,
  checkIsGroup,
  selectShowPushNotifications,
  UserStatus,
} from "convose-lib/chat"
import {
  selectChatSummary,
  selectParticipantsArray,
  selectUserFeature,
  UsersListAction,
} from "convose-lib/users-list"
import { Dispatch } from "redux"
import { State } from "convose-lib/store"
import { color } from "convose-styles"
import { ThemeContext } from "styled-components"
import { Routes } from "convose-lib/router"
import { DrawerNavigationState } from "@react-navigation/native"
import { DrawerNavigationHelpers } from "@react-navigation/drawer/lib/typescript/src/types"
import { convoseAlertRef } from "../../RootConvoseAlert"
import SwitchWithIcons from "../../../../self-maintained-packages/react-native-switch-with-icons"
import * as RootNavigation from "../../RootNavigation"
import BlockIcon from "../../../assets/Icons/components/BlockIcon"
import LeaveGroupIcon from "../../../assets/Icons/components/LeaveGroupIcon"
import AddGroupBlueIcon from "../../../assets/Icons/components/AddGroupBlueIcon"
import { UserList } from "../../components/UserList"
import { ChatMenuHeaderWrapper, ChatMenuScreenWrapper } from "./Styled"
import {
  Avatar,
  ChatboxAvatar,
  ChatboxHeader,
  ChatboxHeaderText,
  Item,
  MenuButtons,
  PresenceIndicator,
  renderGroupAvatar,
  UsernameInput,
} from "../../components"
import { ChatScreenDrawerParamaList } from "../../router"

const PnOnIcon = require("../../../assets/Icons/pnOn.png")
const PnOffIcon = require("../../../assets/Icons/pnOff.png")

type StateToPropsType = {
  readonly chatSummary: ChatSummary | null
  readonly participants: ChatUser[]
  readonly chatUser: ChatUser | null
  readonly showPushNotifications: boolean
}

type ChatMenuScreenProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state: DrawerNavigationState<ChatScreenDrawerParamaList>
  navigation: DrawerNavigationHelpers
}

type DispatchToPropsType = {
  readonly blockUser: (user: ChatUser) => void
  readonly leaveGroup: (ChatChannel: string) => void
  readonly toggleLocalPNSettings: () => void
  readonly updateGroupName: (groupname: string, chatChannel: string) => void
}

type allProps = StateToPropsType & ChatMenuScreenProps & DispatchToPropsType

const icons = {
  true: PnOnIcon,
  false: PnOffIcon,
}

const trackColor = {
  true: color.blue_transparent,
  false: color.gray,
}

const iconColor = {
  true: color.white,
  false: color.white,
}

const pnSwitchButtonStyle = { height: 20, width: 40 }
const createGroupAction = (
  chatSummary: ChatSummary | null,
  participants: ChatUser[],
  isGroup: boolean
) => {
  const newParticipants = isGroup
    ? participants
    : chatSummary && [Object.values(chatSummary?.participants)[0]]
  if (chatSummary && newParticipants) {
    const members = newParticipants.map((u) => u.uuid)
    if (members.length > 0) {
      RootNavigation.navigate(Routes.CreateGroup, { members, isGroup })
    }
  } else if (isGroup) {
    convoseAlertRef?.show({
      ioniconName: "ios-warning",
      description: "Loading group members, please try again later",
    })
  } else {
    convoseAlertRef?.show({
      ioniconName: "ios-warning",
      description:
        "Write a message to this person before starting a group chat with them",
    })
  }
}

const PnSwitchButton = ({
  showPushNotifications,
  thumbColor,
  togglePushNotificationsSetting,
}: {
  showPushNotifications: boolean
  thumbColor: { true: string; false: string }
  togglePushNotificationsSetting: () => void
}): React.ReactNode => (
  <SwitchWithIcons
    value={showPushNotifications}
    icon={icons}
    thumbColor={thumbColor}
    trackColor={trackColor}
    iconColor={iconColor}
    onValueChange={togglePushNotificationsSetting}
    style={pnSwitchButtonStyle}
    animationDuration={0}
  />
)

const menuItemsOneToOne = (
  createGroup: () => void,
  togglePushNotificationsSetting: () => void,
  confirmToBlockUser: () => void,
  showPushNotifications: boolean,
  thumbColor: { true: string; false: string }
): ReadonlyArray<Item> => [
  {
    label: "Create group",
    icon: <AddGroupBlueIcon />,
    onPress: createGroup,
  },
  {
    label: "Push notifications",
    icon: PnSwitchButton({
      showPushNotifications,
      thumbColor,
      togglePushNotificationsSetting,
    }),
    onPress: togglePushNotificationsSetting,
  },
  {
    label: "Block & report",
    icon: <BlockIcon />,
    onPress: confirmToBlockUser,
  },
]

const menuItemsGroup = (
  createGroup: () => void,
  togglePushNotificationsSetting: () => void,
  confirmToLeaveGroup: () => void,
  showPushNotifications: boolean,
  thumbColor: { true: string; false: string }
): ReadonlyArray<Item> => [
  { label: "Invite", icon: <AddGroupBlueIcon />, onPress: createGroup },
  {
    label: "Push notifications",
    icon: PnSwitchButton({
      showPushNotifications,
      thumbColor,
      togglePushNotificationsSetting,
    }),
    onPress: togglePushNotificationsSetting,
  },
  {
    label: "Leave group",
    icon: <LeaveGroupIcon />,
    onPress: confirmToLeaveGroup,
  },
]

export const ChatMenuScreenComponent: FunctionComponent<allProps> = ({
  chatSummary,
  chatUser,
  participants,
  navigation,
  state,
  blockUser,
  leaveGroup,
  showPushNotifications,
  toggleLocalPNSettings,
  updateGroupName,
}) => {
  const { channel } = state.routes[0].params
  const isGroup = checkIsGroup(chatSummary, channel)

  const derivedChatUser =
    chatUser || chatSummary?.participants[0] || participants[0]
  const themeColor = isGroup ? color.black : derivedChatUser?.theme_color

  const [username, setUsername] = useState(
    isGroup && chatSummary ? chatSummary.group_name : derivedChatUser?.username
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const theme: any = useContext(ThemeContext)
  const thumbColor = { true: theme.mainBlue, false: color.bittersweet }

  const changeUsername = useCallback(() => {
    updateGroupName(username || "Group", channel)
  }, [channel, updateGroupName, username])

  const cancel = (): void => navigation.goBack()
  const confirmToBlockUser = () => {
    convoseAlertRef?.show({
      ioniconName: "ios-warning",
      title: `Block ${username}`,
      description: `You won't receive messages from ${username} that may have been sent during the block.`,
      buttons: [
        {
          onPress: () => {
            derivedChatUser && blockUser(derivedChatUser)
            navigation.closeDrawer()
            navigation.goBack()
          },
          title: "Block",
        },
        { onPress: cancel, title: "Cancel", type: "cancel" },
      ],
    })
  }

  const confirmToLeaveGroup = () => {
    convoseAlertRef?.show({
      ioniconName: "ios-exit",
      title: `Leave group?`,
      description: `You won't receive messages from the group after you leave.`,
      buttons: [
        {
          onPress: () => {
            leaveGroup(channel)
          },
          title: "Leave",
        },
        { onPress: cancel, title: "Cancel", type: "cancel" },
      ],
    })
  }

  const createGroup = () =>
    createGroupAction(chatSummary, participants, isGroup)

  const renderChatAvatar = (): React.ReactNode => (
    <ChatboxAvatar>
      <PresenceIndicator
        isOnline={derivedChatUser?.status === UserStatus.Online}
      >
        <Avatar userAvatar={derivedChatUser?.avatar} />
      </PresenceIndicator>
    </ChatboxAvatar>
  )

  const firstTwoParticipants = chatSummary
    ? Object.values(chatSummary.participants)
    : []

  return (
    <ChatMenuScreenWrapper>
      <ChatMenuHeaderWrapper>
        <ChatboxHeader>
          {isGroup
            ? renderGroupAvatar(firstTwoParticipants, 60)
            : renderChatAvatar()}
          {isGroup ? (
            <UsernameInput
              value={username}
              onChangeText={setUsername}
              onBlur={changeUsername}
              onSubmitEditing={changeUsername}
              color={theme.main.text}
            />
          ) : (
            <ChatboxHeaderText
              ellipsizeMode="tail"
              themeColor={themeColor}
              isGroup={isGroup}
            >
              {username}
            </ChatboxHeaderText>
          )}
        </ChatboxHeader>
      </ChatMenuHeaderWrapper>
      <MenuButtons
        items={
          isGroup
            ? menuItemsGroup(
                createGroup,
                toggleLocalPNSettings,
                confirmToLeaveGroup,
                showPushNotifications,
                thumbColor
              )
            : menuItemsOneToOne(
                createGroup,
                toggleLocalPNSettings,
                confirmToBlockUser,
                showPushNotifications,
                thumbColor
              )
        }
      />
      {isGroup && (
        <UserList
          chatChannel={state.routes[0].params.channel}
          firstTwoParticipants={firstTwoParticipants}
          position={state.routes[0].name}
        />
      )}
    </ChatMenuScreenWrapper>
  )
}

const mapStateToProps = (
  state: State,
  ownProps: ChatMenuScreenProps
): StateToPropsType => ({
  showPushNotifications: selectShowPushNotifications(state),
  chatSummary: selectChatSummary(ownProps.state.routes[0].params.channel)(
    state
  ),
  participants: selectParticipantsArray(
    ownProps.state.routes[0].params.channel
  )(state),
  chatUser: ownProps.state.routes[0].params.chatUser.avatar
    ? ownProps.state.routes[0].params.chatUser
    : selectUserFeature(ownProps.state.routes[0].params.chatUser?.uuid || "")(
        state
      ) || null,
})
const mapDispatchToProps = (dispatch: Dispatch): DispatchToPropsType => ({
  blockUser: (user: ChatUser) => dispatch(UsersListAction.blockUser(user)),
  leaveGroup: (chatChannel: string) =>
    dispatch(ChatAction.leaveGroup(chatChannel)),
  toggleLocalPNSettings: () => dispatch(ChatAction.toggleLocalPNSettings()),
  updateGroupName: (groupname: string, chatChannel: string) =>
    dispatch(ChatAction.updateGroupName(groupname, chatChannel)),
})

export const ChatMenuScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatMenuScreenComponent)
