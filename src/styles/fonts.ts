/* eslint-disable */

import * as Font from "expo-font"
import {
  MaterialCommunityIcons,
  FontAwesome,
  FontAwesome5,
  MaterialIcons,
  Feather,
  Ionicons,
  SimpleLineIcons,
  Entypo,
} from "@expo/vector-icons"

export const cacheFonts = Font.loadAsync({
  Popins: require("../assets/Font/Poppins-Regular.ttf"),
  "Popins-bold": require("../assets/Font/Poppins-SemiBold.ttf"),
  "Popins-extra-bold": require("../assets/Font/Poppins-Bold.ttf"),
  "Popins-light": require("../assets/Font/Poppins-Light.ttf"),
  "Popins-medium": require("../assets/Font/Poppins-Medium.ttf"),
  ...MaterialCommunityIcons.font,
  ...FontAwesome.font,
  ...FontAwesome5.font,
  ...MaterialIcons.font,
  ...Feather.font,
  ...Ionicons.font,
  ...SimpleLineIcons.font,
  ...Entypo.font
})
/* eslint-enable */
export const font = {
  normal: "Popins",
  bold: "Popins-bold",
  extraBold: "Popins-extra-bold",
  medium: "Popins-medium",
  light: "Popins-light",
}
