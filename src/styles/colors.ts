import { ToastType } from "convose-lib/toast"

const mainColors = {
  black: "#000000",
  blue: "#1CBAF1",
  dark: "#4D4D4D",
  darkGray: "#787878",
  dusk: "#55627F",
  duskLight: "#55627F",
  darkgray: "#dbdbdb",
  darkergray: "rgba(165, 165, 165, 1)",
  gray: "#ededed",
  midgray: "#f1f1f1",
  lightgray: "#F3F3F3",
  green: "#4BE74B",
  yellow: "#CDB900",
  darkGreen: "#77CF68",
  lightGray: "#F9F9F9",
  mainBlue: "#19AAEB",
  mentionBlue: "#94C2FF",
  mentionYellow: "#FAE8B8",
  lightBlue: "#CEF2FF",
  red: "#FF5555",
  lightRed: "#FF7979",
  bittersweet: "#FF6060",
  shadowGray: "#E4E4E4",
  white: "#FFFFFF",
  link: "#707EFF",
  blue_transparent: "rgba(51, 187, 238, 0.5)",
  white_transparent_light: "rgba(255, 255, 255, 0.95)",
  transparent: "rgba(255, 255, 255, 0)",
  black_transparent_light: "rgba(0, 0, 0, 0.5)",
  gray_transpatent_light: "rgba(80, 80, 80, 0.95)",
  darkHeader: "rgba(31, 31, 31, 0.95)",
  textGray: "#F3F4F5",
  darkLevel1: "#1F1F1F",
  darkLevel2: "#1F2325",
  darkLevel3: "#343434",
  darkLevel4: "#535353",
  darkLevel5: "#646464",
  lightButtonOnPress: "#EBF5FF",
  darkButtonOnPress: "#343434",
}

export const componentColorsLight = {
  mode: "light",
  mainBlue: "#19AAEB",
  interests: {
    autocompleteList: {
      background: mainColors.lightGray,
      borderBottom: mainColors.gray,
      color: mainColors.dusk,
      added: mainColors.green,
      removed: mainColors.red,
      newInterestBackground: "rgba(249, 249, 249, 0.92)",
    },
    bar: {
      background: "#F8F8F8",
    },
    input: {
      background: mainColors.white,
      border: "#DFDFDF",
      buttonBackground: "#00AEEF",
      cancel: mainColors.mainBlue,
      color: mainColors.duskLight,
      count: mainColors.mainBlue,
      icon: "#909090",
      placeholder: mainColors.darkGray,
      wrapperBackground: mainColors.midgray,
    },
    ratingWheel: {
      active: mainColors.black,
      inactive: "#C3C3C3",
      stroke: mainColors.white,
    },
    button: {
      background: mainColors.white,
      disabledBackground: mainColors.lightGray,
      text: mainColors.mainBlue,
    },
    inputAndCurrentInterests: {
      background: mainColors.white,
    },
    linearRating: {
      active: mainColors.green,
      inactive: mainColors.blue_transparent,
    },
  },
  main: {
    background: mainColors.white,
    chatBox: mainColors.white,
    chatBoxOnCall: mainColors.lightGray,
    text: mainColors.black,
  },
  myInterests: {
    addInterestButton: "#00BCD4",
    background: mainColors.white,
    border: mainColors.mainBlue,
    closeButton: "#787878",
    gray: "#A0A0A0",
  },
  textInput: {
    background: `${mainColors.textGray}C4`,
    placeholder: "#999999",
    color: mainColors.black,
  },
  message: {
    deletedText: mainColors.darkergray,
    deletedTextBorder: mainColors.darkgray,
    loadingMessage: mainColors.lightGray,
    loadingMessageDark: mainColors.lightgray,
  },
  toast: {
    [ToastType.error]: mainColors.red,
    [ToastType.success]: mainColors.green,
  },
  statusBar: mainColors.white,
  notification: mainColors.white,
  header: mainColors.white_transparent_light,
  inboxConversationBox: { newMessage: mainColors.darkGray },
  callStatusMsg: mainColors.black,
  timeStamp: mainColors.darkGray,
  chatInfo: mainColors.dusk,
  callingUnmuteAlert: mainColors.white,
  ButtonOnPress: mainColors.lightButtonOnPress,
  profile: {
    alert: mainColors.red,
  },
  explainerText: mainColors.white,
  terms: {
    title: mainColors.black,
    text: mainColors.black,
  },
  messageActions: {
    wrapper: "transparent",
    background: mainColors.white,
  },
}

