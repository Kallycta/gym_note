<script setup lang="ts">
import { computed, inject, ref } from 'vue'

import HeaderMain from '@/componets/header/HeaderMain.vue'
import TImerPanel from '@/componets/TImerPanel.vue'
import CalendarPanel from '@/componets/CalendarPanel.vue'
import { useCollapse } from '@/composables/useCollapse.ts'
import { useNavigationStack } from '@/composables/useNavigationStack.ts'

// Пример данных с тренировками (в реальном приложении это будет из API)
const workoutDates = ref(['2026-09-01', '2026-09-05', '2026-09-10'])

const navigation = useNavigationStack()

const timer = useCollapse(false)
const calendar = useCollapse(false)

// Получаем функцию навигации из AppNavigator
const navigateForward = inject<(pageName: string, params?: any, transition?: string) => Promise<void>>('navigateForward')

async function handleAddWorkout() {
	// slide-left = страница выезжает справа налево
	await navigateForward('addWorkout', { message: 'Привет!' }, 'slide-bottom')
}

async function handleAddWorkout2() {
	// slide-bottom = страница выезжает снизу вверх
	await navigateForward('settings', { message: 'Снизу!' }, 'slide-left')
}

async function handleAddWorkout3() {
	// none = страница появляется поверх без анимации (просто замена контента)
	await navigateForward('settings', { message: 'Без анимации!' }, 'none')
}

// async function handleAddWorkout() {
// 	await navigation.navigateTo('addWorkout', {}, 'slide-left')
// }
//
// async function handleAddWorkout2() {
// 	await navigation.navigateTo('settings', { from: 'test' }, 'slide-bottom')
// }

// --- Состояние выбранной даты ---
const selectedDate = ref(new Date()) // По умолчанию - сегодня

// Вычисляем, что показывать в хедере
const headerDateText = computed(() => {
	const today = new Date()
	today.setHours(0, 0, 0, 0)

	const checkDate = new Date(selectedDate.value)
	checkDate.setHours(0, 0, 0, 0)

	// Если дата совпадает с сегодняшней
	if (checkDate.getTime() === today.getTime()) {
		return 'Сегодня'
	}

	// Иначе возвращаем "31 авг." (День + короткий месяц)
	return checkDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
})

// Функция, которая вызывается при клике на день в календаре
const handleDateSelect = (date: Date) => {
	selectedDate.value = date
}


</script>

<template>
	<div class="app-container">


		<HeaderMain
			:header-date="headerDateText"
			@on-click-timer="timer.toggle"
			@on-click-calendar="calendar.toggle"
		/>

		<div class="calendar-wrapper">
			<div class="calendar-collapsible" :ref="calendar.bodyRef">
				<CalendarPanel
					:workout-dates="workoutDates"
					:initial-date="selectedDate"
					@date-change="(date) => console.log('Месяц изменен на:', date)"
					@select-day="handleDateSelect"
				/>
			</div>
		</div>

		<div class="timer-wrapper">
			<div class="timer-collapsible" :ref="timer.bodyRef">
				<TImerPanel />
			</div>
		</div>

		<!--		<img src="/1.jpg" alt="">-->

		<!-- 2. Основной контент (пустое состояние) -->
		<main class="empty-state-container">
			<div class="sleep-illustration"><span>z</span><span>z</span><span>z</span></div>
			<div class="empty-text">
				<div>Тренировка</div>
				<div>отсутствует</div>
			</div>
		</main>

		<!-- 3. Плавающая кнопка (FAB) -->
		<button class="fab-add-btn" @click="handleAddWorkout" aria-label="Добавить тренировку">
			+
		</button>

		<button class="fab-add-btn-2" @click="handleAddWorkout2" aria-label="Добавить тренировку (снизу)">
			-
		</button>

		<button class="fab-add-btn-3" @click="handleAddWorkout3" aria-label="Добавить тренировку (без анимации)">
			×
		</button>

		<!-- 4. Полоска домой (Home Indicator) -->
		<!--		<div class="home-indicator"></div>-->
	</div>
</template>

<style scoped>
/* Общий контейнер приложения */
.app-container {
	display: flex;
	flex-direction: column;
	height: 100vh;
	background-color: #f6f7f8;
	position: relative;
	font-family:
		-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
	overflow: hidden; /* Чтобы внутренности не вылезали за экран */
}

/* 2. Пустое состояние */
.empty-state-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	flex-grow: 1; /* Растягиваем на всё доступное пространство */
}

.timer-wrapper,
.calendar-wrapper {
	margin: 0 16px;
	overflow: hidden;
}
.timer-collapsible,
.calendar-collapsible {
	height: 0;
	overflow: hidden;
	will-change: height;
}
.calendar-wrapper {
	margin-top: 16px; /* Небольшое расстояние между таймером и календарем, если оба открыты */
}

.sleep-illustration {
	font-size: 52px;
	font-weight: bold;
	color: #d8d8d8;
	letter-spacing: -8px;
	transform: rotate(20deg);
	margin-bottom: 50px;
	line-height: 1;
}

.sleep-illustration span:nth-child(2) {
	font-size: 0.8em; /* Делаем вторую z чуть меньше, как на картинке */
	margin-right: 23px;
	margin-left: 23px;
}
.sleep-illustration span:nth-child(3) {
	font-size: 0.6em;
}

.empty-text {
	color: #c5c5c5;
	font-size: 22px;
	font-weight: 500;
	text-align: center;
}

.fab-add-btn, .fab-add-btn-2, .fab-add-btn-3 {
	position: fixed;
	bottom: 30px;
	right: 24px;
	width: 48px;
	height: 48px;
	border-radius: 8px;
	background-color: #4caf50;
	color: white;
	box-shadow: 0 4px 10px rgba(76, 175, 80, 0.3);
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 25px;
	font-weight: 300;
	transition:
		transform 0.1s,
		box-shadow 0.2s;
}
.fab-add-btn-2 {
	right: 90px;

}
.fab-add-btn-3 {
	right: 156px;

}

.fab-add-btn:active {
	transform: scale(0.92);
	box-shadow: 0 2px 5px rgba(76, 175, 80, 0.2);
}

/* 4. Home Indicator */
.home-indicator {
	position: fixed;
	bottom: 8px;
	left: 50%;
	transform: translateX(-50%);
	width: 134px;
	height: 5px;
	background-color: #c5c5c5;
	border-radius: 10px;
}
</style>
