<!-- src/views/AddWorkout.vue -->
<script setup lang="ts">
import { ref, inject, onMounted } from 'vue'

const props = defineProps<{
	params?: Record<string, any>
}>()

const goBack = inject<() => void>('goBack')

const isVisible = ref(false)
const isLeaving = ref(false)
const ready = ref(false)

// *** Читаем transition из navigation service ***
// Он хранится в page.transition, но страница получает только params
// Поэтому смотрим params или используем inject навигации
import { useNavigationStack } from '@/composables/useNavigationStack'
const navigation = useNavigationStack()

// Получаем текущую страницу и её transition
const currentPage = navigation.currentPage.value
const transition = currentPage?.transition || 'slide-up'

// Определяем классы в зависимости от transition
const isSlideLeft = transition === 'slide-left'
const isSlideUp = transition === 'slide-bottom' || transition === 'slide-up'
const isNone = transition === 'none'

onMounted(() => {
	if(transition !==  'none') {
		requestAnimationFrame(() => {
			ready.value = true
			requestAnimationFrame(() => {
				isVisible.value = true
			})
		})
	} else {
		// Для 'none' - сразу показываем без анимации
		ready.value = true
		isVisible.value = true
	}

})

function handleClose() {
	isLeaving.value = true
	isVisible.value = false

	if(transition !==  'none') {
		setTimeout(() => {
			goBack()
		}, 350)
	} else goBack()


}
</script>

<template>
	<div
		class="add-workout-screen"
		:class="{
      'add-workout-ready': ready,
      'add-workout-visible': isVisible,
      'add-workout-leaving': isLeaving,
      'slide-left-mode': isSlideLeft,
      'slide-up-mode': isSlideUp,
      'none-mode': isNone
    }"
	>
		<div class="content-sheet">
			<div class="header">
				<h2>Settinhs</h2>
				<button @click="handleClose" class="close-btn">✕</button>
			</div>
			<div class="body">
				<p>ЗSettinhs.</p>
				<p>Transition: {{ transition }}</p>
			</div>
		</div>
	</div>
</template>

<style scoped>
.add-workout-screen {
	position: absolute;
	inset: 0;
	display: flex;
	align-items: flex-end;
	transition: none;
}

/* SLIDE UP (по умолчанию) */
.slide-up-mode {
	transform: translateY(100%);
}
.add-workout-ready.slide-up-mode {
	transition: transform 0.35s cubic-bezier(0.2, 0.0, 0.2, 1.0);
}
.add-workout-visible.slide-up-mode {
	transform: translateY(0);
}
.add-workout-leaving.slide-up-mode {
	transform: translateY(100%);
}

/* SLIDE LEFT */
.slide-left-mode {
	align-items: stretch; /* На всю высоту */
	transform: translateX(100%);
}
.add-workout-ready.slide-left-mode {
	transition: transform 0.35s cubic-bezier(0.2, 0.0, 0.2, 1.0);
}
.add-workout-visible.slide-left-mode {
	transform: translateX(0);
}
.add-workout-leaving.slide-left-mode {
	transform: translateX(100%);
}

/* NONE (появляется поверх без анимации) */
.none-mode {
	align-items: stretch;
	transform: none;
}
.add-workout-ready.none-mode {
	transition: none;
}
.add-workout-visible.none-mode {
	transform: none;
}
.add-workout-leaving.none-mode {
	transform: none;
}

.content-sheet {
	position: relative;
	width: 100%;
	height: 100%;
	background: white;
	padding: 20px;
	overflow-y: auto;
	box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
}

.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20px;
}

.header h2 {
	margin: 0;
	font-size: 20px;
}

.close-btn {
	background: none;
	border: none;
	font-size: 24px;
	cursor: pointer;
	color: #999;
	padding: 8px;
}

.body {
	color: #333;
}
</style>
