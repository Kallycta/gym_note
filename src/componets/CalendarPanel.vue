<script setup lang="ts">
import { computed, ref } from 'vue'

// Пропсы: начальная дата и список дат с тренировками (в формате YYYY-MM-DD)
const props = defineProps<{
	initialDate?: Date
	workoutDates?: string[] // Пример: ['2026-09-01', '2026-09-05']
}>()

const emit = defineEmits(['dateChange', 'selectDay'])
// Текущий просматриваемый месяц
const currentDisplayDate = ref(props.initialDate || new Date())

// Дни недели (заголовки)
const weekDays = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс']

// Функция переключения месяца
const changeMonth = (delta: number) => {
	const newDate = new Date(currentDisplayDate.value)
	newDate.setMonth(newDate.getMonth() + delta)
	currentDisplayDate.value = newDate
	emit('dateChange', newDate)
}

// Генерация сетки календаря (42 ячейки для 6 недель)
const calendarGrid = computed(() => {
	const year = currentDisplayDate.value.getFullYear()
	const month = currentDisplayDate.value.getMonth()

	// 1. Первый день месяца
	const firstDayOfMonth = new Date(year, month, 1)
	// 2. День недели первого дня (0 - Вс, 1 - Пн...). Нам нужно отмотать назад до Пн.
	// Если Пн=1, то нужно отнять (dayIndex - 1) дней. Если Вс=0, то отнять 6 дней.
	let startOffset = firstDayOfMonth.getDay() - 1
	if (startOffset < 0) startOffset = 6 // Воскресенье

	const startDate = new Date(firstDayOfMonth)
	startDate.setDate(startDate.getDate() - startOffset)

	// 3. Генерируем 42 ячейки
	const days = []
	const today = new Date()
	today.setHours(0,0,0,0)

	for (let i = 0; i < 42; i++) {
		const currentDate = new Date(startDate)
		currentDate.setDate(startDate.getDate() + i)

		const isCurrentMonth = currentDate.getMonth() === month
		const dateString = currentDate.toISOString().split('T')[0] // YYYY-MM-DD
		const isToday = currentDate.getTime() === today.getTime()

		// Проверяем, была ли тренировка в этот день
		const hasWorkout = props.workoutDates?.includes(dateString) ?? false

		days.push({
			date: currentDate,
			dayNumber: currentDate.getDate(),
			isCurrentMonth,
			isToday,
			dateString,
			hasWorkout
		})
	}

	return days
})


const monthTitle = computed(() => {
	return currentDisplayDate.value.toLocaleString('ru-RU', { month: 'long', year: 'numeric' })
})
</script>

<template>
	<div class="calendar-panel">
		<!-- Заголовок со стрелками -->
		<div class="calendar-header">
			<button class="nav-btn" @click="changeMonth(-1)">
				<svg width="10" height="14" viewBox="0 0 10 14" fill="none">
					<path d="M9 13L2 7L9 1" stroke="#A0AAB2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</button>
			<span class="month-title">{{ monthTitle }}</span>
			<button class="nav-btn" @click="changeMonth(1)">
				<svg width="10" height="14" viewBox="0 0 10 14" fill="none">
					<path d="M1 1L8 7L1 13" stroke="#A0AAB2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</button>
		</div>

		<!-- Сетка дней недели -->
		<div class="weekdays-row">
			<div v-for="day in weekDays" :key="day" class="weekday-cell">
				{{ day }}
			</div>
		</div>

		<!-- Сетка чисел -->
		<div class="days-grid">
			<div
				v-for="(day, index) in calendarGrid"
				:key="index"
				class="day-cell"
				@click="emit('selectDay', day.date)"
				:class="{
          'other-month': !day.isCurrentMonth,
          'today': day.isToday
        }"
			>
				<span class="day-number">{{ day.dayNumber }}</span>
				<!-- Точка тренировки -->
				<div v-if="day.hasWorkout" class="workout-dot"></div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.calendar-panel {
	background-color: #f6f7f8;
	padding: 10px 0 10px 0;
	width: 100%;
	box-sizing: border-box;
}

/* Заголовок */
.calendar-header {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 30px;
	margin-bottom: 16px;
}
.nav-btn {
	background: none;
	border: none;
	cursor: pointer;
	padding: 4px;
	display: flex;
	align-items: center;
	justify-content: center;
}
.nav-btn:active {
	opacity: 0.6;
}
.month-title {
	font-size: 18px;
	font-weight: 500;
	color: #555;
	letter-spacing: 0.5px;
}

/* Ряды */
.weekdays-row, .days-grid {
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	text-align: center;
}

.weekdays-row {
	margin-bottom: 8px;
}
.weekday-cell {
	font-size: 12px;
	font-weight: 700;
	color: #A0AAB2;
	text-transform: uppercase;
	letter-spacing: 0.5px;
}

/* Ячейки дней */
.day-cell {
	cursor: pointer;
	height: 44px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
	padding-top: 6px;
	position: relative;
	box-sizing: border-box;
}
.day-number {
	font-size: 16px;
	font-weight: 400;
	color: #222;
}
.other-month .day-number {
	color: #d3d3d3; /* Светло-серый для соседних месяцев */
}
.today .day-number {
	font-weight: 700;
	color: #4CAF50;
}

/* Точка тренировки под цифрой */
.workout-dot {
	width: 4px;
	height: 4px;
	border-radius: 50%;
	background-color: #4CAF50;
	margin-top: 2px;
	position: absolute;
	bottom: 6px;
}
</style>
