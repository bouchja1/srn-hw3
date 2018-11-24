// @flow
import React from "react"

import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  View,
  ActivityIndicator,
} from "react-native"

import { List, ListItem, SearchBar } from "react-native-elements"

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

export default class MovieList extends React.PureComponent<null> {
  static navigationOptions = { title: "Home" }

  state = {
    loading: false,
    movies: [],
    page: 1,
    refreshing: false,
    error: null,
  }

  arrayHolder = []

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

  _renderSeparator = () => <View style={styles.listSeparator} />

  _searchFilterFunction = text => {
    const newData = this.arrayHolder.filter(item => {
      const itemData = `${item.title.toUpperCase()}`
      const textData = text.toUpperCase()
      return itemData.indexOf(textData) > -1
    })
    this.setState(() => ({ movies: newData }))
  }

  _renderHeader = () => (
    <SearchBar
      placeholder="Type Here..."
      lightTheme
      round
      onChangeText={text => this._searchFilterFunction(text)}
      autoCorrect={false}
    />
  )

  _renderFooter = () => {
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
    console.log("handling more films")
    this.setState(
      prevState => ({
        page: prevState.page + 1,
        refreshing: true,
      }),
      () => this._makeRemoteRequest(),
    )
  }

  _handleRefresh = () => {
    console.log("Handling refresh.")
    this.setState(
      () => ({
        page: 1,
        refreshing: true,
      }),
      () => this._makeRemoteRequest(),
    )
  }

  _makeRemoteRequest() {
    if (!this.state.loading) {
      this.setState({ loading: true })
      loadTopRatedMovies(this.state.page)
        .then(response => {
          console.log("Result obtained: ", response)
          if (response.status === 200) {
            this.setState(
              prevState => ({
                movies:
                  this.state.page === 1
                    ? response.data.results
                    : [...prevState.movies, ...response.data.results],
                loading: false,
                refreshing: false,
              }),
              () => {
                console.log("SETTING ARRAY HOLDEEER!!!!", this.state.movies)
                this.arrayHolder = this.state.movies
              },
            )
          } else {
            console.log(`Error ${response.status} occured: `, response.data)
            this.setState(() => ({
              error:
                response.data.hasOwnProperty("status_code") &&
                response.data.hasOwnProperty("status_message")
                  ? response.data
                  : { status_code: 500, status_message: "Unknown error." },
              loading: false,
              refreshing: false,
            }))
          }
        })
        .catch(error => {
          console.log("Error occured:  ", error)
          this.setState(() => ({
            error: { status_code: 500, status_message: "Unknown error." },
            loading: false,
          }))
        })
    }
  }

  render() {
    const { movies } = this.state
    return (
      <SafeAreaView style={styles.container}>
        <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
          <FlatList
            data={movies}
            renderItem={this._renderItem}
            keyExtractor={this._keyExtractor}
            ItemSeparatorComponent={this._renderSeparator}
            ListHeaderComponent={this._renderHeader}
            ListFooterComponent={this._renderFooter}
            refreshing={this.state.refreshing}
            onRefresh={this._handleRefresh}
            onEndReached={this._handleMoreFilm}
            onEndReachedThreshold={0}
          />
        </List>
      </SafeAreaView>
    )
  }
}
