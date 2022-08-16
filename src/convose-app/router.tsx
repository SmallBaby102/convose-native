/* eslint-disable react-perf/jsx-no-new-object-as-prop */
/* eslint-disable react/jsx-props-no-spreading */
import React from "react"
import { connect } from "react-redux"
import { State } from "convose-lib/store"
import {
  createDrawerNavigator,
  // DrawerContentScrollView,
  DrawerNavigationOptions,
} from "@react-navigation/drawer"
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack"
import { Routes } from "convose-lib/router"
import { color, PROFILE_WIDTH } from "convose-styles"
import { ChatChannel, ChatUser } from "convose-lib/chat"
import { UserInterest, selectOnboarding } from "convose-lib"
// import { StyleSheet } from "react-native"
import { ForgetPasswordScreen } from "./screens/forget-password/ForgetPasswordScreen"
import { ResetPasswordScreen } from "./screens/reset-password/ResetPasswordScreen"

import {
  AuthScreen,
  ChatboxListScreen,
  ChatScreen,
  InboxScreen,
  InterestScreen,
  ProfileScreen,
  // RatingWheelScreen,
  UserProfileScreen,
  CreateGroupScreen,
  UserListScreen,
  // InitialScreen,
  // TermsScreen,
  TermsContentScreen,
  // AddInterestsScreen,
  AuthButtonListScreen,
  ChatMenuScreen,
  LinearRatingScreen,
} from "./screens"

type RouterToProps = {
  readonly onboarding: boolean
}
const RootNavStackV6 = createNativeStackNavigator<RootStackParamList>()
const MainScreenDrawerNavigatorV6 = createDrawerNavigator<MainScreenDrawerParamList>()
const ChatScreenDrawerNavigatorV6 = createDrawerNavigator<ChatScreenDrawerParamaList>()

// const styles = StyleSheet.create({
//   drawerStyle: { width: PROFILE_WIDTH },
//   drawerContentStyle: { flex: 1 },
// })
const drawerScreenOption: DrawerNavigationOptions = {
  headerShown: false,
  drawerStyle: { width: PROFILE_WIDTH },
  overlayColor: color.gray_transpatent_light,
  drawerHideStatusBarOnOpen: true,
}

const chatScreenDrawerOption: DrawerNavigationOptions = {
  ...drawerScreenOption,
  drawerPosition: "right",
  lazy: false,
  drawerType: "slide",
  gestureEnabled: true,
  swipeEnabled: true,
  swipeMinDistance: 10,
}

const stackScreenOption: NativeStackNavigationOptions = {
  animation: "none",
  headerShown: false,
}

const modalOption: NativeStackNavigationOptions = {
  presentation: "transparentModal",
}

// const disableSwipeBackOptions = {
//   gestureEnabled: false,
// }

const MainScreenDrawerContent = () => {
  return (
    // <DrawerContentScrollView contentContainerStyle={styles.drawerContentStyle}>
    <ProfileScreen />
    // </DrawerContentScrollView>
  )
}

const ChatScreenDrawerContent = ({
  state,
  navigation,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any) => <ChatMenuScreen state={state} navigation={navigation} />

const MainScreenDrawerNav = () => (
  <MainScreenDrawerNavigatorV6.Navigator
    drawerContent={MainScreenDrawerContent}
    screenOptions={drawerScreenOption}
  >
    <MainScreenDrawerNavigatorV6.Screen
      name={Routes.ChatboxList}
      component={ChatboxListScreen}
    />
  </MainScreenDrawerNavigatorV6.Navigator>
)

const ChatScreenDrawerNav = () => (
  <ChatScreenDrawerNavigatorV6.Navigator
    drawerContent={ChatScreenDrawerContent}
    screenOptions={chatScreenDrawerOption}
  >
    <ChatScreenDrawerNavigatorV6.Screen
      name={Routes.Chat}
      component={ChatScreen}
    />
  </ChatScreenDrawerNavigatorV6.Navigator>
)

const MainScreensGroup = (
  <RootNavStackV6.Group screenOptions={stackScreenOption}>
    <RootNavStackV6.Screen
      name={Routes.MainScreen}
      component={MainScreenDrawerNav}
    />
    <RootNavStackV6.Screen
      name={Routes.OnboardingTermsContent}
      component={TermsContentScreen}
    />
    <RootNavStackV6.Screen
      name={Routes.ChatDrawer}
      component={ChatScreenDrawerNav}
    />
    <RootNavStackV6.Screen name={Routes.Inbox} component={InboxScreen} />
    <RootNavStackV6.Screen
      name={Routes.UserProfile}
      component={UserProfileScreen}
    />
    <RootNavStackV6.Screen name={Routes.UserList} component={UserListScreen} />
    <RootNavStackV6.Screen
      name={Routes.Rating}
      component={LinearRatingScreen}
      options={modalOption}
    />
    <RootNavStackV6.Screen
      name={Routes.AuthButtonList}
      component={AuthButtonListScreen}
    />
    <RootNavStackV6.Screen name={Routes.Login} component={AuthScreen} />
    <RootNavStackV6.Screen name={Routes.SignUp} component={AuthScreen} />
    <RootNavStackV6.Screen
      name={Routes.CreateGroup}
      component={CreateGroupScreen}
    />
    <RootNavStackV6.Screen
      name={Routes.ForgetPassword}
      component={ForgetPasswordScreen}
    />
    <RootNavStackV6.Screen
      name={Routes.ResetPassword}
      component={ResetPasswordScreen}
    />
    <RootNavStackV6.Screen name={Routes.Interests} component={InterestScreen} />
  </RootNavStackV6.Group>
)

export type RootStackParamList = {
  [Routes.OnboardingInitial]: undefined
  [Routes.OnboardingInterest]: undefined
  [Routes.OnboardingTerms]: undefined
  [Routes.OnboardingTermsContent]: undefined
  [Routes.MainScreen]: undefined
  [Routes.ChatDrawer]: {
    channel: ChatChannel
    chatUser: ChatUser
    forRejoinCall?: boolean
  }
  [Routes.Inbox]: undefined
  [Routes.UserProfile]: { chatUser: ChatUser; myUuid: string }
  [Routes.UserList]: { chatUsers: ChatUser[]; myUuid: string }
  [Routes.Rating]: {
    interest: UserInterest
    showPopup: (interest: UserInterest) => void
  }
  [Routes.AuthButtonList]: { loginOrSignUp: string }
  [Routes.Login]: undefined
  [Routes.SignUp]: undefined
  [Routes.CreateGroup]: { members: string[]; isGroup: boolean }
  [Routes.ForgetPassword]: undefined
  [Routes.ResetPassword]: undefined
  [Routes.Interests]: undefined
}

class RootStackComponent extends React.PureComponent<RouterToProps> {
  public render(): React.ReactNode {
    return (
      <RootNavStackV6.Navigator screenOptions={stackScreenOption}>
        {MainScreensGroup}
      </RootNavStackV6.Navigator>
    )
  }
}

export type MainScreenDrawerParamList = {
  [Routes.ChatboxList]: undefined
  [Routes.Profile]: undefined
}

export type ChatScreenDrawerParamaList = {
  [Routes.Chat]: { channel: ChatChannel; chatUser: ChatUser }
}

const mapStateToProps = (state: State): RouterToProps => ({
  onboarding: selectOnboarding(state),
})

export const RootStack = connect(mapStateToProps, null)(RootStackComponent)
