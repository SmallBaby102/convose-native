import * as React from "react"
import { ScrollView, TouchableOpacity } from "react-native"
import { connect } from "react-redux"

import { ChatUser, UserStatus } from "convose-lib/chat"
import { State } from "convose-lib/store"
import { selectUserFeature } from "convose-lib/users-list"
import { StackScreenProps } from "@react-navigation/stack"
import { Routes } from "convose-lib/router"
import { defaultShadows, color, AVATAR_SIZE } from "convose-styles"
import { selectMyUuid } from "convose-lib/user"
import { MainStackParamList } from "../../router"
import {
  ScrollViewWrapper,
  CloseButtonWrapper,
  CloseButtonIconWrapper,
} from "./Styled"
import CloseProfileIcon from "../../../assets/Icons/components/CloseProfileIcon"
import { Chatbox } from "../../components/Chatbox"

type NavProps = StackScreenProps<MainStackParamList, Routes.UserProfile>

type UserProfileToProps = {
  readonly chatUser: ChatUser | null
  readonly myUuid: string
}
const scrollViewStyle = { backgroundColor: color.black_transparent_light }
export class UserProfileScreenComponent extends React.Component<
  NavProps & UserProfileToProps
> {
  private readonly goBack = () => {
    const { navigation } = this.props
    navigation.goBack()
  }

  public render(): React.ReactNode {
    const { chatUser, myUuid, route } = this.props

    const userProfile = chatUser || route.params.chatUser
    if (!userProfile) {
      this.goBack()
      return null
    }

    return (
      <>
        <ScrollView style={scrollViewStyle}>
          <ScrollViewWrapper>
            <CloseButtonWrapper>
              <TouchableOpacity onPress={this.goBack}>
                <CloseButtonIconWrapper style={defaultShadows}>
                  <CloseProfileIcon
                    width={`${AVATAR_SIZE}px`}
                    height={`${AVATAR_SIZE}px`}
                  />
                </CloseButtonIconWrapper>
              </TouchableOpacity>
            </CloseButtonWrapper>

            <Chatbox
              myUuid={myUuid}
              user={userProfile}
              userIsOnline={userProfile.status === UserStatus.Online}
              fullHeight
              fullWidth
            />
          </ScrollViewWrapper>
        </ScrollView>
      </>
    )
  }
}

const mapStateToProps = (
  state: State,
  ownProps: UserProfileToProps & NavProps
): UserProfileToProps => ({
  chatUser: selectUserFeature(ownProps.route.params.chatUserId)(state),
  myUuid: selectMyUuid(state),
})

export const UserProfileScreen = connect(
  mapStateToProps,
  null
)(UserProfileScreenComponent)
