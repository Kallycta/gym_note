<script setup lang="ts">
import { ref, inject, onMounted, computed } from 'vue'
import { useNavigationStack } from '@/composables/useNavigationStack'
import { exercises as allExercises } from '@/data/exercises'
import { workoutStore } from '@/stores/workoutStore'

// --- Types ---
export interface ExerciseItem {
  id: number
  title: string
  subtitle?: string
  iconId?: string
  tags?: string[]
}

// --- Props & Emits ---
const props = defineProps<{
  title: string
  exercises?: ExerciseItem
}>()

const emit = defineEmits<{
  (e: 'select-exercise', exercise: ExerciseItem): void
  (e: 'close'): void
}>()

// --- Navigation ---
const goBack = inject<() => void>('goBack')
const navigateForward = inject<(pageName: string, params?: any, transition?: string) => Promise<void>>('navigateForward')

// --- Animation state ---
const isVisible = ref(false)
const isLeaving = ref(false)
const ready = ref(false)

// --- Navigation transition ---
const navigation = useNavigationStack()
const currentPage = navigation.currentPage.value
const transition = currentPage?.transition || 'none'

const isSlideLeft = computed(() => transition === 'slide-left')
const isSlideUp = computed(() => transition === 'slide-bottom' || transition === 'slide-up')
const isNone = computed(() => transition === 'none')

// --- Filter state ---
const selectedFilter = ref<string | null>(null)
const searchQuery = ref('')
const isSearchOpen = ref(false)

// --- Get exercises by category ---
const categoryExercises = computed(() => {
  const category = props.title
  if (!category) return []
  
  return allExercises
    .filter(ex => ex.category === category)
    .map(ex => ({
      id: ex.id,
      title: ex.name,
      subtitle: ex.tags.join(', '),
      iconId: undefined,
      tags: ex.tags
    }))
})

const displayExercises = computed(() => {
  const exercises = props.exercises && props.exercises.length > 0 
    ? props.exercises 
    : categoryExercises.value
  
  let filtered = exercises
  
  // Фильтрация по тегу
  if (selectedFilter.value) {
    filtered = filtered.filter(exercise => {
      if (!exercise.tags) return false
      return exercise.tags.some(tag => tag.toLowerCase() === selectedFilter.value?.toLowerCase())
    })
  }
  
  // Фильтрация по поиску
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(exercise => {
      return (
        exercise.title.toLowerCase().includes(query) ||
        (exercise.subtitle && exercise.subtitle.toLowerCase().includes(query)) ||
        (exercise.tags && exercise.tags.some(tag => tag.toLowerCase().includes(query)))
      )
    })
  }
  
  return filtered
})

// --- Lifecycle ---
onMounted(() => {
  if (transition !== 'none') {
    requestAnimationFrame(() => {
      ready.value = true
      requestAnimationFrame(() => {
        isVisible.value = true
      })
    })
  } else {
    ready.value = true
    isVisible.value = true
  }
})

// --- Methods ---
function handleClose() {
  emit('close')
  isLeaving.value = true
  isVisible.value = false

  if (transition !== 'none') {
    setTimeout(() => {
      goBack?.()
    }, 350)
  } else {
    goBack?.()
  }
}

function handleExerciseClick(exercise: ExerciseItem) {
  workoutStore.addExercise({
    id: exercise.id,
    name: exercise.title,
    category: props.title
  })
}

function handleFilterClick(filterName: string) {
  selectedFilter.value = selectedFilter.value === filterName ? null : filterName
}

function toggleSearch() {
  isSearchOpen.value = !isSearchOpen.value
  if (!isSearchOpen.value) {
    searchQuery.value = ''
  }
}

function clearSearch() {
  searchQuery.value = ''
}

function isSelected(id: number) {
  return workoutStore.isExerciseSelected(id)
}
</script>

<template>
<div
class="exercise-list-screen"
:class="{
'exercise-list-ready': ready,
'exercise-list-visible': isVisible,
'exercise-list-leaving': isLeaving,
'slide-left-mode': isSlideLeft,
'slide-up-mode': isSlideUp,
'none-mode': isNone
}"
>
<div class="content-sheet">
<!-- Хедер страницы -->
<div class="header">
<h2 class="page-title">{{ title }}</h2>
<div class="header-actions">
<button class="icon-btn" aria-label="Добавить">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
</button>
<button class="icon-btn" aria-label="Поиск" @click="toggleSearch">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
</button>
</div>
</div>

