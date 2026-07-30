<template>
  <div class="movie-search" ref="root">
  
    <input
  :class="['search-input', mobile ? 'mobile' : '']"
  v-model="query"
  type="text"
  placeholder="Поиск..."
  @input="onInput"
  @focus="openList"
  @keydown.down.prevent="focusNext"
  @keydown.up.prevent="focusPrev"
  @keydown.enter.prevent="onEnter"
/>
 <!-- крестик -->
  <button v-if="query && !mobile" class="clear-btn" @click="clearInput">✕</button>

    <div v-if="isOpen" id="search-list" class="search-list" role="listbox">
      <div v-if="loading" class="search-row">Загрузка...</div>
      <div v-else-if="items.length === 0" class="search-row">Ничего не найдено</div>

      <button
        v-for="(item, idx) in items"
        :key="item.id"
        class="search-row"
        :class="{ focused: idx === focusedIndex }"
        @click="select(item)"
        @mousemove="setFocus(idx)"
        role="option"
        :aria-selected="idx === focusedIndex"
      >
        <img
          v-if="item.posterUrl"
          :src="item.posterUrl"
          class="thumb"
          alt=""
        />

        <div class="meta">
          <div class="top-row">
            <span
              v-if="item.tmdbRating"
              class="rating"
              :class="getRatingClass(item.tmdbRating)"
            >
              ★ {{ Number(item.tmdbRating).toFixed(1) }}
            </span>

            <span v-if="item.releaseYear" class="year">
              {{ item.releaseYear }}
            </span>

            <span v-if="item.genres?.length" class="genres">
              {{ item.genres.join(", ") }}
            </span>

            <span v-if="item.runtime" class="runtime">
              {{ item.runtime }} мин
            </span>
          </div>

          <div class="title">{{ item.title }}</div>

        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter, useRuntimeConfig } from "#imports";
import { useMoviesApi } from "~/api/movies.api";
const api = useMoviesApi();


type MovieHit = {
  id: number;
  title: string;
  posterUrl?: string | null;
  releaseYear?: number | null;
  genres?: string[];
  runtime?: number | null;
  tmdbRating?: number | null;
  plot?: string | null;
};

const router = useRouter();
const runtimeConfig = useRuntimeConfig();

const query = ref("");
const items = ref<MovieHit[]>([]);
const loading = ref(false);
const isOpen = ref(false);
const focusedIndex = ref(-1);

let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let abortController: AbortController | null = null;

const MIN_LENGTH = 1;
const DEBOUNCE_MS = 300;
const SUGGEST_LIMIT = 8;

const root = ref<HTMLElement | null>(null);

const openList = () => (isOpen.value = true);

const closeList = () => {
  isOpen.value = false;
  focusedIndex.value = -1;
};

defineProps({
  mobile: {
    type: Boolean,
    default: false
  }
})

const onInput = () => {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(runSearch, DEBOUNCE_MS);
};

const getRatingClass = (rating?: number | null) => {
  if (!rating) return "";
  if (rating >= 7) return "rating-good";
  if (rating >= 5) return "rating-mid";
  return "rating-bad";
};

const clearInput = () => {
  query.value = "";
  items.value = [];
  isOpen.value = false;
};


const runSearch = async () => {
  const q = query.value.trim();
  if (q.length < MIN_LENGTH) {
    items.value = [];
    loading.value = false;
    return;
  }

  if (abortController) abortController.abort();
  abortController = new AbortController();

  loading.value = true;
  isOpen.value = true;
  focusedIndex.value = -1;

  try {
    const res = await api.searchMovies(q, SUGGEST_LIMIT);

    // axios → данные лежат в res.data
    items.value = Array.isArray(res.data) ? res.data : [];

  } catch (e: any) {
    if (!abortController.signal.aborted) {
      console.error("Search error:", e);
      items.value = [];
    }
  } finally {
    loading.value = false;
  }
};


const select = (movie: MovieHit) => {
  router.push(`/movie/${movie.id}`);
  closeList();
};

