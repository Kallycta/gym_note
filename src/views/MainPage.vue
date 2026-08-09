<script setup lang="ts">
import { computed, inject, ref, onMounted, onBeforeUnmount } from 'vue'
import type { WorkoutExercise } from '@/stores/workoutStore'

import HeaderMain from '@/componets/header/HeaderMain.vue'
import TImerPanel from '@/componets/TImerPanel.vue'
import CalendarPanel from '@/componets/CalendarPanel.vue'
import { useCollapse } from '@/composables/useCollapse.ts'
import { useNavigationStack } from '@/composables/useNavigationStack.ts'
import { workoutStore } from '@/stores/workoutStore'

// Пример данных с тренировками (в реальном приложении это будет из API)
const workoutDates = ref(['2026-09-01', '2026-09-05', '2026-09-10'])

const navigation = useNavigationStack()

const timer = useCollapse(false)
const calendar = useCollapse(false)

// Получаем функцию навигации из AppNavigator
const navigateForward = inject<(pageName: string, params?: any, transition?: string) => Promise<void>>('navigateForward')

async function handleAddWorkout() {
	// slide-left = страница выезжает справа налево
	await navigateForward?.('addWorkout', { message: 'Привет!' }, 'slide-bottom')
}

async function handleAddWorkout2() {
	// slide-bottom = страница выезжает снизу вверх
	await navigateForward?.('settings', { message: 'Снизу!' }, 'slide-left')
}

async function handleAddWorkout3() {
	// none = страница появляется поверх без анимации (просто замена контента)
	await navigateForward?.('settings', { message: 'Без анимации!' }, 'none')
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

// Получаем упражнения для выбранной даты
const exercisesForDate = computed(() => {
	const dateStr = selectedDate.value.toISOString().split('T')[0]
	return workoutStore.getExercisesForDate(dateStr)
})

// Удаляем упражнение
const removeExercise = (id: number) => {
	workoutStore.removeExercise(id)
}

// Меню для упражнения
const openMenuId = ref<number | null>(null)

const toggleMenu = (id: number) => {
	openMenuId.value = openMenuId.value === id ? null : id
}

const closeMenu = () => {
	openMenuId.value = null
}

const handleReplaceExercise = (exercise: WorkoutExercise) => {
	closeMenu()
	navigateForward?.('addWorkout', { replaceExerciseId: exercise.id }, 'none')
}

const handlePastPerformance = (exerciseId: number) => {
	closeMenu()
	console.log('Прошлое выполнение для упражнения:', exerciseId)
}

const handleClickOutside = (event: MouseEvent) => {
	const target = event.target as HTMLElement
	if (!target.closest('.menu-btn') && !target.closest('.menu-popup-main')) {
		closeMenu()
	}
}

onMounted(() => {
	document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
	document.removeEventListener('click', handleClickOutside)
})

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

		<!-- 2. Основной контент (список упражнений или пустое состояние) -->
		<main class="content-container">
			<template v-if="exercisesForDate.length > 0">
				<div class="exercises-list">
					<div 
						v-for="exercise in exercisesForDate" 
						:key="exercise.id"
						class="exercise-item"
					>
						<div class="exercise-left">
							<div class="exercise-icon">
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<path d="M5 16 L10 10 L14 14 L19 9" />
									<rect x="2" y="18" width="20" height="4" rx="1" />
								</svg>
							</div>
							<div class="exercise-info">
								<span class="exercise-name">{{ exercise.name }}</span>
								<span class="exercise-category">{{ exercise.category }}</span>
							</div>
						</div>
                            <div class="exercise-right">
                                <button class="add-icon" aria-label="Добавлено">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                </button>
                                <button class="menu-btn" @click.stop="toggleMenu(exercise.id)" aria-label="Меню">
                                    <svg width="4" height="16" viewBox="0 0 4 16" fill="currentColor">
                                        <circle cx="2" cy="2" r="2"/>
                                        <circle cx="2" cy="8" r="2"/>
                                        <circle cx="2" cy="14" r="2"/>
                                    </svg>
                                </button>
                                
                                <!-- Выпадающее меню -->
                                <div v-if="openMenuId === exercise.id" class="menu-popup-main">
                                    <div class="menu-item" @click="handleReplaceExercise(exercise)">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M23 4v6h-6"></path>
                                            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                                        </svg>
                                        <span>Заменить упражнение</span>
                                    </div>
                                    <div class="menu-item" @click="handlePastPerformance(exercise.id)">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <polyline points="12 6 12 12 16 14"></polyline>
                                        </svg>
                                        <span>Прошлое выполнение</span>
                                    </div>
                                    <div class="menu-item danger" @click="removeExercise(exercise.id)">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <polyline points="3 6 5 6 21 6"></polyline>
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                        </svg>
                                        <span>Убрать упражнение</span>
                                    </div>
                                </div>
                            </div>
					</div>
				</div>
			</template>
			<template v-else>
				<div class="empty-state-container">
					<div class="sleep-illustration"><span>z</span><span>z</span><span>z</span></div>
					<div class="empty-text">
						<div>Тренировка</div>
						<div>отсутствует</div>
					</div>
				</div>
			</template>
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

/* 2. Пустое состояние и контент */
.content-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	flex-grow: 1;
	width: 100%;
}

.empty-state-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	flex-grow: 1;
}

.exercises-list {
	display: flex;
	flex-direction: column;
	gap: 12px;
	width: 100%;
	padding: 0 16px;
}

.exercise-item {
	background: #ffffff;
	border-radius: 12px;
	padding: 14px 16px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.exercise-left {
	display: flex;
	align-items: center;
	gap: 14px;
	flex: 1;
}

.exercise-icon {
	width: 44px;
	height: 44px;
	background: #f1f6ea;
	border-radius: 8px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #3d5a20;
	flex-shrink: 0;
}

.exercise-info {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.exercise-name {
	font-size: 16px;
	font-weight: 500;
	color: #1a1a1a;
}

.exercise-category {
	font-size: 14px;
	color: #7f8186;
}

.remove-btn {
	background: none;
	border: none;
	cursor: pointer;
	color: #c5c5c5;
	padding: 8px;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: color 0.2s;
}

.remove-btn:hover {
	color: #ff4444;
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

.exercise-right {
display: flex;
align-items: center;
gap: 8px;
position: relative;
}

.add-icon {
background: none;
border: none;
cursor: default;
color: #4ade80;
padding: 4px;
display: flex;
align-items: center;
}

.menu-btn {
background: none;
border: none;
cursor: pointer;
color: #8e8e93;
padding: 8px;
display: flex;
align-items: center;
}

.menu-popup-main {
position: absolute;
right: 0;
top: 100%;
background: #ffffff;
border-radius: 12px;
box-shadow: 0 4px 20px rgba(0,0,0,0.15);
padding: 8px;
min-width: 200px;
z-index: 100;
margin-top: 4px;
}

.menu-item {
display: flex;
align-items: center;
gap: 12px;
padding: 10px 12px;
border-radius: 8px;
cursor: pointer;
transition: background 0.15s;
color: #1a1a1a;
font-size: 14px;
}

.menu-item:hover {
background: #f5f6f8;
}

.menu-item.danger {
color: #ff4444;
}

.menu-item.danger:hover {
background: #fff5f5;
}

.menu-item svg {
flex-shrink: 0;
}
</style>
