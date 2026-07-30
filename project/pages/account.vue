<template>
  <div class="account-page">
    <h1 class="title">Мой аккаунт</h1>

    <div class="tabs">
      <NuxtLink to="/favorites" class="tab">
        <img src="/icons/heart.svg" />
        <span class="tab-text tab-text--desktop">Избранные фильмы</span>
        <span class="tab-text tab-text--mobile">Избранное</span>
      </NuxtLink>

      <NuxtLink to="/account" class="tab active">
        <img src="/icons/user-white.svg" />
        <span class="tab-text tab-text--desktop">Настройка аккаунта</span>
        <span class="tab-text tab-text--mobile">Настройки</span>
      </NuxtLink>
    </div>

    <div class="card">
      <div class="row">
        <div class="icon-circle avatar">{{ initials }}</div>

        <div>
          <p class="label">Имя Фамилия</p>
          <p class="value">{{ fullName }}</p>
        </div>
      </div>

      <div class="row">
        <div class="icon-circle">
        <img src="/icons/mail-white.svg" alt="email" />
        </div>

        <div>
          <p class="label">Электронная почта</p>
          <p class="value">{{ user?.email }}</p>
        </div>
      </div>

      <button class="logout" @click="logoutUser">Выйти из аккаунта</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { navigateTo } from "#app";
import { computed } from "vue";
import { useAuthStore } from "~/stores/auth.store";

const auth = useAuthStore();

const user = computed(() => auth.user);

const fullName = computed(() =>
  `${user.value?.name ?? ""} ${user.value?.surname ?? ""}`.trim()
);

const initials = computed(() => {
  const n = user.value?.name?.[0] ?? "";
  const s = user.value?.surname?.[0] ?? "";
  return (n + s).toUpperCase();
});

const logoutUser = async () => {
  await auth.logout();
  navigateTo("/");
};
</script>

<style scoped>
.account-page {
  color: #fff;
  width: 100%;
  padding: 40px;
}

.title {
  font-size: 48px;
  font-weight: 700;
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
  text-decoration: none;
  font-size: 20px;
}
.tab-text--mobile {
  display: none;
}



.tab.active {
  color: #fff;
  border-bottom: 2px solid #DC5DFC;
  padding-bottom: 8px;
}



.card {
  background: #1E1E2E;
  padding: 32px;
  border-radius: 16px;
  max-width: 600px;
}

.row {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;
}

.icon-circle {
  width: 64px;
  height: 64px;
  background: #666;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding:18px ;
}

.icon-circle img {
  width: 32px; /* чтобы иконка была по центру и красивого размера */
  height: 32px;
}

.avatar {
  font-weight: 700;
  font-size: 22px;
  color: #fff;
}

.label {
  font-size: 16px;
  color: #aaa;
}

.value {
  font-size: 20px;
  font-weight: 600;
}

.logout {
  margin-top: 20px;
  padding: 14px 28px;
  background: #7aa9f7;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  cursor: pointer;
}

.logout:hover {
  background: #6b97e0;
}

/* ================================
   TABLET (481px – 1024px)
================================ */
@media (max-width: 1024px) and (min-width: 481px) {

  .account-page {
    padding: 24px;
  }

  .title {
    font-size: 32px;
    margin-bottom: 24px;
  }

  /* ---------- ТАБЫ ---------- */
  .tabs {
    gap: 24px;
    margin-bottom: 32px;
  }

  .tab {
    font-size: 16px;
    gap: 8px;
  }

  .tab img {
    width: 20px;
    height: 20px;
  }

  /* ---------- КАРТОЧКА ---------- */
  .card {
    padding: 24px;
    max-width: 520px;
  }

  .row {
    gap: 16px;
    margin-bottom: 24px;
  }

  .icon-circle {
    width: 56px;
    height: 56px;
  }

  .avatar {
    font-size: 20px;
  }

  .label {
    font-size: 14px;
  }

  .value {
    font-size: 18px;
  }

  /* ---------- КНОПКА ---------- */
  .logout {
    font-size: 16px;
    padding: 12px 24px;
    border-radius: 10px;
  }
}


@media (max-width: 480px) {
  .account-page {
  padding: 0;
  }

.icon-circle {
  width: 48px;
  height: 48px;
 padding: 0;
}

.label {
  font-size: 16px;
  color: #aaa;
}

.value {
  font-size: 18px;
  font-weight: 600;
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
}
</style>
