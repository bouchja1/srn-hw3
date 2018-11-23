// @flow
import React from "react"

import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  Text,
  Button,
  View,
} from "react-native"

import { loadTopRatedMovies } from "../api"

// components
import { Colors } from "../themes"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
})

export default class RootContainer extends React.PureComponent<null> {
  static navigationOptions = { title: "Home" }

  state = {
    movies: [],
  }

  componentDidMount() {
    loadTopRatedMovies().then(response => {
      this.setState({
        movies: response.data.results,
      })
    })
  }

  _showDetail = movieId => {
    this.props.navigation.navigate("Detail", {
      movie: {
        id: movieId,
      },
    })
  }

  _renderItem = ({ item }) => (
    <View>
      <Text>{item.title}</Text>
      <Button onPress={() => this._showDetail(item.id)} title="show detail" />
    </View>
  )

  _keyExtractor = item => `item-${item.id}`

  render() {
    let { movies } = this.state
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={movies}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
        />
      </SafeAreaView>
    )
  }
}
