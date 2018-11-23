// @flow
import React from "react"

import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  View,
  ActivityIndicator,
} from "react-native"

import { List, ListItem } from "react-native-elements"

import { loadTopRatedMovies } from "../api"

// components
import { Colors } from "../themes"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listSeparator: {
    height: 1,
    width: "86%",
    backgroundColor: "#CED0CE",
    marginLeft: "14%",
  },
})

const MOVIE_IMAGE_BASE_URL = "http://image.tmdb.org/t/p/w92/"

export default class RootContainer extends React.PureComponent<null> {
  static navigationOptions = { title: "Home" }

  state = {
    loading: false,
    movies: [],
    page: 1,
    refreshing: false,
  }

  componentDidMount() {
    this._makeRemoteRequest()
  }

  _showDetail = movieId => {
    this.props.navigation.navigate("Detail", {
      movie: {
        id: movieId,
      },
    })
  }

  _renderItem = ({ item }) => (
    <ListItem
      roundAvatar
      title={`${item.title}`}
      subtitle={item.vote_average}
      avatar={{ uri: MOVIE_IMAGE_BASE_URL + item.poster_path }}
      containerStyle={{ borderBottomWidth: 0 }}
      onPress={() => this._showDetail(item.id)}
    />
  )

  _keyExtractor = item => `item-${item.id}`

  renderSeparator = () => {
    return <View style={styles.listSeparator} />
  }

  renderFooter = () => {
    if (!this.state.loading) return null
    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE",
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    )
  }

  _handleMoreFilm = () => {
    this.setState(
      prevState => ({
        page: prevState.page + 1,
        refreshing: true,
      }),
      () => this._makeRemoteRequest(),
    )
  }

  _makeRemoteRequest() {
    if (!this.state.loading) {
      this.setState({ loading: true })
      setTimeout(() => {
        loadTopRatedMovies(this.state.page).then(response => {
          this.setState(prevState => ({
            movies:
              this.state.page === 1
                ? response.data.results
                : [...prevState.movies, ...response.data.results],
            loading: false,
            refreshing: false,
          }))
        })
      }, 1000)
    }
  }

  render() {
    let { movies } = this.state
    return (
      <SafeAreaView style={styles.container}>
        <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
          <FlatList
            data={movies}
            renderItem={this._renderItem}
            keyExtractor={this._keyExtractor}
            ItemSeparatorComponent={this.renderSeparator}
            ListFooterComponent={this.renderFooter}
            refreshing={this.state.refreshing}
            onEndReached={this._handleMoreFilm}
            onEndReachedThreshold={0}
          />
        </List>
      </SafeAreaView>
    )
  }
}
