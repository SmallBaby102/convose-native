/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ActionsUnion, createAction } from "../utils/action"

export enum OnboardingActionType {
  HideOnboarding = "[Onboarding] Hide onboarding",
  ShowOnboarding = "[Onboarding] Show onboarding",
  HideAddInterestExplainer = "[Onboarding] Hide add interest explainer",
}

export const OnboardingAction = {
  hideOnboarding: () => createAction(OnboardingActionType.HideOnboarding),
  showOnboarding: () => createAction(OnboardingActionType.ShowOnboarding),
  hideAddInterestExplainer: () =>
    createAction(OnboardingActionType.HideAddInterestExplainer),
}

export type OnboardingAction = ActionsUnion<typeof OnboardingAction>
