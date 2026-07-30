<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";

import { useMoviesApi } from "@/api/movies.api";
import { useFavoritesStore } from "~/stores/favorites.store";
import { useAuthStore } from "~/stores/auth.store";
import { useUIStore } from "~/stores/ui.store";

import { genresRu } from "~/utils/genres";

// -------------------- ROUTER --------------------
const router = useRouter();

// -------------------- STORES --------------------
const favorites = useFavoritesStore();
const auth = useAuthStore();
const ui = useUIStore();

// -------------------- STATE --------------------
const movie = ref<any>(null);
const isLoading = ref(true);
const isTrailerOpen = ref(false);

// -------------------- API --------------------
const api = useMoviesApi();

const loadRandomMovie = async () => {
  isLoading.value = true;
  const res = await api.getRandomMovie();
  movie.value = res.data;
  isLoading.value = false;
};

// -------------------- ТРЕЙЛЕР --------------------
const embedTrailerUrl = computed(() => {
  if (!movie.value?.trailerUrl) return null;

  const url = movie.value.trailerUrl;

  if (url.includes("watch?v=")) {
    return `https://www.youtube.com/embed/${url.split("v=")[1]}`;
  }

  if (url.includes("youtu.be")) {
    return `https://www.youtube.com/embed/${url.split("youtu.be/")[1]}`;
  }

  return url;
});

function openTrailerModal() {
  isTrailerOpen.value = true;
}

function closeTrailerModal() {
  isTrailerOpen.value = false;
}

// -------------------- О ФИЛЬМЕ --------------------
const openAbout = () => {
  if (!movie.value?.id) return;
  router.push(`/movie/${movie.value.id}`);
};

// -------------------- ВСПОМОГАТЕЛЬНЫЕ --------------------
function getGenresRuList(genres: any): string[] {
  if (!genres) return [];

  if (typeof genres === "string") {
    return genres.split(",").map(g => genresRu[g.trim()] ?? g.trim());
  }

  if (Array.isArray(genres)) {
    return genres.map((g: any) => genresRu[g.name ?? g] ?? g.name ?? g);
  }

  return [];
}

function minutesToHours(minutes: number): string {
  return `${Math.floor(minutes / 60)}ч ${minutes % 60}м`;
}

function getRatingClass(rating: number): string {
  if (rating >= 7) return "rating rating-good";
  if (rating >= 5) return "rating rating-mid";
  return "rating rating-low";
}

function truncateText(text: string, length = 180) {
  return text?.length > length ? text.slice(0, length) + "…" : text;
}

// -------------------- ИЗБРАННОЕ --------------------
const toggleFavorite = async () => {
  if (!auth.isAuth) {
    ui.openLoginModal();
    return;
  }
  await favorites.toggle(movie.value.id);
};

// -------------------- MOUNT --------------------
onMounted(loadRandomMovie);
</script>

<template>
  <div class="random-movie">
    <!-- Модалка трейлера -->
    <div v-if="isTrailerOpen" class="modal-overlay" @click="closeTrailerModal">
      <div class="modal-video-container" @click.stop>
        <button class="modal-video-close" @click="closeTrailerModal">✕</button>
        <iframe
          class="modal-video-frame"
          :src="embedTrailerUrl + '?autoplay=1'"
          allow="autoplay; encrypted-media"
          allowfullscreen
        />
      </div>
    </div>

    <div v-if="isLoading">Загрузка случайного фильма...</div>

    <div v-else class="movie-container">
      <div class="movie-info">
        <div class="movie-info__meta">
          <div class="movie-rating" :class="getRatingClass(movie.tmdbRating)">
            <img src="/icons/star.svg" />
            {{ movie.tmdbRating?.toFixed(1) ?? "—" }}
          </div>

          <p>{{ movie.releaseYear }}</p>
          <p>{{ getGenresRuList(movie.genres).join(", ") }}</p>
          <p>{{ minutesToHours(movie.runtime) }}</p>
        </div>

        <h1>{{ movie.title }}</h1>
        <p class ="movie-info__description" >{{ truncateText(movie.plot) }}</p>

        <div class="movie-actions">
          <button class="movie-actions__btn movie-actions__btn--active" @click="openTrailerModal">
            Трейлер
          </button>
            <div class="movie-actions-wrap">
          <button class="movie-actions__btn" @click="openAbout">
            О фильме
          </button>

          <button class="movie-actions__icon-btn" @click="toggleFavorite">
            <img
              :src="favorites.isFavorite(movie.id)
                ? '/icons/heart-filled.svg'
                : '/icons/heart.svg'"
            />
          </button>

          <button class="movie-actions__icon-btn" @click="loadRandomMovie">
            <img src="/icons/update.svg" />
          </button>
          </div>
        </div>
      </div>

      <div class="movie-poster">
        <img :src="movie.posterUrl" :alt="movie.title" />
      </div>
    </div>
  </div>
