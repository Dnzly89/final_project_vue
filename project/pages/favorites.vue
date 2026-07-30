<template>
  <div class="favorites-page">

    <h1 class="title">Мой аккаунт</h1>

    <div class="tabs">
      <NuxtLink to="/favorites" class="tab active">
        <img src="/icons/heart.svg" />
       <span class="tab-text tab-text--desktop">Избранные фильмы</span>
        <span class="tab-text tab-text--mobile">Избранное</span>
      </NuxtLink>

      <NuxtLink to="/account" class="tab">
        <img src="/icons/user-white.svg" />
       <span class="tab-text tab-text--desktop">Настройка аккаунта</span>
        <span class="tab-text tab-text--mobile">Настройки</span>
      </NuxtLink>
    </div>

    <!-- Если не авторизован -->
    <div v-if="!auth.isAuth" class="not-auth">
      <img src="/icons/heart.svg" class="big-heart" />
      <p class="msg">Чтобы просматривать избранные фильмы — войдите в аккаунт</p>
      <button class="login-btn" @click="$router.push('/')">
        Войти
      </button>
    </div>

    <!-- Загружаем -->
    <div v-else-if="favorites.loading" class="loading">
      Загрузка...
    </div>

    <!-- Есть избранные -->
    <div v-else-if="favorites.favorites.length > 0" class="movies-grid">

      <div
  class="movie-card"
  v-for="movie in favorites.favorites"
  :key="movie.id"
  @click="goToMovie(movie.id)"
>
        <div class="poster-wrapper">
  <img :src="movie.posterUrl" class="poster" />
</div>

        <button
  class="remove"
  @click.stop="favorites.toggle(movie.id)"
>
          ✕
        </button>
      </div>

    </div>

    <!-- Нет избранных -->
    <div v-else class="empty">
      <img src="/icons/heart.svg" class="big-heart" />
      <p class="msg">У вас пока нет избранных фильмов</p>
    </div>

  </div>
</template>

<script setup lang="ts">
import { watch, onMounted } from "vue";
import { useAuthStore } from "~/stores/auth.store";
import { useFavoritesStore } from "~/stores/favorites.store";
import { useRouter } from "vue-router";

const router = useRouter();

function goToMovie(id: number) {
  router.push(`/movie/${id}`);
}
const auth = useAuthStore();
const favorites = useFavoritesStore();

onMounted(() => {
  if (auth.isAuth) favorites.loadFavorites();
});

// Следим за авторизацией — как только пользователь вошёл, грузим избранное
watch(
  () => auth.isAuth,
  (isAuth) => {
    if (isAuth) favorites.loadFavorites();
  }
);
</script>

<style scoped>
.favorites-page {
  color: white;
  padding: 40px;
}

.title {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 32px;
}

.tabs {
  display: flex;
  gap: 40px;
  margin-bottom: 40px;
}

.tab {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #ccc;
  font-size: 20px;
  text-decoration: none;
}

.tab.active {
  color: #fff;
  border-bottom: 2px solid #DC5DFC;
  padding-bottom: 6px;
}

.not-auth,
.empty {
  text-align: center;
  margin-top: 80px;
}

.big-heart {
  width: 80px;
  opacity: 0.7;
  margin-bottom: 20px;
}

.msg {
  font-size: 20px;
  margin-bottom: 20px;
}

.login-btn {
  background: #7aa9f7;
  color: white;
  padding: 12px 26px;
  border-radius: 12px;
  font-size: 18px;
  cursor: pointer;
  border: none;
}

.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 32px;
}

.movie-card {
  position: relative;
  background: #1E1E2E;
  padding: 16px;
  border-radius: 20px;
  transition: .25s;
}

.movie-card:hover {
  transform: scale(1.05);
}


.tab-text--mobile {
  display: none;
}
.poster-wrapper {
  width: 100%;
  overflow: hidden;
  border-radius: 12px;
  background: #111;
}

.poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.remove {
  position: absolute;
  top: -12px;
  right: -12px;
  background: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;

  display: flex;
  justify-content: center;
  align-items: center;

  opacity: 0;
  pointer-events: none;
  transition: 0.25s ease;
}

.movie-card:hover .remove {
  opacity: 1;
  pointer-events: auto;
}

/* ================================
   TABLET (481px – 1024px)
================================ */
@media (max-width: 1024px) and (min-width: 481px) {

  .favorites-page {
    padding: 24px;
  }

  .title {
    font-size: 32px;
    margin-bottom: 28px;
  }

  /* ---------- ТАБЫ ---------- */
  .tabs {
    gap: 24px;
    margin-bottom: 32px;
  }

  .tab {
    font-size: 18px;
    gap: 10px;
  }

  .tab img {
    width: 22px;
    height: 22px;
  }

  /* ---------- СЕТКА ФИЛЬМОВ ---------- */
  .movies-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  .movie-card {
    padding: 14px;
    border-radius: 18px;
  }

  .poster {
    height: 260px;
  }

  /* ---------- КНОПКА УДАЛЕНИЯ ---------- */
  .remove {
    opacity: 1;            /* на планшете всегда видна */
    pointer-events: auto;
    top: 6px;
    right: 6px;
    width: 36px;
    height: 36px;
    font-size: 18px;
  }

  /* ---------- ПУСТО / НЕ АВТОРИЗОВАН ---------- */
  .msg {
    font-size: 18px;
  }

  .login-btn {
    font-size: 16px;
    padding: 12px 24px;
  }
}


@media (max-width: 480px) {
  .favorites-page {
  padding: 0;
  }

  .logout {
    width: 100%;
  }

  .title {
  font-size: 24px;
  margin-bottom: 40px;
}

  .tab-text--desktop {
    display: none;
  }

  .tab-text--mobile {
    display: inline;
  }

    .movies-grid {
    display: flex;
    gap: 16px;

    overflow-x: auto;
    overflow-y: hidden;

    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;

    padding-bottom: 10px;
  }

  /* Скрываем скроллбар */
  .movies-grid::-webkit-scrollbar {
    display: none;
  }

  /* Карточка — фиксированной ширины */
  .movie-card {
    flex: 0 0 65%;          /* ← ширина карточки */
    scroll-snap-align: start;
  }

  /* Постер — нормальной высоты */
  .poster {
    height: 300px;
    object-fit: cover;
  }

  /* Кнопка удаления всегда видна */
   .remove {
    display: none;
  }
}


</style>
