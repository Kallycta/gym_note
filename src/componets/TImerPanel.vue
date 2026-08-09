<script setup lang="ts">
// Реактивные данные для таймера
import { ref } from 'vue'

const time = ref('01:30')

// Логика для изменения времени
const adjustTime = (amount: number) => {
	const [mins = 0, secs = 0] = time.value.split(':').map(Number)
	let totalSeconds = mins * 60 + secs + amount

	// Не даем уйти в минус
	if (totalSeconds < 0) totalSeconds = 0

	const newMins = Math.floor(totalSeconds / 60)
	const newSecs = totalSeconds % 60
	time.value = `${String(newMins).padStart(2, '0')}:${String(newSecs).padStart(2, '0')}`
}
</script>

<template>
	<div class="timer-panel">
		<div class="timer-panel_left_container">
			<!-- Иконка настроек (слайдеры) -->
			<div class="timer-btn icon-settings">
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<line x1="4" y1="21" x2="4" y2="14"></line>
					<line x1="4" y1="10" x2="4" y2="3"></line>
					<line x1="12" y1="21" x2="12" y2="12"></line>
					<line x1="12" y1="8" x2="12" y2="3"></line>
					<line x1="20" y1="21" x2="20" y2="16"></line>
					<line x1="20" y1="12" x2="20" y2="3"></line>
					<line x1="1" y1="14" x2="7" y2="14"></line>
					<line x1="9" y1="8" x2="15" y2="8"></line>
					<line x1="17" y1="16" x2="23" y2="16"></line>
				</svg>
			</div>

			<!-- Время -->
			<div class="timer-display">{{ time }}</div>

			<!-- Кнопки регулировки -->
			<div class="timer-controls">
				<button class="timer-btn adjust-btn" @click="adjustTime(-30)">−</button>
				<button class="timer-btn adjust-btn" @click="adjustTime(30)">+</button>
			</div>
		</div>

		<!-- Кнопка Старт/Play -->
		<button class="timer-btn play-btn">
			<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
				<polygon points="5 3 19 12 5 21 5 3"></polygon>
			</svg>
		</button>
	</div>
</template>

<style scoped>
.timer-panel {
	display: flex;
	align-items: center;
	justify-content: space-between;
	background-color: #4b565e; /* Темно-серый / сланец */
	margin: 0 16px 16px 16px;
	padding: 14px 18px;
	border-radius: 12px;
	color: white;
}
/* Левый контейнер для элементов*/
.timer-panel_left_container {
	display: flex;
	align-items: center;
	gap: 25px;
}
/* Иконка настроек (слева) */
.icon-settings {
	display: flex;
	color: #a0aab2; /* Светло-серый цвет иконки */
}
.icon-settings svg {
	stroke-width: 2.5;
}

/* Дисплей времени */
.timer-display {
	font-size: 20px;
	font-weight: 600;
	letter-spacing: 0.5px;
	text-align: center;

}

/* Блок с кнопками минус и плюс */
.timer-controls {
	display: flex;
	align-items: center;
	gap: 12px;
}

.adjust-btn {
	color: #a0aab2;
	font-size: 22px;
	font-weight: 300;
	width: 24px;
	height: 24px;
	line-height: 1;
}

/* Кнопка Play (справа) */
.play-btn {
	background-color: white;
	width: 20px;
	height: 20px;
	border-radius: 50%;
	color: #4b565e;
}
.play-btn svg {
	width: 12px;
	height: 12px;
	margin-left: 1px;
	margin-top: 2px;
}

</style>
