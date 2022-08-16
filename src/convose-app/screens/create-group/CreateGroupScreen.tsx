/* eslint-disable react/destructuring-assignment */
import * as React from "react"
import { StackScreenProps } from "@react-navigation/stack"
import { isTablet } from "convose-lib/utils"
import { shadowStyles } from "convose-styles"
import { Routes } from "convose-lib/router"
import { AddPersonList } from "../../components/AddPersonList"
import { ModalWrapper } from "../../components/ModalWrapper"
import { GroupListTabletView } from "./Styled"
import { MainStackParamList } from "../../../convose-app/router"

type NavProps = StackScreenProps<MainStackParamList, Routes.CreateGroup>

export class CreateGroupScreenComponent extends React.Component<NavProps> {
  private members: string[] = this.props.route.params.members

  private isGroup: boolean = this.props.route.params.isGroup || false

  private readonly goBack = () => {
    const { navigation } = this.props
    navigation.goBack()
  }

  public render(): React.ReactNode {
    const addPersonList = (
      <AddPersonList
        goBackCallback={this.goBack}
        groupMembers={this.members}
        isGroup={this.isGroup}
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
          <GroupListTabletView style={shadow}>
            {addPersonList}
          </GroupListTabletView>
        </ModalWrapper>
      )
    }

    return addPersonList
  }
}

export const CreateGroupScreen = CreateGroupScreenComponent
