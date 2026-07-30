import { defineStore } from "pinia";
import { useMoviesApi } from "@/api/movies.api";

export const useMoviesStore = defineStore("movies", {
  state: () => ({
    randomMovie: null as any,
    selectedMovie: null as any,
    topMovies: [] as any[],
    isLoading: false,

    selectedGenre: null as string | null, // ← добавлено
  }),

  actions: {
    setSelectedMovie(movie: any) {
      this.selectedMovie = movie;
      this.randomMovie = movie;
    },

    clearSelectedMovie() {
      this.selectedMovie = null;
    },

    async fetchRandomMovie() {
      try {
        this.isLoading = true;

        if (this.selectedMovie) {
          this.randomMovie = this.selectedMovie;
          return;
        }

        const api = useMoviesApi();
        const res = await api.getRandomMovie();
        this.randomMovie = res.data;

      } finally {
        this.isLoading = false;
      }
    },

    async fetchTopMovies() {
      const api = useMoviesApi();
      const res = await api.getTopMovies();
      this.topMovies = res.data;
      this.selectedGenre = null; // сброс жанра
    },

    // 🔥 Загрузка фильмов по жанру
    async fetchMoviesByGenre(slug: string) {
      try {
        this.isLoading = true;

        const api = useMoviesApi();
        const res = await api.getMoviesByGenre(slug);

        this.topMovies = res.data;     // фильмы выбранного жанра
        this.selectedGenre = slug;

      } finally {
        this.isLoading = false;
      }
    },

    // Сброс фильтра жанра
    clearGenreFilter() {
      this.selectedGenre = null;
    }
  }
});
