import * as React from "react"
import { Provider } from "react-redux"
import { MainView } from "./convose-app/components"
import { configureStore } from "./convose-lib/store"
import { NavigationContainer } from "@react-navigation/native"
import { navigationRef } from "./convose-app/RootNavigation"
import { PersistGate } from "redux-persist/integration/react"
import * as Sentry from 'sentry-expo'

if (!__DEV__) {
  Sentry.init({
    dsn: 'https://7e1a0526a1f844f59cd0bd3c8cb9dcb4@o1288787.ingest.sentry.io/6506401',
    enableInExpoDevelopment: true,
    debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
  })
}
class App extends React.Component {
  public render(): React.ReactNode {
    let { store, persistor } = configureStore()
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NavigationContainer ref={navigationRef}>
            <MainView />
          </NavigationContainer>
        </PersistGate>
      </Provider>
    )
  }
}

export default App
