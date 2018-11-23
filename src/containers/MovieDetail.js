// @flow
import React from "react"

import { SafeAreaView, StyleSheet, Text } from "react-native"

import { loadMovieDetail } from "../api"

// components
import { Colors } from "../themes"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
})

export default class MovieDetail extends React.PureComponent<Props> {
  static navigationOptions = { title: "Detail" }

  state = {
    movie: null,
  }

  componentDidMount() {
    console.log("BOOOOOOOOOOO")
    const { movie } = this.props.navigation.state.params
    loadMovieDetail(movie.id).then(response => {
      console.log("MMMMOOOVIE: ", movie)
      this.setState({
        movie: response.data.results,
      })
    })
  }

  render() {
    let { movie } = this.state
    return (
      <SafeAreaView style={styles.container}>
        <Text>test</Text>
      </SafeAreaView>
    )
  }
}
