/* eslint-disable @typescript-eslint/no-shadow */
import * as React from "react"
import { connect } from "react-redux"
import { ChatChannel, ChatUser } from "convose-lib/chat"
import { State } from "convose-lib/store"
import {
  selectParticipantsArray,
  selectLoadingParticipantsFeature,
  selectParticipantsHasNextPage,
} from "convose-lib/users-list"
import { color } from "convose-styles"
import { Routes } from "convose-lib/router"
import { JoinCall, selectJoinCall } from "convose-lib/calling"
import { MaterialIndicator } from "react-native-indicators"
import { withTheme } from "styled-components"
import { DEFAULT_DEBOUNCE_TIME, PARTICIPANT_LIMIT } from "convose-lib/utils"
import { Dispatch } from "redux"
import { debounceTime, filter } from "rxjs/operators"
import { BehaviorSubject, Subscription } from "rxjs"
import { selectToken } from "convose-lib/user"
import { AddPersonItem } from "../AddPersonItem"
import {
  ConversationsWrapper,
  InboxWrapper,
  StyledFlatlist,
  StyledSearchUserInput,
} from "./Styled"
import { renderGroupAvatar } from "../ChatMessageList"
import { Header } from "../../components/Header"
import * as RootNavigation from "../../RootNavigation"
import {
  UsersListAction,
  searchParticipants,
} from "../../../convose-lib/users-list"

type LocalState = {
  selection: string[]
  searchResults: ChatUser[]
  keyword: string
}

type Props = {
  readonly goBackCallback?: () => void
  readonly chatChannel: string
  readonly myUuid?: string
  readonly position: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly theme: any
  readonly firstTwoParticipants: ChatUser[]
}

type StateToProps = {
  readonly joinCall?: JoinCall
  readonly participants: ChatUser[]
  readonly hasNextPage: boolean
  readonly loadingParticipants: boolean
  readonly token: string
}

type DispatchToProps = {
  readonly getParticipants: (
    chatChannel: ChatChannel,
    from: number,
    limit: number
  ) => void
  resetParticipants: (chatChannel: ChatChannel) => void
}

type AllProps = Props & StateToProps & DispatchToProps

export class UserListComponent extends React.Component<AllProps, LocalState> {
  state: LocalState = {
    selection: [],
    searchResults: [],
    keyword: "",
  }

  private readonly phrase$: BehaviorSubject<string> = new BehaviorSubject("")

  // eslint-disable-next-line react/sort-comp
  private onSearch = async (text: string) => {
    const { chatChannel, token } = this.props
    const searchResults = await searchParticipants(
      token,
      chatChannel,
      text
    ).toPromise()
    text && this.setState({ searchResults })
  }

  private readonly phraseSub: Subscription = this.phrase$
    .pipe(debounceTime(DEFAULT_DEBOUNCE_TIME), filter(Boolean))
    .subscribe(this.onSearch)

  constructor(props: AllProps) {
    super(props)
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const { resetParticipants, chatChannel, getParticipants } = this.props
    resetParticipants(chatChannel)
    getParticipants(chatChannel, 0, PARTICIPANT_LIMIT)
  }

  shouldComponentUpdate(nextProps: AllProps, nextState: LocalState): boolean {
    const { selection, searchResults, keyword } = this.state
    const { participants } = this.props
    if (!participants || !searchResults) {
      return false
    }

    return (
      participants.length < nextProps.participants.length ||
      selection.length !== nextState.selection.length ||
      searchResults.length !== nextState.searchResults.length ||
      (!nextState.keyword && !!keyword)
    )
  }

  public componentDidUpdate(prevProps: AllProps, prevState: LocalState): void {
    const { participants, chatChannel } = this.props
    const { keyword } = this.state
    if (
      participants.length > prevProps.participants.length ||
      prevProps.chatChannel !== chatChannel ||
      (prevState.keyword && !keyword)
    ) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ searchResults: participants })
    }
  }

  public componentWillUnmount(): void {
    this.phrase$.unsubscribe()
  }

  private handleTouch = (userId: string): void => {
    const { myUuid } = this.props
    RootNavigation.navigate(Routes.UserProfile, {
      chatUserId: userId,
      myUuid,
    })
  }

  private readonly keyExtract = (item: ChatUser): string => {
    return item.uuid
  }

  private renderChatUser = ({
    item,
  }: {
    readonly item: ChatUser
    readonly index: number
  }) => {
    return (
      <AddPersonItem
        key={item.uuid}
        user={item}
        handleTouch={this.handleTouch}
        selected={false}
        listStyle
      />
    )
  }

  // Todo: fetch backend endpoint to search
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private handleChangeText = (text: string) => {
    this.setState({ keyword: text })
    this.phrase$.next(text)
  }

  private readonly handleOnEndReached = () => {
    const {
      participants,
      getParticipants,
      loadingParticipants,
      chatChannel,
      hasNextPage,
    } = this.props

    const { keyword } = this.state

    !loadingParticipants &&
      !keyword &&
      hasNextPage &&
      getParticipants(
        chatChannel,
        participants ? participants.length : 0,
        PARTICIPANT_LIMIT
      )
  }

  public render(): React.ReactNode {
    const {
      position,
      goBackCallback,
      theme,
      firstTwoParticipants,
      loadingParticipants,
    } = this.props
    const { searchResults } = this.state

    return (
      <InboxWrapper>
        {position === Routes.UserList && (
          <Header
            avatar={renderGroupAvatar(firstTwoParticipants)}
            onBackPress={goBackCallback}
            title="Group members:"
            textColor={color.dark}
            hasMenu={false}
          />
        )}
        <ConversationsWrapper>
          <StyledSearchUserInput
            placeholder="Search"
            placeholderTextColor={color.interests.autocompleteList.color}
            textAlign="center"
            multiline={false}
            onChangeText={this.handleChangeText}
          />
          <StyledFlatlist
            data={searchResults}
            renderItem={this.renderChatUser}
            keyExtractor={this.keyExtract}
            ListEmptyComponent={<MaterialIndicator color={theme.mainBlue} />}
            onEndReached={this.handleOnEndReached}
            onEndReachedThreshold={0.01}
            ListFooterComponent={
              loadingParticipants ? (
                <MaterialIndicator color={theme.mainBlue} />
              ) : null
            }
          />
        </ConversationsWrapper>
      </InboxWrapper>
    )
  }
}

const mapStateToProps = (state: State, ownProps: AllProps): StateToProps => ({
  joinCall: selectJoinCall(state),
  participants: selectParticipantsArray(ownProps.chatChannel)(state),
  loadingParticipants: selectLoadingParticipantsFeature(state),
  hasNextPage: selectParticipantsHasNextPage(state),
  token: selectToken(state),
})

const mapDispatchToProps = (
  dispatch: Dispatch<UsersListAction>
): DispatchToProps => ({
  getParticipants: (channel: string, from: number, limit: number) =>
    dispatch(UsersListAction.getParticipants(channel, from, limit)),
  resetParticipants: (channel: string) =>
    dispatch(UsersListAction.resetParticipants(channel)),
})

export const UserList = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTheme(UserListComponent))
