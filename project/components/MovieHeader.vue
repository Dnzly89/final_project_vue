<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

import { useFavoritesStore } from "~/stores/favorites.store";
import { useAuthStore } from "~/stores/auth.store";
import { useUIStore } from "~/stores/ui.store";
import { genresRu } from "~/utils/genres";

const router = useRouter();

const favorites = useFavoritesStore();
const auth = useAuthStore();
const ui = useUIStore();

// PROPS
const props = defineProps<{
  movie: any
}>();

// -------------------- ТРЕЙЛЕР --------------------
const isTrailerOpen = ref(false);

const embedTrailerUrl = computed(() => {
  if (!props.movie?.trailerUrl) return null;

  const url = props.movie.trailerUrl;

  if (url.includes("watch?v=")) {
    return `https://www.youtube.com/embed/${url.split("v=")[1]}`;
  }

  if (url.includes("youtu.be")) {
    return `https://www.youtube.com/embed/${url.split("youtu.be/")[1]}`;
  }

  return url;
});

// -------------------- HELPERS --------------------
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

function truncateText(text: string, length = 220) {
  return text?.length > length ? text.slice(0, length) + "…" : text;
}

// -------------------- ACTIONS --------------------
function goBack() {
  router.back();
}

function toggleFavorite() {
  if (!auth.isAuth) {
    ui.openLoginModal();
    return;
  }

  favorites.toggle(props.movie.id);
}
</script>

<template>
  <section class="movie-header">

    <!-- Назад -->
    <button class="back-btn" @click="goBack">
        <img src="/icons/back.svg" />
        <span class="movie-header-back">Назад</span>
     
    </button>

    <!-- Трейлер -->
    <div v-if="isTrailerOpen" class="modal-overlay" @click="isTrailerOpen = false">
      <div class="modal-video-container" @click.stop>
        <button class="modal-video-close" @click="isTrailerOpen = false">✕</button>
        <iframe
          class="modal-video-frame"
          :src="embedTrailerUrl + '?autoplay=1'"
          allow="autoplay; encrypted-media"
          allowfullscreen
        />
      </div>
    </div>

    <div class="movie-header__content">

      <!-- Левая часть -->
      <div class="movie-info">

        <div class="movie-info__meta">
          <div class="movie-rating" :class="getRatingClass(props.movie.tmdbRating)">
            ⭐ {{ props.movie.tmdbRating?.toFixed(1) ?? "—" }}
          </div>

          <span>{{ props.movie.releaseYear }}</span>
          <span>{{ getGenresRuList(props.movie.genres).join(", ") }}</span>
          <span>{{ minutesToHours(props.movie.runtime) }}</span>
        </div>

        <h1 class="movie-title">{{ props.movie.title }}</h1>

        <p class="movie-overview">
          {{ truncateText(props.movie.plot) }}
        </p>

        <div class="movie-actions">
          <button class="btn btn-primary" @click="isTrailerOpen = true">
            Трейлер
          </button>

          <button class="btn-icon" @click="toggleFavorite">
            <img
              :src="favorites.isFavorite(props.movie.id)
                ? '/icons/heart-filled.svg'
                : '/icons/heart.svg'"
            />
          </button>
        </div>
      </div>

      <!-- Постер -->
      <div class="movie-poster">
        <img :src="props.movie.posterUrl" :alt="props.movie.title" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.movie-header {
  position: relative;
  padding: 48px 0 80px;
  color: #fff;
}

/* Назад */
.back-btn {
  padding: 0;
  background: none;
  border: none;
  color: #fff;

  font-size: 48px;
  font-weight: 600;

  display: flex;
  align-items: center;

  cursor: pointer;
  opacity: 0.9;
  margin-bottom: 64px;
}

.back-btn:hover {
  opacity: 1;
}

/* Контент */
.movie-header__content {
  max-width: 1400px;
  margin: 0 auto;
  min-height: 584px;
  display: flex;
  gap: 64px;
  align-items: center;
}

/* Левая часть */
.movie-info {
  width: 55%;
}

.movie-info__meta {
  display: flex;
  gap: 16px;
  opacity: 0.8;
  margin-bottom: 16px;
  align-items: center;
}

.movie-rating {
  padding: 4px 10px;
  border-radius: 14px;

  font-size: 14px;
  font-weight: 700;

  display: inline-flex;
  align-items: center;
}

.rating-good { background: #1b7a1b; }
.rating-mid { background: #b3b32d; }
.rating-low { background: #bd160a; }

.movie-title {
  font-size: 56px;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 24px;
}

.movie-overview {
  max-width: 620px;

  font-size: 20px;
  line-height: 30px;

  opacity: 0.75;
  margin-bottom: 48px;
}


/* Кнопки */
.movie-actions {
  display: flex;
  gap: 16px;
}

.btn {
  padding: 14px 40px;
  border-radius: 28px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
}

.btn-primary {
  background: #6ea8ff;
  border: none;
  color: #fff;

  padding: 16px 48px;
  border-radius: 28px;

  font-size: 18px;
  font-weight: 700;
}

.btn-icon {
  width: 68px;
  height: 56px;
  cursor: pointer;
  border-radius: 28px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.2);
}


/* Постер */
.movie-poster {
  width: 45%;
  display: flex;
  justify-content: flex-end;
}

.movie-poster img {
  width: 100%;
 /*  max-width: 680px; */
  height: 33%;

  border-radius: 12px;
  object-fit: cover;

  box-shadow:
    0 20px 40px rgba(0,0,0,0.4),
    0 0 0 1px rgba(255,255,255,0.05);
}


/* Модалка трейлера */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-video-container {
  position: relative;
  width: 80vw;
  max-width: 1200px;
  aspect-ratio: 16 / 9;
}

.modal-video-frame {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  border: none;
}

.modal-video-close {
  position: absolute;
  top: -40px;
  right: -40px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #fff;
  border: none;
  cursor: pointer;
}
</style>
