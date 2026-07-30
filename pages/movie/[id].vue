<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useMoviesApi } from "@/api/movies.api";

import MovieAbout from "~/components/MovieAbout.vue";

const route = useRoute();
const api = useMoviesApi();

const movie = ref<any>(null);
const loading = ref(true);

onMounted(async () => {
  try {
    const id = route.params.id as string;
    const res = await api.getMovie(id);
    movie.value = res.data;
  } catch (e) {
    console.error("Ошибка загрузки фильма:", e);
  } finally {
    loading.value = false;
  }
});
</script>

<template>

    <div v-if="loading">Загрузка фильма...</div>

    <MovieHeader v-if="movie" :movie="movie" />
<MovieAbout v-if="movie" :movie="movie" />

</template>
