import { AppAction, AppType } from "./actions"
import { AppState } from "./state"

const INIT_STATE: AppState = {
  showSplash: true,
  setting: {
    darkMode: null,
  },
  isFayeReady: false,
}

export const appReducer = (state = INIT_STATE, action: AppAction): AppState => {
  switch (action.type) {
    case AppType.HideSplash:
      return { ...state, showSplash: false }

    case AppType.ChangeTheme:
      return { ...state, setting: { darkMode: action.payload } }

    case AppType.SetFayeIsReady:
      return { ...state, isFayeReady: true }

    default:
      return state
  }
}
