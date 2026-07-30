<template>
  <ClientOnly>
    <div class="page-container">
      <AppHeader />

      <main>
        <slot />
      </main>

      <Footer />
    </div>
    <LoginModal />
  </ClientOnly>
    
</template>

<script setup>
  import LoginModal from "~/components/LoginModal.vue";
import AppHeader from "@/components/AppHeader.vue";
import Footer from "@/components/Footer.vue";
</script>

<style>

.page-container {
  min-height: 100vh;      /* растягиваем от края до края экрана */
  display: flex;          /* включаем флекс-контейнер */
  flex-direction: column; /* вертикальная структура */
  
  margin: 0 auto;
  padding: 0 80px;
}

.page-container main {
  flex: 1; /* заставляет main занимать всё свободное пространство */
}

/* адаптивы — остаются как есть */
@media (max-width: 1024px) {
  .page-container {
    padding: 0 50px;
  }
}

@media (max-width: 600px) {
  .page-container {
    padding: 0 20px;
  }
}

</style>
