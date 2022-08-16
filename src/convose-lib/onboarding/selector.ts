import { createSelector } from "reselect"

import { State } from "convose-lib/store"
import { OnboardingState } from "."

export const selectOnboardingFeature = (state: State): OnboardingState =>
  state.onboarding
export const selectOnboarding = createSelector(
  selectOnboardingFeature,
  (onboarding) => onboarding.startOnboarding
)
export const selectAddInterestExplainer = createSelector(
  selectOnboardingFeature,
  (onboarding) => onboarding.showAddInterestExplainer
)
