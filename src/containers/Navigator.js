import { createStackNavigator, createAppContainer } from "react-navigation"

// components
import RootContainer from "./RootContainer"
import MovieDetail from "./MovieDetail"

export default createAppContainer(
  createStackNavigator({
    Home: RootContainer,
    MovieDetail,
  }),
)
