<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useMoviesApi } from "@/api/movies.api";

const route = useRoute();
const router = useRouter();
const api = useMoviesApi();

// slug из URL: /genres/action
const slug = route.params.slug as string;

// ====== СТЕЙТ ======
const moviesCache = ref<any[]>([]);   // кеш фильмов
const visibleCount = ref(10);          // показываем по 10
const page = ref(1);                   // страница API
const hasMore = ref(true);             // есть ли ещё фильмы
const loading = ref(false);

// ====== COMPUTED ======
const visibleMovies = computed(() =>
  moviesCache.value.slice(0, visibleCount.value)
);

// ====== API ======
async function loadNextPage() {
  if (loading.value || !hasMore.value) return;

  loading.value = true;

  const res = await api.getMoviesByGenre(slug, page.value);

  if (!res.data.length) {
    hasMore.value = false;
  } else {
    moviesCache.value.push(...res.data);
    page.value++;
  }

  loading.value = false;
}

// ====== UI ======
async function showMore() {
  visibleCount.value += 10;

  // если дошли до конца кеша — грузим следующую страницу
  if (
    visibleCount.value > moviesCache.value.length &&
    hasMore.value
  ) {
    await loadNextPage();
  }
}

function goToMovie(id: number) {
  router.push(`/movie/${id}`);
}

function goBack() {
  router.push("/genres");
}

// ====== INIT ======
onMounted(loadNextPage);
</script>

<template>
  <section class="genre-page">
    <h1 class="genre-title" @click="goBack">
       <img src="/icons/back.svg" />
       {{ slug }}
    </h1>

    <div class="movies-grid">
      <div
        class="movie-card"
        v-for="movie in visibleMovies"
        :key="movie.id"
        @click="goToMovie(movie.id)"
      >
        <img :src="movie.posterUrl" />
      </div>
    </div>

    <button
      v-if="hasMore || visibleCount < moviesCache.length"
      class="show-more-btn"
      @click="showMore"
    >
      Показать ещё
    </button>
  </section>
</template>

<style scoped>
.genre-page {
  padding: 40px;
  color: #fff;
}

.genre-title {
  font-size: 48px;
  margin-bottom: 32px;
  cursor: pointer;
  opacity: 0.9;
  display: flex;
  align-items: center;
}

.genre-title:hover {
  opacity: 0.6;
}

.movies-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
}

.movie-card {
  cursor: pointer;
}

.movie-card img {
  width: 100%;
  border-radius: 12px;
}

/* ---------- BUTTON ---------- */
.show-more-btn {
  display: block;
  margin: 40px auto 0;
  padding: 16px 48px;
  background: #ffffff;
  border-radius: 28px;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #000;
}

.show-more-btn:hover {
  background: #67A5EB;
  color: #fff;
}

/* ---------- TABLET ---------- */
@media (max-width: 1024px) {
  .movies-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* ---------- MOBILE ---------- */
@media (max-width: 480px) {
  .movies-grid {
    grid-template-columns: 1fr;
  }

  .genre-page {
    padding: 16px;
  }
}
</style>
