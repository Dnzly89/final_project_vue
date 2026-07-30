<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useMoviesApi } from "@/api/movies.api";
import { imagesData } from "@/utils/genresData";
import GenreCard from "@/components/GenreCard.vue";

const api = useMoviesApi();
const router = useRouter();

const genresList = ref<any[]>([]);
const loading = ref(true);

function goToGenre(slug: string) {
  router.push(`/genres/${slug}`);
}

onMounted(async () => {
  const res = await api.getGenres();
  const allGenres = res.data;
  const firstEight = allGenres.slice(0, 8);

  genresList.value = firstEight.map((slug: string) => ({
    slug,
    title: imagesData[slug]?.title || slug,
    image: imagesData[slug]?.image || "/images/default.png",
  }));

  loading.value = false;
});
</script>

<template>
  <div class="genres-page">
    <h1 class="genres-title">Жанры фильмов</h1>

    <div v-if="loading">Загрузка...</div>

    <div v-else class="genres-grid">
      <GenreCard
        v-for="g in genresList"
        :key="g.slug"
        :genre="g"
        :slug="g.slug"
        @selectGenre="goToGenre"
      />
    </div>
  </div>
</template>

<style scoped>
.genres-page {
  padding: 0;
  color: #fff;
}

.genres-title {
  font-size: 32px;
  margin-bottom: 32px;
}

/* ---------- ЖАНРЫ ---------- */
.genres-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

/* ================================
   TABLET
================================ */
@media (max-width: 1024px) {
  .genres-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
}

/* ================================
   MOBILE
================================ */
@media (max-width: 480px) {
  .genres-page {
    padding: 0;
  }

  .genres-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>
