/* eslint-disable import/no-extraneous-dependencies */
import { UsersListActionType } from "convose-lib/users-list"
import {
  AnyAction,
  applyMiddleware,
  compose,
  createStore,
  DeepPartial,
} from "redux"
import { createEpicMiddleware } from "redux-observable"
import { persistStore } from "redux-persist"
import { rootEpic } from "./root-epic"
import { rootReducer } from "./root-reducer"
import { State } from "./state"

const reduxDevTools = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
const epicMiddleware = createEpicMiddleware<AnyAction, AnyAction, State>()

const composeEnhancers =
  reduxDevTools && process.env.NODE_ENV !== "production"
    ? reduxDevTools({
        actionsBlacklist: [UsersListActionType.GetUsersListSuccess],
        maxAge: 100,
        name: "Convose",
        trace: true,
      })
    : compose

const enhancers = composeEnhancers(
  applyMiddleware(epicMiddleware)
) as DeepPartial<State>

export const configureStore = () => {
  const store = createStore(rootReducer, enhancers)
  epicMiddleware.run(rootEpic)
  const persistor = persistStore(store)
  return { store, persistor }
}
