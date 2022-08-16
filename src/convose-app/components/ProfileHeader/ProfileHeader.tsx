import React, { useCallback, useEffect, useState, useRef } from "react"
import { Animated } from "react-native"
import * as ImagePicker from "expo-image-picker"
import { connect } from "react-redux"
import { Dispatch } from "redux"

import { State } from "convose-lib/store"
import {
  selectUserFeature,
  User,
  UserAction,
  UserState,
} from "convose-lib/user"

import { color } from "convose-styles"
import {
  AvatarWrapper,
  Header,
  LoadingSpinner,
  MaxCharAlertText,
  NameInputAndAlertContainer,
} from "./styled"
import { UsernameInput, Avatar } from "../../components"

type StateToProps = {
  readonly user: UserState
}

type DispatchToProps = {
  readonly updateUser: (payload: Partial<User>) => void
  readonly updateAvatar: (payload: FormData) => void
}
declare global {
  interface FormDataValue {
    uri: string
    name: string
    type: string
  }

  interface FormData {
    append(name: string, value: FormDataValue, fileName?: string): void
    set(name: string, value: FormDataValue, fileName?: string): void
  }
}

type ProfileHeaderProps = StateToProps & DispatchToProps
const MAX_VALID_NAME_CHAR_COUNT = 8
const ProfileHeaderComponent: React.FunctionComponent<ProfileHeaderProps> = ({
  user,
  updateUser,
  updateAvatar,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current

  const [username, setUsername] = useState("")
  const [showMaxCharAlert, setShowMaxCharAlert] = useState(false)

  useEffect(() => {
    setUsername(user.username)
  }, [user])

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: false,
      delay: 5000,
    }).start(() => {
      setShowMaxCharAlert(false)
    })
  }
  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start(() => {
      fadeOut()
    })
  }

  useEffect(() => {
    if (showMaxCharAlert) {
      fadeIn()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showMaxCharAlert])

  const changeUsername = useCallback(() => {
    const cleanUsername = username.trim().length ? username.trim() : "Guest"

    updateUser({
      username: cleanUsername,
    })
  }, [updateUser, username])

  const handOnChangeText = (val: string): void => {
    if (val.length > MAX_VALID_NAME_CHAR_COUNT) {
      setShowMaxCharAlert(true)
      return
    }
    setUsername(val)
  }

  // TODO: move this to utils functions
  const handleUpdateAvatar = useCallback(async () => {
    try {
      const image = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [5, 5],
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      })

      if (image.cancelled) {
        return
      }

      const extensionArray = image.uri.match(/\.(gif|jpg|jpeg|tiff|png)$/i)
      const extension = extensionArray ? extensionArray[1] : ""
      const name = image.uri.split("/")
      const type = `${image.type}/${extension}`

      const file = {
        name: name[name.length - 1],
        type,
        uri: image.uri,
      }

      const data = new FormData()
      data.append("file", file)

      updateAvatar(data)
    } catch (error) {
      // console.log(error)
    }
  }, [updateAvatar])

  return (
    <Header>
      <AvatarWrapper onPress={handleUpdateAvatar}>
        {user.updating_avatar ? (
          <LoadingSpinner color={color.mainBlue} />
        ) : (
          <Avatar userAvatar={user.avatar} height={70} width={70} />
        )}
      </AvatarWrapper>
      <NameInputAndAlertContainer>
        <UsernameInput
          value={username}
          onChangeText={handOnChangeText}
          onBlur={changeUsername}
          onSubmitEditing={changeUsername}
          color={user.theme_color}
        />
        <Animated.View
          // eslint-disable-next-line react-perf/jsx-no-new-object-as-prop
          style={{
            opacity: fadeAnim,
            position: "absolute",
            bottom: -15,
          }}
        >
          <MaxCharAlertText>
            Maximum {MAX_VALID_NAME_CHAR_COUNT} characters
          </MaxCharAlertText>
        </Animated.View>
      </NameInputAndAlertContainer>
    </Header>
  )
}

const mapStateToProps = (state: State): StateToProps => ({
  user: selectUserFeature(state),
})

const mapDispatchToProps = (dispatch: Dispatch): DispatchToProps => ({
  updateAvatar: (payload: FormData) =>
    dispatch(UserAction.updateAvatar(payload)),
  updateUser: (payload: Partial<User>) =>
    dispatch(UserAction.updateUser(payload)),
})
// ProfileHeaderComponent.whyDidYouRender = {
//   logOnDifferentValues: false,
//   customName: "ProfileHeaderComponent",
//   diffNameColor: "red",
// }
export const ProfileHeader = React.memo(
  connect(mapStateToProps, mapDispatchToProps)(ProfileHeaderComponent)
)
