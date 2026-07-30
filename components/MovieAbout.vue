<script setup lang="ts">
// PROPS
const props = defineProps({
  movie: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <div class="about">
    <h2 class="about__title">О фильме</h2>

    <div class="about__row">
      <span class="label">Язык оригинала</span>
      <span class="dots"></span>
      <span class="value">{{ props.movie.language || '—' }}</span>
    </div>

    <div class="about__row">
      <span class="label">Бюджет</span>
      <span class="dots"></span>
      <span class="value">
        {{ props.movie.budget ? props.movie.budget + ' руб.' : '—' }}
      </span>
    </div>

    <div class="about__row">
      <span class="label">Выручка</span>
      <span class="dots"></span>
      <span class="value">
        {{ props.movie.revenue ? props.movie.revenue + ' руб.' : '—' }}
      </span>
    </div>

    <div class="about__row">
      <span class="label">Режиссёр</span>
      <span class="dots"></span>
      <span class="value">{{ props.movie.director || '—' }}</span>
    </div>

    <div class="about__row">
      <span class="label">Продакшен</span>
      <span class="dots"></span>
      <span class="value">{{ props.movie.production || '—' }}</span>
    </div>

    <div class="about__row">
      <span class="label">Награды</span>
      <span class="dots"></span>
      <span class="value">{{ props.movie.awards || '—' }}</span>
    </div>
  </div>
</template>


<style scoped>
.about {
  width: 50%;
  margin-top: 40px;
  color: #fff;
}

.about__title {
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 40px;
}

.about__row {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;

  font-size: 22px;
  margin-bottom: 28px;
}

.label {
  opacity: 0.8;
}

.value {
  opacity: 1;
  font-weight: 500;
}

.dots {
  border-bottom: 1px dotted #ffffff40;
  margin: 0 12px;
}

@media (max-width: 768px) {
  .about {
    width: 100%;
    margin-top: 24px;
  }

  .about__title {
    font-size: 28px;
    margin-bottom: 24px;
  }

  .about__row {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    font-size: 18px;
    margin-bottom: 20px;
  }

  .dots {
    display: none;
  }

  .label {
    font-size: 14px;
    opacity: 0.6;
    margin-bottom: 4px;
  }

  .value {
    font-size: 20px;
    font-weight: 600;
  }
}
</style>