</template>


<style scoped>
.random-movie {
  width: 100%;
  box-sizing: border-box;
}

.movie-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 40px;
}

/* Текстовая часть */
.movie-info {
  width: 75%;
  color: #fff;
}

.movie-info__description {
  margin-bottom: 60px;
}

.movie-info__title {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
}

.movie-info__overview {
  font-size: 24px;
  line-height: 32px;
  font-weight: 400;
  opacity: 0.7;
  margin-bottom: 60px;
}





/* ——————————————————————————————
   Метаданные фильма (рейтинг, год, жанры, время)
—————————————————————————————— */

.movie-info__meta {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 16px;
}

.movie-meta__year,
.movie-meta__genres,
.movie-meta__runtime {
  font-size: 18px;
  margin: 0;
  opacity: 0.7;
}


/* ——————————————————————————————
   Рейтинг
—————————————————————————————— */

.movie-rating {
  display: flex;
  align-items: center;
  gap: 4px;

  padding: 4px 12px;
  border-radius: 16px;
  color: #fff;
}

.movie-rating__icon {
  width: 18px;
  height: 18px;
}

.movie-rating__value {
  font-size: 18px;
  font-weight: 700;
}


/* Цвета рейтингов */

.rating-good {
  background: #1b7a1b;
}

.rating-mid {
  background: #b3b32d;
}

.rating-low {
  background: #bd160a;
}


/* ——————————————————————————————
   Постер фильма
—————————————————————————————— */