export const componentColorsDark = {
  mode: "dark",
  mainBlue: "#008ECD",
  interests: {
    autocompleteList: {
      background: mainColors.darkLevel1,
      borderBottom: mainColors.darkLevel3,
      color: mainColors.white,
      added: mainColors.green,
      removed: mainColors.red,
      newInterestBackground: "rgba(31, 31, 31, 0.92)",
    },
    bar: {
      background: "#F8F8F8",
    },
    input: {
      background: mainColors.black,
      border: "#DFDFDF",
      buttonBackground: "#00AEEF",
      cancel: mainColors.mainBlue,
      color: mainColors.duskLight,
      count: mainColors.mainBlue,
      icon: "#909090",
      placeholder: mainColors.lightGray,
      wrapperBackground: "#3D3D3D",
    },
    ratingWheel: {
      active: mainColors.white,
      inactive: mainColors.darkLevel5,
      stroke: mainColors.darkLevel1,
    },
    button: {
      background: mainColors.darkLevel3,
      disabledBackground: mainColors.darkLevel4,
      text: mainColors.mainBlue,
    },
    inputAndCurrentInterests: {
      background: "#2d2d2d",
    },
    linearRating: {
      active: mainColors.green,
      inactive: mainColors.blue_transparent,
    },
  },
  main: {
    background: mainColors.darkLevel1,
    chatBox: mainColors.darkLevel3,
    chatBoxOnCall: mainColors.darkLevel4,
    text: mainColors.white,
  },
  myInterests: {
    addInterestButton: "#00BCD4",
    background: mainColors.darkLevel3,
    border: mainColors.mainBlue,
    closeButton: "#787878",
    gray: "#A0A0A0",
  },
  textInput: {
    background: `${mainColors.darkLevel3}C4`,
    placeholder: mainColors.darkLevel2,
    color: mainColors.white,
  },
  message: {
    deletedText: mainColors.darkergray,
    deletedTextBorder: mainColors.darkgray,
    loadingMessage: mainColors.darkGray,
    loadingMessageDark: mainColors.darkLevel4,
  },
  toast: {
    [ToastType.error]: mainColors.red,
    [ToastType.success]: mainColors.green,
  },
  statusBar: mainColors.darkLevel1,
  notification: mainColors.darkLevel3,
  header: mainColors.darkHeader,
  inboxConversationBox: { newMessage: mainColors.white },
  callStatusMsg: mainColors.white,
  timeStamp: mainColors.lightGray,
  chatInfo: mainColors.lightGray,
  callingUnmuteAlert: mainColors.darkLevel3,
  ButtonOnPress: mainColors.darkButtonOnPress,
  profile: {
    alert: mainColors.red,
  },
  explainerText: mainColors.white,
  terms: {
    title: mainColors.white,
    text: mainColors.white,
  },
  messageActions: {
    wrapper: mainColors.darkLevel2,
    background: `${mainColors.darkLevel3}C4`,
  },
}

export const color = {
  ...mainColors,
  ...componentColorsLight,
}

export interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  theme: any
  size: number
  fontSize: number | string
  top: number | string
  left: number | string
  color: string
  italic: boolean
  background: string
  backgroundColor: string
  margin: number | string
  width: number
  height: number
  borderRadius: number
}
