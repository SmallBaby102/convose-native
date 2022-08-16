import * as React from "react"
import { StackScreenProps } from "@react-navigation/stack"
import { isTablet } from "convose-lib/utils"
import { shadowStyles } from "convose-styles"
import { Routes } from "convose-lib/router"
import { UserList } from "../../components/UserList"
import { ModalWrapper } from "../../components/ModalWrapper"
import { UserListTabletView } from "./Styled"
import { MainStackParamList } from "./convose-app/router"

type NavProps = StackScreenProps<MainStackParamList, Routes.UserList>

export class UserListScreenComponent extends React.Component<NavProps> {
  private readonly goBack = () => {
    const { navigation } = this.props
    navigation.goBack()
  }

  public render(): React.ReactNode {
    const { route } = this.props
    const userList = (
      <UserList
        goBackCallback={this.goBack}
        chatChannel={route.params.chatChannel}
        firstTwoParticipants={route.params.firstTwoParticipants}
        myUuid={route.params.myUuid}
        position={route.name}
      />
    )

    if (isTablet()) {
      const shadow = shadowStyles({
        borderRadius: 2,
        borderTop: false,
        borderWidth: 0,
        elevation: 5,
        opacity: 0.1,
      })

      return (
        <ModalWrapper onPress={this.goBack}>
          <UserListTabletView style={shadow}>{userList}</UserListTabletView>
        </ModalWrapper>
      )
    }

    return userList
  }
}

export const UserListScreen = UserListScreenComponent