<!-- Поиск -->
<div v-if="isSearchOpen" class="search-container">
<div class="search-input-wrapper">
<svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
<input 
  v-model="searchQuery" 
  type="text" 
  class="search-input" 
  placeholder="Поиск упражнений..."
  autofocus
/>
<button v-if="searchQuery" class="clear-btn" @click="clearSearch" aria-label="Очистить">
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
</button>
</div>
</div>

<!-- Фильтры и теги -->
<div class="tags-container">
  <div class="tag-group">
    <span 
      class="tag" 
      :class="{ active: selectedFilter === 'середина' }"
      @click="handleFilterClick('середина')"
    >Середина</span>
    <span 
      class="tag"
      :class="{ active: selectedFilter === 'верх' }"
      @click="handleFilterClick('верх')"
    >Верх</span>
    <span 
      class="tag"
      :class="{ active: selectedFilter === 'низ' }"
      @click="handleFilterClick('низ')"
    >Низ</span>
    <span 
      class="tag"
      :class="{ active: selectedFilter === 'свой вес' }"
      @click="handleFilterClick('свой вес')"
    >Свой вес</span>
  </div>
  <div class="tag-group">
    <span 
      class="tag"
      :class="{ active: selectedFilter === 'штанга' }"
      @click="handleFilterClick('штанга')"
    >Штанга</span>
    <span 
      class="tag"
      :class="{ active: selectedFilter === 'гантель x1' }"
      @click="handleFilterClick('гантель x1')"
    >Гантель x1</span>
    <span 
      class="tag"
      :class="{ active: selectedFilter === 'гантель x2' }"
      @click="handleFilterClick('гантель x2')"
    >Гантели x2</span>
    <span 
      class="tag"
      :class="{ active: selectedFilter === 'трос' }"
      @click="handleFilterClick('трос')"
    >Трос</span>
  </div>
  <div class="tag-group">
    <span 
      class="tag"
      :class="{ active: selectedFilter === 'тренажер' }"
      @click="handleFilterClick('тренажер')"
    >Тренажер</span>
    <span 
      class="tag"
      :class="{ active: selectedFilter === 'другое' }"
      @click="handleFilterClick('другое')"
    >Другое</span>
  </div>
</div>

<!-- Список упражнений -->
<div class="list-container">
<div
v-for="exercise in displayExercises"
:key="exercise.id"
class="list-item"
:class="{ selected: isSelected(exercise.id) }"
@click="handleExerciseClick(exercise)"
>
<div class="item-left">
<div class="item-image-placeholder">
<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
<path d="M5 16 L10 10 L14 14 L19 9" />
<rect x="2" y="18" width="20" height="4" rx="1" />
</svg>
</div>
<div class="item-text">
<span class="item-title">{{ exercise.title }}</span>
<span class="item-subtitle">· {{ exercise.subtitle }}</span>
</div>
</div>

<div class="item-right">
<button class="item-more-btn" @click.stop>
<svg width="4" height="16" viewBox="0 0 4 16" fill="currentColor"><circle cx="2" cy="2" r="2"/><circle cx="2" cy="8" r="2"/><circle cx="2" cy="14" r="2"/></svg>
</button>
</div>
</div>
</div>

<!-- Кнопка "Закрыть" -->
<div class="fab-wrapper">
<button class="fab-close" @click="handleClose">ЗАКРЫТЬ</button>
</div>
</div>
</div>
</template>

<style scoped>
/* Обертка */
.exercise-list-screen {
position: absolute;
inset: 0;
display: flex;
align-items: flex-end;
transition: none;
background: #f5f6f8;
z-index: 10;
}

.slide-up-mode { transform: translateY(100%); }
.exercise-list-ready.slide-up-mode { transition: transform 0.35s cubic-bezier(0.2, 0.0, 0.2, 1.0); }
.exercise-list-visible.slide-up-mode { transform: translateY(0); }
.exercise-list-leaving.slide-up-mode { transform: translateY(100%); }

