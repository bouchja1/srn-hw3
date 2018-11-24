import { createStackNavigator, createAppContainer } from "react-navigation"

// components
import MovieList from "./MovieList"
import MovieDetail from "./MovieDetail"

export default createAppContainer(
  createStackNavigator({
    Home: MovieList,
    Detail: MovieDetail,
  }),
)
