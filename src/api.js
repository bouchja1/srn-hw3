import axiosLib from "axios"

const API_KEY = "4aa883f95999ec813b8bfaf319f3972b"

const axios = axiosLib.create({
  baseURL: "http://api.themoviedb.org/3/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

axios.interceptors.request.use(request => {
  return {
    ...request,
    url: `${request.url}?api_key=${API_KEY}`,
  }
})

export const loadTopRatedMovies = () => {
  return axios.get("/movie/top_rated")
}

export const loadMovieDetail = movieId => {
  return axios.get(`/movie/${movieId}`)
}
