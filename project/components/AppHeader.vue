<template>
  <header class="header">
    <nav class="nav" :class="{ 'search-open': isMobileSearchOpen }">

      <!-- ЛОГО (Десктоп + Мобайл) -->
      <NuxtLink to="/" class="logo">
        <img src="/icons/logo.svg" alt="Logo" />
      </NuxtLink>

      <!-- ===== ДЕСКТОПНАЯ ЧАСТЬ ===== -->
      <div class="nav-content desktop-only">
        <ul class="menu">
          <li><NuxtLink to="/">Главная</NuxtLink></li>
          <li><NuxtLink to="/genres">Жанры</NuxtLink></li>
        </ul>

        <div class="search-wrapper header-search">
          <img src="/icons/search.svg" alt="search icon" class="search-icon" />
          <MovieSearch />
        </div>
      </div>

      <!-- ДЕСКТОП PROFIL / LOGIN -->
      <button 
        @click="ui.openLoginModal()" 
        class="login-btn desktop-only" 
        v-if="!auth.isAuth">
        Войти
      </button>

      <NuxtLink v-else to="/account" class="login-btn user-link desktop-only">
        {{ auth.user?.surname || auth.user?.name }}
      </NuxtLink>

      <!-- ===== МОБИЛЬНЫЕ ИКОНКИ ===== -->
      <div class="mobile-icons">
       <NuxtLink to="/genres" class="mi-btn">
        <img src="/icons/grid.svg" />
      </NuxtLink>

        <button class="mi-btn search-toggle" @click="openMobileSearch">
          <img src="/icons/search-mobile.svg" />
        </button>

        <!-- МОБИЛЬНАЯ ИКОНКА ПОЛЬЗОВАТЕЛЯ -->
      <button
        v-if="!auth.isAuth"
        class="mi-btn"
        @click="ui.openLoginModal()"
      >
        <img src="/icons/user-white.svg" />
      </button>

      <NuxtLink
        v-else
        to="/account"
        class="mi-btn"
      >
        <img src="/icons/user-white.svg" />
      </NuxtLink>
      </div>

    </nav>

    <!-- ===== Мобильная поисковая строка ===== -->
    <div v-if="isMobileSearchOpen" class="mobile-search-full">
      <img src="/icons/search.svg" class="mobile-search-icon" />

      <MovieSearch mobile />
      
      <button class="mobile-search-close" @click="closeMobileSearch">✕</button>
    </div>

  </header>
</template>
<script setup lang="ts">
import { ref, nextTick } from "vue";
import { useAuthStore } from "~/stores/auth.store";
import { useRouter } from "vue-router";
import { useUIStore } from "~/stores/ui.store";
import MovieSearch from "~/components/MovieSearch.vue";

const auth = useAuthStore();
const ui = useUIStore();
const router = useRouter();

/* MOBILE SEARCH STATE */
const isMobileSearchOpen = ref(false);
const mobileSearchInput = ref<HTMLInputElement | null>(null);

const openMobileSearch = async () => {
  isMobileSearchOpen.value = true;
  await nextTick();
  mobileSearchInput.value?.focus(); // авто-фокус → клавиатура открывается
};

const closeMobileSearch = () => {
  isMobileSearchOpen.value = false;
};
</script>


<style scoped>
/* ---------- DESKTOP (твои стили — НЕ ТРОГАЛ) ---------- */

.header {
  width: 100%;
  padding: 16px 0;
  backdrop-filter: blur(8px);
 /*  position: sticky; */
  top: 0;
  z-index: 50;
}

.nav {
  padding: 0;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: 100%;
  gap: 32px;
}

.logo {
  display: flex;
  align-items: center;
}

.logo img {
  height: 40px;
  width: auto;
}

.nav-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  flex: 1;
}

.menu {
  display: flex;
  gap: 24px;
  list-style: none;
}

.menu a {
  font-size: 24px;
  color: #ccc;
  text-decoration: none;
}

.menu a.router-link-active {
  color: #fff;
  font-weight: 700;
  border-bottom: 1.5px solid #DC5DFC;
  padding-bottom: 8px;
}

