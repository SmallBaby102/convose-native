import React from "react"
import PropTypes from "prop-types"
import {
  Text,
  View,
  TouchableHighlight,
  FlatList,
  SafeAreaView,
} from "react-native"
import styles from "./style"
import { defaultShadows } from "convose-styles"
import { withTheme } from "styled-components"

class EmojiSearcher extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  wrapperStyle = [
    styles.emojiSearchList,
    defaultShadows,
    { backgroundColor: this.props.theme.main.chatBox },
  ]
  render() {
    return (
      <SafeAreaView>
        <View style={this.wrapperStyle}>
          <FlatList
            keyboardShouldPersistTaps={"handled"}
            data={this.props.data}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => {
              return (
                <TouchableHighlight
                  onPress={this.props.onEmoticonPress.bind(this, item)}
                  underlayColor={this.props.theme.ButtonOnPress}
                >
                  <View style={styles.searchRow}>
                    <View style={styles.searchEmoji}>
                      <Text style={styles.searchText}>{item.code}</Text>
                    </View>
                    <View style={styles.searchWord}>
                      <Text
                        style={[
                          styles.searchText,
                          { color: this.props.theme.main.text },
                        ]}
                        numberOfLines={1}
                      >
                        {`:${item.name}:`}
                      </Text>
                    </View>
                  </View>
                </TouchableHighlight>
              )
            }}
          />
        </View>
      </SafeAreaView>
    )
  }
}

EmojiSearcher.propTypes = {
  onEmoticonPress: PropTypes.func.isRequired,
  data: PropTypes.array,
}
export default withTheme(EmojiSearcher)
