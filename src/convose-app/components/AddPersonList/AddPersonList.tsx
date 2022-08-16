import * as React from "react"
import { FlatList } from "react-native"
import { connect } from "react-redux"
import { Dispatch } from "redux"

import {
  ChatAction,
  ChatChannel,
  ChatSummary,
  ChatType,
  ChatUser,
  selectCreatingGroupChat,
  selectOpenChatChannel,
} from "convose-lib/chat"
import { State } from "convose-lib/store"
import {
  selectLoadingPartnerFeature,
  selectPartnerHasNextPage,
  selectPartnersFeature,
  UsersListAction,
} from "convose-lib/users-list"
import { color } from "convose-styles"
import { JoinCall, selectJoinCall } from "convose-lib/calling"
import { MaterialIndicator } from "react-native-indicators"
import { PARTNER_LIMIT } from "convose-lib/utils"
import { AddPersonItem } from "../AddPersonItem"
import { ConversationsWrapper, InboxWrapper } from "./Styled"
import { InviteUsersButton } from "../InviteUsersButton"
import { Header } from "../../components/Header"

type LocalState = {
  selection: string[]
  invitableUsers: ChatUser[] | undefined
}

type Props = {
  readonly goBackCallback: () => void
  readonly groupMembers: string[]
  readonly isGroup: boolean
}

type DispatchToProps = {
  readonly createGroupChat: (userIds: string[]) => void
  readonly addToGroupChat: (userIds: string[], chatChannel: ChatChannel) => void
  readonly getPartnersList: (from: number, limit: number) => void
}

type StateToProps = {
  readonly partners: ReadonlyArray<ChatSummary> | null
  readonly loadingPartner: boolean
  readonly creating: boolean
  readonly openChat: ChatChannel | null
  readonly joinCall: JoinCall
  readonly hasNextPage: boolean
}

type AllProps = StateToProps & DispatchToProps & Props

const containerStyle = { paddingBottom: 40, flexGrow: 1 }

export class AddPersonListComponent extends React.Component<
  AllProps,
  LocalState
> {
  constructor(props: AllProps) {
    super(props)
    this.state = {
      selection: [],
      invitableUsers: [],
    }
  }

  componentDidMount(): void {
    const { partners } = this.props
    this.setInvitableUsers(partners)
  }

  componentDidUpdate(newProps: AllProps): void {
    const { partners } = this.props
    if (newProps.partners?.length !== partners?.length) {
      this.setInvitableUsers(newProps.partners)
    }
  }

  private setInvitableUsers = (partners: ReadonlyArray<ChatSummary> | null) => {
    const { groupMembers } = this.props
    const invitableUsers = partners
      ?.filter((cs) => cs.type === ChatType.OneToOne)
      .map((cs) => this.getChatUser(cs))
      .filter((cu) => !groupMembers.includes(cu?.uuid))

    this.setState({ invitableUsers })
  }

  private handleTouch = (userId: string): void => {
    const { selection } = this.state
    if (selection.includes(userId)) {
      this.setState({
        selection: selection.filter((s) => s !== userId),
      })
    } else {
      this.setState({
        selection: [userId, ...selection],
      })
    }
  }

  private readonly getChatUser = (summary: ChatSummary) => {
    const { participants } = summary
    const [receiverIndex] = Object.keys(participants)
    return participants[receiverIndex]
  }

  private readonly handleInvite = () => {
    const {
      creating,
      groupMembers,
      createGroupChat,
      goBackCallback,
      isGroup,
      openChat,
      addToGroupChat,
    } = this.props
    const { selection } = this.state

    if (isGroup && openChat && !!selection.length) {
      addToGroupChat([...selection], openChat)
      goBackCallback()
    } else if (!creating && !!selection.length) {
      const userIds = [...groupMembers, ...selection]
      createGroupChat(userIds)
    }
  }

  private readonly handleOnEndReached = () => {
    const {
      partners,
      getPartnersList,
      loadingPartner,
      hasNextPage,
    } = this.props
    !loadingPartner &&
      hasNextPage &&
      getPartnersList(partners ? partners.length : 0, PARTNER_LIMIT)
  }

  private readonly keyExtract = (item: ChatUser, index: number): string => {
    return item ? item.uuid : index.toString()
  }

  private isSelected(userId: string): boolean {
    const { selection } = this.state
    return selection.includes(userId)
  }

  private renderItem = ({ item }: { readonly item: ChatUser }) => {
    return (
      <AddPersonItem
        user={item}
        handleTouch={this.handleTouch}
        selected={this.isSelected(item ? item.uuid : "")}
      />
    )
  }

  public render(): React.ReactNode {
    const { selection, invitableUsers } = this.state
    const { goBackCallback } = this.props
    const canInvite = !!selection.length

    const { creating, loadingPartner, partners } = this.props
    return (
      <InboxWrapper>
        <Header
          onBackPress={goBackCallback}
          title="Invite to Group"
          textColor={color.dark}
        />
        <ConversationsWrapper>
          <FlatList
            data={invitableUsers}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtract}
            onEndReached={this.handleOnEndReached}
            onEndReachedThreshold={0.01}
            contentContainerStyle={containerStyle}
            ListEmptyComponent={<MaterialIndicator color={color.mainBlue} />}
            ListFooterComponent={
              loadingPartner && partners && partners.length > 0 ? (
                <MaterialIndicator color={color.mainBlue} />
              ) : null
            }
          />
        </ConversationsWrapper>
        {canInvite && (
          <InviteUsersButton
            creating={creating}
            inviteUsers={this.handleInvite}
          />
        )}
      </InboxWrapper>
    )
  }
}
const mapStateToProps = (state: State): StateToProps => ({
  partners: selectPartnersFeature(state),
  creating: selectCreatingGroupChat(state),
  openChat: selectOpenChatChannel(state),
  joinCall: selectJoinCall(state),
  loadingPartner: selectLoadingPartnerFeature(state),
  hasNextPage: selectPartnerHasNextPage(state),
})

const mapDispatchToProps = (
  dispatch: Dispatch<ChatAction | UsersListAction>
): DispatchToProps => ({
  createGroupChat: (userIds: string[]) =>
    dispatch(ChatAction.createGroupChat(userIds)),
  addToGroupChat: (userIds: string[], chatChannel: ChatChannel) =>
    dispatch(ChatAction.addToGroupChat(userIds, chatChannel)),
  getPartnersList: (from: number, limit: number) =>
    dispatch(UsersListAction.getPartnersList(from, limit)),
})

export const AddPersonList = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddPersonListComponent)
