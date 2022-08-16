import { AppState } from "../app"
import { AuthState } from "../auth"
import { ChatState } from "../chat"
import { InterestsState } from "../interests"
import { OnboardingState } from "../onboarding"
import { ToastState } from "../toast"
import { UserState } from "../user"
import { UserListState } from "../users-list"
import { CallingState } from "../calling"
import { PersistPartial } from "redux-persist/es/persistReducer"

export type State = {
  readonly chat: ChatState & PersistPartial
  readonly interests: InterestsState
  readonly toast: ToastState
  readonly user: UserState & PersistPartial
  readonly usersList: UserListState & PersistPartial
  readonly onboarding: OnboardingState & PersistPartial
  readonly app: AppState & PersistPartial
  readonly auth: AuthState
  readonly calling: CallingState
}