.slide-left-mode { align-items: stretch; transform: translateX(100%); }
.exercise-list-ready.slide-left-mode { transition: transform 0.35s cubic-bezier(0.2, 0.0, 0.2, 1.0); }
.exercise-list-visible.slide-left-mode { transform: translateX(0); }
.exercise-list-leaving.slide-left-mode { transform: translateX(100%); }

.none-mode { align-items: stretch; transform: none; }
.exercise-list-ready.none-mode { transition: none; }
.exercise-list-visible.none-mode { transform: none; }
.exercise-list-leaving.none-mode { transform: none; }

.content-sheet {
position: relative;
width: 100%;
height: 100%;
background: #f5f6f8;
padding: 20px 16px 80px;
overflow-y: auto;
box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
display: flex;
flex-direction: column;
}

/* Хедер */
.header {
display: flex;
justify-content: space-between;
align-items: center;
margin-bottom: 20px;
flex-shrink: 0;
}

.page-title {
font-size: 24px;
font-weight: 500;
color: #1a1a1a;
margin: 0;
}

.header-actions {
display: flex;
gap: 16px;
}

.icon-btn {
background: none;
border: none;
padding: 4px;
cursor: pointer;
color: #666;
display: flex;
align-items: center;
}

/* Поиск */
.search-container {
margin-bottom: 16px;
flex-shrink: 0;
}

.search-input-wrapper {
position: relative;
display: flex;
align-items: center;
background: #ffffff;
border-radius: 12px;
padding: 8px 12px;
box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.search-icon {
color: #8e8e93;
flex-shrink: 0;
margin-right: 8px;
}

.search-input {
flex: 1;
border: none;
outline: none;
font-size: 16px;
color: #1a1a1a;
background: transparent;
padding: 4px 0;
}

.search-input::placeholder {
color: #8e8e93;
}

.clear-btn {
background: none;
border: none;
cursor: pointer;
color: #8e8e93;
padding: 4px;
display: flex;
align-items: center;
margin-left: 4px;
}

.clear-btn:hover {
color: #1a1a1a;
}

/* Теги (фильтры) */
.tags-container {
display: flex;
flex-direction: column;
gap: 8px;
margin-bottom: 24px;
flex-shrink: 0;
}
.tag-group {
display: flex;
flex-wrap: wrap;
gap: 8px;
}
.tag {
background: #e8e9ec;
padding: 6px 12px;
border-radius: 16px;
font-size: 13px;
color: #1a1a1a;
cursor: pointer;
}
.tag.active {
background: #f4ecc4;
color: #8d7a24;
}

/* Список упражнений */
.list-container {
display: flex;
flex-direction: column;
gap: 8px;
flex: 1;
}

.list-item {
background: #ffffff;
border-radius: 12px;
padding: 12px 18px;
display: flex;
justify-content: space-between;
align-items: center;
box-shadow: 0 1px 3px rgba(0,0,0,0.02);
cursor: pointer;
transition: all 0.2s;
border: 2px solid transparent;
}
.list-item:active {
background: #f0f1f3;
}
.list-item.selected {
border-color: #4ade80;
background: #f0fdf4;
}

.item-left {
display: flex;
align-items: center;
gap: 16px;
flex: 1;
}

.item-image-placeholder {
width: 48px;
height: 48px;
background: #f1f6ea;
border-radius: 8px;
display: flex;
align-items: center;
justify-content: center;
color: #3d5a20;
}

.item-text {
display: flex;
align-items: baseline;
gap: 4px;
flex-wrap: wrap;
}

.item-title {
font-size: 16px;
font-weight: 500;
color: #1a1a1a;
}

.item-subtitle {
font-size: 15px;
color: #7f8186;
}

.item-right {
display: flex;
align-items: center;
margin-left: 8px;
}

.item-more-btn {
background: none;
border: none;
cursor: pointer;
color: #8e8e93;
padding: 8px;
display: flex;
align-items: center;
}

/* Кнопка закрытия */
.fab-wrapper {
display: flex;
justify-content: flex-end;
pointer-events: none;
position: fixed;
bottom: 20px;
right: 20px;
z-index: 20;
}
.fab-close {
background-color: #111111;
color: #ffffff;
border: none;
border-radius: 12px;
padding: 14px 24px;
font-size: 14px;
font-weight: 500;
letter-spacing: 0.5px;
cursor: pointer;
pointer-events: auto;
box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.fab-close:active { transform: scale(0.95); }
</style>
