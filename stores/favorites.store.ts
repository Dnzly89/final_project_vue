import { defineStore } from "pinia";
import { ref } from "vue";
import { useMoviesApi } from "~/api/movies.api";

export interface FavoriteMovie {
  id: number;
  title: string;
  posterUrl: string;
  tmdbRating: number;
}

export const useFavoritesStore = defineStore("favorites", () => {
  const favorites = ref<FavoriteMovie[]>([]);
  const loading = ref(false);

  const api = useMoviesApi();

  /** Загружаем избранное */
  const loadFavorites = async () => {
    loading.value = true;
    try {
      const res = await api.getFavorites();
      favorites.value = res.data;
    } catch (e) {
      favorites.value = [];
    } finally {
      loading.value = false;
    }
  };

  /** Добавить / удалить фильм по id */
 const toggle = async (id: number) => {
  const exists = favorites.value.some(f => f.id === id);

if (exists) {
    await api.removeFavorite(String(id));
  } else {
    await api.addFavorite(String(id));
  }

  await loadFavorites();
};

  /** Проверка — фильм в избранном? */
const isFavorite = (id: number) => {
  return favorites.value.some(movie => movie.id === id);
};

  return {
    favorites,
    loading,
    loadFavorites,
    toggle,
    isFavorite,
  };
});
