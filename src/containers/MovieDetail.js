// @flow
import React from "react"

import { SafeAreaView, StyleSheet } from "react-native"
import { Text } from "react-native-elements"

import { loadMovieDetail } from "../api"

// components
import { Colors } from "../themes"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
  },
})

export default class MovieDetail extends React.PureComponent<null> {
  static navigationOptions = { title: "Detail" }

  state = {
    movie: null,
  }

  componentDidMount() {
    const { movie } = this.props.navigation.state.params
    loadMovieDetail(movie.id).then(response => {
      this.setState(() => ({
        movie: response.data,
      }))
    })
  }

  render() {
    let { movie } = this.state
    movie = movie ? movie.title : ""
    return (
      <SafeAreaView style={styles.container}>
        <Text h3>{movie}</Text>
      </SafeAreaView>
    )
  }
}
