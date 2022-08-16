import { AuthAction, AuthActionType } from "convose-lib/auth"
import { OnboardingAction, OnboardingActionType } from "./actions"
import { OnboardingState } from "./state"

export const OnboardingInitial: OnboardingState = {
  startOnboarding: true,
  showAddInterestExplainer: false,
}

export const onboardingReducer = (
  state: OnboardingState = OnboardingInitial,
  action: OnboardingAction | AuthAction
): OnboardingState => {
  switch (action.type) {
    case OnboardingActionType.HideOnboarding:
      return {
        ...state,
        startOnboarding: false,
        showAddInterestExplainer: true,
      }

    case OnboardingActionType.ShowOnboarding:
      return { ...state, startOnboarding: true }

    case AuthActionType.SignInUserSuccess:
      return { ...state, startOnboarding: false }

    case AuthActionType.AuthThirdPartySuccess:
      return { ...state, startOnboarding: false }
    case OnboardingActionType.HideAddInterestExplainer:
      return { ...state, showAddInterestExplainer: false }
    default:
      return state
  }
}
