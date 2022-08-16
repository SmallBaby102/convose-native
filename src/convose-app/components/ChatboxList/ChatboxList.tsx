/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-props-no-spreading */
import * as React from "react"
import {
  StyleSheet,
  Dimensions,
  FlatList,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import { MaterialIndicator } from "react-native-indicators"
import { withSafeAreaInsets } from "react-native-safe-area-context"
import { uniqBy } from "lodash"

import { ChatUser } from "convose-lib/chat"
import { State } from "convose-lib/store"
import { selectMyUuid, Uuid } from "convose-lib/user"
import { selectUsersFeature, UsersListAction } from "convose-lib/users-list"
import { isTablet } from "convose-lib/utils"
import { selectCallingChannel } from "convose-lib/calling"
import { selectIsDarkMode } from "convose-lib/app"
import { SafeAreaProps } from "convose-lib/generalTypes"
import { color } from "convose-styles"
import { Chatbox } from "../Chatbox"
import { ChatboxListWrapper } from "./Styled"
import ReturnToCall from "../ReturnToCall/ReturnToCall"
import { StatusBarBackground } from "../../screens/chatbox-list/Styled"
import { Blank } from "../ChatMessageList/Styled"

type StateToProps = {
  readonly myUuid: Uuid
  readonly scrollChatboxes: boolean
  readonly users: ReadonlyArray<ChatUser> | null
  readonly callingChannel: string
  readonly darkMode: boolean | null
}

type DispatchToProps = {
  readonly toggleScrollChatboxes: () => void
}
type Props = {
  isFocused: () => boolean
}
const styles = StyleSheet.create({
  centering: {
    alignItems: "center",
    justifyContent: "flex-start",
  },
  contentContainer: { flexGrow: 1 },
  chatBox: { alignSelf: "center" },
})
const mutationLayout = {
  type: LayoutAnimation.Types.easeInEaseOut,
  property: LayoutAnimation.Properties.scaleXY,
}
const layoutAnimConfig = {
  duration: 200,
  update: mutationLayout,
  // {
  //   type: LayoutAnimation.Types.easeInEaseOut,
  // },
  delete: mutationLayout,
  create: mutationLayout,
}

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}
class ChatboxListComponent extends React.Component<
  StateToProps & DispatchToProps & SafeAreaProps & Props
> {
  private readonly flatlistRef: React.RefObject<FlatList> = React.createRef<FlatList>()

  windowWidth = Dimensions.get("window").width

  windowHeight = Dimensions.get("window").height

  shouldComponentUpdate(nextProps: StateToProps & DispatchToProps): boolean {
    const { users, toggleScrollChatboxes } = this.props
    if (nextProps.scrollChatboxes === true) {
      if (
        users &&
        this.flatlistRef &&
        this.flatlistRef.current &&
        nextProps.scrollChatboxes
      ) {
        users.length > 0 &&
          this.flatlistRef.current.scrollToIndex({
            viewPosition: 0,
            index: 0,
            animated: true,
          })
        setTimeout(() => {
          toggleScrollChatboxes()
        }, 0)
        return false
      }
    }
    if (JSON.stringify(users) === JSON.stringify(nextProps.users)) {
      return false
    }
    return true
  }

  componentDidUpdate() {
    const { isFocused } = this.props
    if (isFocused()) {
      LayoutAnimation.configureNext(layoutAnimConfig)
    }
  }

  public readonly renderUser = (user: {
    item: ChatUser
  }): React.ReactElement => {
    const { myUuid, callingChannel, darkMode } = this.props

    return (
      <Chatbox
        style={styles.chatBox}
        key={user.item.uuid}
        myUuid={myUuid}
        darkMode={darkMode}
        // eslint-disable-next-line react-perf/jsx-no-new-object-as-prop
        user={{ ...user.item }}
        callingChannel={callingChannel}
      />
    )
  }

  public render(): React.ReactNode {
    const { users, insets } = this.props
    const uniqueUsers = uniqBy(users || [], "uuid")
    return (
      <>
        <ChatboxListWrapper bottomInset={insets?.bottom}>
          <StatusBarBackground />
          <ReturnToCall />
          <FlatList
            ref={this.flatlistRef}
            scrollEventThrottle={400}
            scrollToOverflowEnabled
            contentContainerStyle={styles.contentContainer}
            {...(isTablet()
              ? {
                  columnWrapperStyle: {
                    justifyContent: "space-around",
                    width: "100%",
                  },
                }
              : {})}
            numColumns={isTablet() ? 2 : 1}
            initialNumToRender={4}
            windowSize={4}
            data={uniqueUsers}
            renderItem={this.renderUser}
            getItemLayout={(data, index) => ({
              length: 255,
              offset: 255 * index,
              index,
            })}
            keyExtractor={(user) => user.uuid}
            ListEmptyComponent={<MaterialIndicator color={color.mainBlue} />}
            ListFooterComponent={() => <Blank />}
          />
        </ChatboxListWrapper>
      </>
    )
  }
}

const mapStateToProps = (state: State): StateToProps => ({
  myUuid: selectMyUuid(state),
  scrollChatboxes: state.usersList.scrollChatboxes,
  users: selectUsersFeature(state),
  callingChannel: selectCallingChannel(state),
  darkMode: selectIsDarkMode(state),
})

const mapDispatchToProps = (dispatch: Dispatch): DispatchToProps => ({
  toggleScrollChatboxes: () => {
    dispatch(UsersListAction.scrollChatboxesToggle())
  },
})
// ChatboxListComponent.whyDidYouRender = {
//   logOnDifferentValues: false,
//   customName: "ChatboxListComponent",
//   diffNameColor: "red",
// }
export const ChatboxList = withSafeAreaInsets(
  connect(mapStateToProps, mapDispatchToProps)(ChatboxListComponent)
)