.movie-poster {
  width: 50%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.movie-poster img {
  width: 100%;
  max-width: 680px;
  max-height: 550px;
  border-radius: 12px;
  object-fit: contain;
  background: #000;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

/* Контейнер видео */
.modal-video-container {
  position: relative;
  width: 1440px;
  height: 680px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Само видео */
.modal-video-frame {
  width: 1440px;
  height: 680px;
  border: none;
  border-radius: 8px;
}

/* Крестик */
.modal-video-close {
  position: absolute;
  top: -40px;       /* Крестик над видео */
  right: -40px;     /* Крестик выходит за пределы */
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: #ffffffd0;
  color: black;
  font-size: 22px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-video-close:hover {
  background: white;
}

.video-wrapper {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 */
  border-radius: 12px;
  overflow: hidden;
}

.video-wrapper iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

/* ——————————————————————————————
   Кнопки действий ("Трейлер", "О фильме", лайк, обновить)
—————————————————————————————— */

.movie-actions {
  display: flex;
  gap: 16px;
  align-items: center;
}

.movie-actions-wrap {
  display: flex;
  gap: 16px;
}



.movie-actions__btn {
  padding: 16px 48px;
  border-radius: 28px;
  background: #393b3c;
  border: 1px solid #ffffff40;
  color: #fff;
  cursor: pointer;
  transition: 0.2s ease;
  font-size: 18px;
  font-weight: 700;
}

.movie-actions__btn--active {
  background: #67a5eb;
  border: 1px solid #ffffff80;
  color: #fff;
}

.movie-actions__btn:hover {
  background: #ffffff40;
}


@media (max-width: 1280px) {
  .movie-actions {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .movie-actions__btn {
    width: 80%;
  }

 
}
.movie-actions__icon-btn {
  width: 68px;
  height: 56px;
  border-radius: 28px;
  border: 1px solid #ffffff40;
  background: #393b3c;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  transition: 0.2s ease;
}

.movie-actions__icon-btn:hover {
  background: #ffffff40;
}

.movie-actions__icon {
  width: 22px;
  height: 22px;
}


/* Убираем дефолтные отступы у p */
p {
  margin: 0;
}

.movie-actions-row {
    display: flex;
    align-items: center;
    width: 100%;
    gap: 12px;
  }

/* ================================
   TABLET / SMALL DESKTOP (768–1024)
================================ */
@media (max-width: 1024px) and (min-width: 481px) {

  .movie-container {
    flex-direction: column-reverse;
    gap: 32px;
  }

  /* ---------- ТЕКСТ ---------- */
  .movie-info {
    width: 100%;
  }

  .movie-info__title {
    font-size: 36px;
    margin-bottom: 12px;
  }

  .movie-info__overview {
    font-size: 18px;
    line-height: 26px;
    margin-bottom: 40px;
  }

  /* ---------- МЕТАДАННЫЕ ---------- */
  .movie-info__meta {
    gap: 12px;
    flex-wrap: wrap;
  }

  .movie-meta__year,
  .movie-meta__genres,
  .movie-meta__runtime {
    font-size: 16px;
  }

  .movie-rating__value {
    font-size: 16px;
  }

  /* ---------- ПОСТЕР ---------- */
  .movie-poster {
  width: 100%;
  display: flex;
  justify-content: center;
}

.movie-poster img {
  width: 100%;
  max-width: 100%;
  height: auto;
  aspect-ratio: 16 / 9; /* или 2 / 3 — если постер вертикальный */
  object-fit: cover;
  border-radius: 12px;
}

  /* ---------- КНОПКИ ---------- */
   .movie-actions {
    display: flex !important;
    flex-direction: row !important;
    flex-wrap: nowrap !important;
    align-items: center;
    justify-content: flex-start;
    gap: 12px;
    width: 100%;
  }

  /* .movie-actions__btn,
  .movie-actions__icon-btn {
    flex: 0 0 auto !important;
    width: auto !important;
    min-width: unset !important;
    white-space: nowrap;
  } */

  .movie-actions__btn {
  flex: 1 1 auto;   /* растягивается */
   min-width: 180px; /* контроль */
  text-align: center;

  display: inline-flex;
  justify-content: center;

  white-space: nowrap;   /* ❗ запрещаем перенос */     /* ❗ хватает для "О фильме" */
  padding: 14px 32px;
}

.movie-actions__icon-btn {
  flex: 0 0 56px;   /* иконка фиксированная */
}

  .movie-actions__icon-btn {
    width: 56px;
    height: 48px;
    border-radius: 24px;
  }

  .movie-actions__icon {
    width: 20px;
    height: 20px;
  }

  /* ---------- ТРЕЙЛЕР МОДАЛКА ---------- */
  .modal-video-container {
    width: 90vw;
    height: auto;
    max-width: 960px;
  }

  .modal-video-frame {
    width: 100%;
    height: auto;
    aspect-ratio: 16 / 9;
    border-radius: 12px;
  }

  .modal-video-close {
    top: -32px;
    right: -32px;
  }
}

/* ================================
      АДАПТИВ ДЛЯ 375px
================================ */
@media (max-width: 480px) {

  .movie-container {
    flex-direction: column-reverse;
    align-items: center;
    gap: 24px;
  }

  /* Постер на весь экран */
  .movie-poster {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .movie-poster img {
    width: 100%;
    max-width: 100%;
    max-height: 420px;
    border-radius: 12px;
    object-fit: cover;
  }

  /* Текст */
  .movie-info {
    width: 100%;
  }

  .movie-info__title {
    font-size: 26px;
    line-height: 1.2;
    margin-bottom: 12px;
  }

  .movie-info__overview {
    font-size: 16px;
    line-height: 22px;
    margin-bottom: 32px;
  }

  /* Метаданные */
  .movie-info__meta {
    gap: 10px;
    flex-wrap: wrap;
  }

  .movie-rating {
    padding: 4px 10px;
    border-radius: 12px;
  }

  .movie-rating__icon {
    width: 14px;
    height: 14px;
  }

  .movie-rating__value {
    font-size: 14px;
  }

  .movie-meta__year,
  .movie-meta__genres,
  .movie-meta__runtime {
    font-size: 14px;
  }

  /* ------------------------------- */
  /*       КНОПКИ (адаптив)         */
  /* ------------------------------- */

  /* Весь блок делаем вертикальным:  
     1) сверху — кнопка ТРЕЙЛЕР  
     2) ниже — строка с тремя кнопками */
  .movie-actions {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 16px;
  }

  /* Трейлер — 100% ширины */
  .movie-actions__btn--active {
    width: 100%;
    padding: 16px 0;
    font-size: 18px;
    border-radius: 24px;
  }

    /* Когда открыт блок "О фильме" —
     Трейлер + Сердечко в одну линию */
   /* Когда открыт "О фильме" — используем GRID */
  .movie-actions--about-open {
    display: grid;
    grid-template-columns: 4fr 1fr; /* ≈ 80% / 20% */
    gap: 12px;
    align-items: center;
  }

  /* Трейлер — на всю свою колонку */
  .movie-actions--about-open .movie-actions__btn--active {
    width: 100%;
    padding: 14px 0;
    font-size: 16px;
    border-radius: 22px;
  }

  /* Сердечко — центрируем */
  .movie-actions--about-open .movie-actions__icon-btn {
    width: 52px;
    height: 52px;
    justify-self: center;
  }

  /* Строка из трёх кнопок */
  .movie-actions-row {
    justify-content: space-between;
  }

  /* "О фильме" — расширяем */
  .movie-actions__btn {
    flex: 1;
    padding: 14px 0;
    font-size: 16px;
    border-radius: 22px;
  }

  /* Иконки справа */
  .movie-actions__icon-btn {
    width: 52px;
    height: 52px;
    border-radius: 22px;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  .movie-actions__icon {
    width: 20px;
    height: 20px;
  }

   /* Затемнение */
  .modal-overlay {
    padding: 16px;
  }

  /* Контейнер видео */
  .modal-video-container {
    width: 100%;
    height: auto;
    max-width: 100%;
  }

  /* Видео — адаптивное 16:9 */
  .modal-video-frame {
    width: 100%;
    height: auto;
    aspect-ratio: 16 / 9;
    border-radius: 12px;
  }

  /* Крестик — ВНУТРИ видео */
  .modal-video-close {
    top: 8px;
    right: 8px;
    width: 36px;
    height: 36px;
    font-size: 18px;
    background: rgba(255, 255, 255, 0.9);
  }

  
}

@media (max-width: 565px) {

  .movie-actions {
    display: flex !important;
    flex-direction: row !important;
    flex-wrap: wrap !important;   /* ❗ РАЗРЕШАЕМ перенос */
    justify-content: flex-start;
    gap: 12px;
  }

  /* КНОПКА ТРЕЙЛЕР — ВСЯ ПЕРВАЯ СТРОКА */
  .movie-actions__btn--trailer {
    flex: 0 0 100% !important;
    max-width: 100% !important;
  }

  /* ОСТАЛЬНЫЕ КНОПКИ — ВТОРАЯ СТРОКА */
  .movie-actions__btn:not(.movie-actions__btn--trailer),
  .movie-actions__icon-btn {
    flex: 0 0 auto !important;
  }
}




</style>


