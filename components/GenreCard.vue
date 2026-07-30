<script setup lang="ts">
const props = defineProps({
  genre: Object,   // genre.title мы будем использовать
  slug: String
});

const emit = defineEmits(["selectGenre"]);

function clickHandler() {
  emit("selectGenre", props.slug, props.genre.title);
}
</script>

<template>
  <div class="genre-card" @click="clickHandler">
    <img :src="genre.image" class="genre-card__img" />
    <h3 class="genre-card__title">{{ genre.title }}</h3>
  </div>
</template>

<style scoped>
.genre-card {
  background: #1f1f1f;
  border-radius: 16px;
  padding: 16px;
  border: 1px solid #ffffff22;
  transition: 0.25s;
  text-align: center;
  cursor: pointer;

  height: 304px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.genre-card:hover {
  transform: scale(1.05);
  background: #292929;
}

.genre-card__img {
  width: 100%;
  height: 80%;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 12px;
}

.genre-card__title {
  font-size: 20px;
  margin: 0;
}

@media (max-width: 480px) {

}
</style>