.search-wrapper {
  display: flex;
   min-width: 245px;
  align-items: center;
  gap: 8px;
  background: #1e1e1e;
  padding: 8px 12px;
  height: 48px;
  border-radius: 8px;
  flex: 1;
  max-width: 656px;
  box-sizing: border-box;
}

.search-wrapper .search-input {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  font-size: 18px;
}

.login-btn,
.user-link {
  font-family: Play;
  background: transparent;
  font-size: 24px;
  color: #fff;
  border: none;
  cursor: pointer;
}

.mobile-icons {
  display: none;
  align-items: center;
  gap: 20px;
}


.header-search {
  flex: 1;
  max-width: 656px;
}


/* ---------- SMALL DESKTOP / LARGE TABLET (≤ 810px) ---------- */
@media (max-width: 810px) {

  /* скрываем текстовое меню */
  .menu {
    display: none;
  }

  /* прячем desktop-кнопку входа */
  .login-btn {
    display: none;
  }

  /* nav — один ряд */
  .nav {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  /* иконки (жанры + профиль) */
  .mobile-icons {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  /* показываем поиск */
  .nav-content {
    display: flex !important;
    flex: 1;
  }

  .search-wrapper {
    flex: 1;
    max-width: 100%;
  }

  /* скрываем ТОЛЬКО лупу */
  .search-toggle {
    display: none;
  }
}


/* ---------- TABLET (768px – 1024px) ---------- */
@media (max-width: 1024px) and (min-width: 768px) {

  .nav {
    padding: 0 ;
    gap: 24px;
  }

  .menu {
    gap: 16px;
  }

  .menu a {
    font-size: 18px;
  }

  .nav-content {
    gap: 24px;
  }

  .search-wrapper {
    max-width: 420px;
    height: 44px;
  }

  .search-wrapper .search-input {
    font-size: 16px;
  }

  .login-btn,
  .user-link {
    font-size: 18px;
  }

  /* ❗ мобильные иконки не показываем */
 /*  .mobile-icons {
    display: none;
  } */
}

.mi-btn {
  background: transparent;
  border: none;
}

.mi-btn img {
  width: 24px;
  height: 24px;
}

/* Мобильный поиск */
.mobile-search-full {
  display: none;
}

/* ---------- MOBILE ---------- */

/* ----- Адаптив ----- */
@media (max-width: 680px) {

  .nav {
    padding: 0;
    gap: 0;
    justify-content: space-between;
  }

  .desktop-only
 {
    display: none !important;
  }


  .logo img {
    height: 32px;
    width: 81px;
  }

  .mobile-icons  {
    display: flex;
  }

.nav-content {
    display: flex !important;
    flex: 1;
  }

  .menu,
  .login-btn {
    display: none;
  }

  .search-wrapper {
    flex: 1;
    max-width: 90%;
    height: 44px;
    margin-right: 20px;
  }


  /* ПОИСК ПОВЕРХ */
  .mobile-search-full {
    display: flex;
    align-items: center;
    background: #1e1e1e;
    
    padding: 12px 16px;
    border-radius: 12px;
    gap: 12px;
    margin: 10px 16px 0 16px;
    height: 48px;
  }

  .mobile-search-icon {
    width: 22px;
    opacity: 0.8;
  }

  .mobile-search-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    font-size: 16px;
    color: white;
    line-height: 48px; /* placeholder идеально по центру */
  }

  .mobile-search-close {
    background: transparent;
    border: none;
    color: white;
    font-size: 22px;
  }

.search-open .logo,
.search-open .mobile-icons,
.search-open .login-btn,
.search-open .user-link,
.search-open .nav-content {
  display: none !important;
}

/* Делаем nav маленьким, чтобы не занимал место */
.search-open {
  padding: 0;
}
}


@media (max-width: 480px) {

  /* скрываем поисковую строку */
  .search-wrapper {
    display: none !important;
  }

  /* показываем иконку поиска */
  .search-toggle {
    display: inline-flex !important;
  }

}
</style>

