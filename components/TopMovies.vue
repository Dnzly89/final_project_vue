<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useMoviesApi } from "@/api/movies.api";

const moviesApi = useMoviesApi();
const movies = ref<any[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const res = await moviesApi.getTopMovies();
    movies.value = res.data;
  } catch (e) {
    console.error("Ошибка загрузки ТОП 10:", e);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <section class="top-movies">
    <h2 class="top-movies__title">🔥 Топ 10 фильмов</h2>

    <div v-if="loading" class="top-movies__loading">Загрузка...</div>

    <div class="top-movies__list" v-else>
      <NuxtLink
        v-for="(movie, index) in movies"
        :key="movie.id"
        :to="`/movie/${movie.id}`"
        class="top-movies__card"
      >
        <div class="top-movies__badge">{{ index + 1 }}</div>

        <img
          :src="movie.posterUrl || '/images/cover.jpg'"
          :alt="movie.title"
          class="top-movies__poster"
        />
      </NuxtLink>
    </div>
  </section>
</template>

<style scoped>
.top-movies {
width: 100%;
  padding: 0;            
  margin: 50px 0 0 0;    
  color: #fff;
    border-radius: 16px;
}



.top-movies__title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 64px;
}

.top-movies__loading {
  font-size: 18px;
  opacity: 0.7;
}

.top-movies__list {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 40px;
}



.top-movies__card {
  position: relative;
   margin: 0 auto;
  display: flex;
  flex-direction: column;
  transition: 0.3s ease;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(130, 150, 255, 0.4),
              0 0 40px rgba(130, 150, 255, 0.2);
}

.top-movies__card:hover {
  
  transform: translateY(-5px);
}


.top-movies__badge {
  position: absolute;
  top: -15px;
  left: -15px;

  width: 32px;
  height: 32px;

  background: rgb(255, 255, 255);
  border-radius: 50%;
  border: 1px solid #fff;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 16px;
  font-weight: 700;
  color: #000000;

  backdrop-filter: blur(4px);
}

.top-movies__poster {
  width: 100%;
  height: 336px;
  object-fit: cover;
  border-radius: 12px;
}

/* ================================
   TABLET (481px – 1024px)
================================ */
@media (max-width: 1024px) and (min-width: 481px) {

  .top-movies {
    margin-top: 40px;
  }

  .top-movies__title {
    font-size: 24px;
    margin-bottom: 40px;
  }

  /* ---------- СЕТКА ---------- */
  .top-movies__list {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 24px;
  }

  /* ---------- КАРТОЧКА ---------- */
  .top-movies__card {
    box-shadow: 0 0 14px rgba(130, 150, 255, 0.35);
  }

  .top-movies__poster {
    height: 280px;
  }

  /* ---------- БЕЙДЖ ---------- */
  .top-movies__badge {
    top: -10px;
    left: -10px;
    width: 28px;
    height: 28px;
    font-size: 14px;
  }
}



@media (max-width: 480px) {

  .top-movies__list {
    display: flex;
    flex-direction: row;
    gap: 16px;

    overflow-x: scroll;        /* ← используем scroll, НЕ auto */
    overflow-y: visible;       /* ← чтобы не обрезало бейдж */

    padding-bottom: 10px;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
  }

  /* скрываем полосу */
  .top-movies__list::-webkit-scrollbar {
    display: none;
  }

  .top-movies__card {
    flex: 0 0 70%;
    scroll-snap-align: center;

    position: relative;
    overflow: visible;       /* ← разрешаем вылазить бейджу */

    border-radius: 12px;
    box-shadow: none;
  }

  .top-movies__badge {
  position: absolute;
  top: 8px;
  left: 8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #fff;
  color: #000;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

  .top-movies__poster {
    width: 100%;
    height: 336px;
    border-radius: 12px;
    object-fit: cover;
  }
}


</style>
