import { defineStore } from "pinia";
import { useMoviesApi } from "@/api/movies.api";

export const useGenresStore = defineStore("genres", {
  state: () => ({
    list: [] as any[],
    isLoading: false
  }),

  actions: {
    async fetchGenres() {
      this.isLoading = true;
      try {
        const api = useMoviesApi();
        const res = await api.getGenres();
        this.list = res.data;
      } finally {
        this.isLoading = false;
      }
    }
  }
});
