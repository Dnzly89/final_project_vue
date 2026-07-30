import { useNuxtApp } from "#app";

export const useMoviesApi = () => {
  const { $axios } = useNuxtApp();

  return {

addFavorite(movieId: number | string) {
  return $axios.post("/favorites", { id: String(movieId) });
},

removeFavorite(movieId: number | string) {
  return $axios.delete(`/favorites/${String(movieId)}`);
},
    getRandomMovie() {
      return $axios.get("/movie/random");
    },

    getTopMovies() {
      return $axios.get("/movie/top10");
    },

   getFavorites() {
    return $axios.get("/favorites");
  },

  toggleFavorite(id: number) {
    return $axios.post(`/favorites/${id}`);
  },

    getMovie(id: number | string) {
      return $axios.get(`/movie/${id}`);
    },

    searchMovies(query: string, count = 8) {
  return $axios.get("/movie", {
    params: {
      title: query,
      count
    }
  });
},

    getGenres() {
      return $axios.get("/movie/genres");
    },

    getMoviesByGenre(genre: string, page = 1) {
        return $axios.get(`/movie?genre=${genre}&page=${page}`);
    }
  };
};
