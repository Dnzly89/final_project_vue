<template>
  <div class="page-background">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
.page-background {
  min-height: 100vh;
  background: linear-gradient(
    180deg,
    #0c0f17 0%,
    #1f2739 40%,
    #353648 100%
  );
}
</style>

<script setup lang="ts">
import { useHead } from '#app';
import { useAuthStore } from "~/stores/auth.store";
import { onMounted } from "vue";



const auth = useAuthStore();

// ЗАПУСКАЕМ ТОЛЬКО НА КЛИЕНТЕ
onMounted(async () => {
  try {
    await auth.loadProfile();
  } catch {}
});
</script>
