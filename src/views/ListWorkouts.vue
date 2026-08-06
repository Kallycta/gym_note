<!-- src/views/AddWorkout.vue -->
<script setup lang="ts">
import { ref, inject, onMounted } from 'vue'

const goBack = inject<() => void>('goBack')

const isVisible = ref(false)
const isLeaving = ref(false)
const ready = ref(false) // ← Новый флаг: готов к анимации

onMounted(() => {
	// Даём браузеру отрисовать элемент в начальной позиции
	requestAnimationFrame(() => {
		ready.value = true // Включаем transition

		requestAnimationFrame(() => {
			isVisible.value = true // Запускаем движение
		})
	})
})

function handleClose() {
	isLeaving.value = true
	isVisible.value = false

	setTimeout(() => {
		goBack()
	}, 350) // Чуть больше, чтобы анимация точно завершилась
}
</script>

<template>
	<div
		class="add-workout-screen"
		:class="{
      'add-workout-ready': ready,
      'add-workout-visible': isVisible,
      'add-workout-leaving': isLeaving
    }"
	>

		<!-- Контент -->
		<div class="content-sheet">
			<div class="header">
				<h2>Новая тренировка</h2>
				<button @click="handleClose" class="close-btn">✕</button>
			</div>
			<div class="body">
				<p>Здесь будет форма...</p>
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
	/* Начальная позиция — за экраном */
	transform: translateY(100%);
	/* transition появляется только после ready */
	transition: none;
}

/* Включаем transition */
.add-workout-ready {
	transition: transform 0.35s cubic-bezier(0.2, 0.0, 0.2, 1.0);
}

/* Едем в центр */
.add-workout-visible {
	transform: translateY(0);
}

/* Уезжаем вниз */
.add-workout-leaving {
	transform: translateY(100%);
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