const onEnter = () => {
  if (focusedIndex.value >= 0 && items.value[focusedIndex.value]) {
    select(items.value[focusedIndex.value]);
  } else if (query.value.trim().length >= MIN_LENGTH) {
    router.push({ path: "/search", query: { q: query.value.trim() } });
    closeList();
  }
};

const focusNext = () => {
  if (!isOpen.value) openList();
  if (!items.value.length) return;
  focusedIndex.value = (focusedIndex.value + 1) % items.value.length;
};

const focusPrev = () => {
  if (!isOpen.value) openList();
  if (!items.value.length) return;
  focusedIndex.value =
    (focusedIndex.value - 1 + items.value.length) % items.value.length;
};

const setFocus = (idx: number) => (focusedIndex.value = idx);

const onClickOutside = (e: MouseEvent) => {
  if (!root.value) return;
  if (e.target instanceof Node && !root.value.contains(e.target)) closeList();
};

onMounted(() => window.addEventListener("click", onClickOutside));
onBeforeUnmount(() => {
  window.removeEventListener("click", onClickOutside);
  if (debounceTimer) clearTimeout(debounceTimer);
  if (abortController) abortController.abort();
});
</script>

<style scoped>
.movie-search {
  position: relative;
  width: 100%;
}

.search-input {
  background: transparent;
  border: none;
  outline: none;
  color: #ffffff;
  width: 100%;
  font-size: 28px;
  font-weight: 400;
  line-height: 56px;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.55);
  font-size: 18px;
  padding: 12px 16px;
}

.rating {
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 12px;
  color: #fff;
}

/* Зелёный */
.rating-good {
  background: #2ecc71;
}

/* Жёлтый */
.rating-mid {
  background: #f1c40f;
  color: #000;
}

/* Красный */
.rating-bad {
  background: #e74c3c;
}


.input-wrapper {
  position: relative;
  width: 100%;
}

.clear-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: rgba(255,255,255,0.2);
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
}

.clear-btn:hover {
  background: rgba(255,255,255,0.35);
}


.search-list {
  position: absolute;
  left: 0;
  right: 0;
  top: calc(100% + 8px);
  background: #393B3C;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(15, 15, 15, 0.12);
  z-index: 40;
  padding: 8px;
  max-height: 420px;
  overflow: auto;
}

.search-row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  background: transparent;
  border: 1px solid transparent; 
  cursor: pointer;
  text-align: left;
  box-sizing: border-box;  
  color:#fff;      
}

.search-row:hover,
.search-row.focused {
  border: 1px solid #ffffff80;
}

.thumb {
  width: 44px;
  height: 66px;
  object-fit: cover;
  border-radius: 6px;

}

.meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: #ffffff;
}

.top-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 12px;
  opacity: 0.8;
}



.year,
.genres,
.runtime {
  color: #ffffff;
}

.title {
  font-weight: 700;
  font-size: 14px;
}

.plot {
  font-size: 12px;
  opacity: 0.75;
  max-height: 36px;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 480px) {

  /* Контейнер результатов */
   .search-list {
       position: fixed;          /* ← КЛЮЧ */
    left: 20px;
    right: 0;

    top: 110px;                /* ← НИЖЕ мобильного поиска */
    /* если высота поиска другая — подстрой */

    background: #393B3C;
    border-radius: 0;

    display: flex;
    gap: 16px;

    overflow-x: auto;
    overflow-y: hidden;

    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
     border-radius: 8px;
    padding: 20px 24px;
    z-index: 999;    
  }

  /* Скрываем скроллбар */
  .search-list::-webkit-scrollbar {
    display: none;
  }

  /* Одна карточка = один свайп */
  .search-row {
    flex: 0 0 75%;
    scroll-snap-align: start;

    flex-direction: column;
    align-items: flex-start;
    gap: 10px;

    border: 1px solid #ffffff22;
    background: #2f3132;
  }

  /* Постер — крупнее */
  .thumb {
    width: 100%;
    height: 220px;
    border-radius: 10px;
  }

  /* Текст */
  .meta {
    width: 100%;
  }

  .title {
    font-size: 16px;
    line-height: 1.2;
  }

  .top-row {
    font-size: 13px;
  }
}


</style>
