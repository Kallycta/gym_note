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

import { useNavigationStack } from '@/composables/useNavigationStack'
const navigation = useNavigationStack()
const navigateForward = inject<(pageName: string, params?: any, transition?: string) => Promise<void>>('navigateForward')

const currentPage = navigation.currentPage.value
const transition = currentPage?.transition || 'slide-up'

const isSlideLeft = transition === 'slide-left'
const isSlideUp = transition === 'slide-bottom' || transition === 'slide-up'
const isNone = transition === 'none'

// --- Данные компонента (список упражнений) ---
interface MuscleGroup {
	id: number
	title: string
	days: number | null
	iconId: string
	colorClass: string
}

const muscleGroups = ref<MuscleGroup[]>([
	{ id: 1, title: 'Грудь', days: null, iconId: 'chest', colorClass: 'text-green' },
	{ id: 2, title: 'Руки', days: null, iconId: 'arms', colorClass: 'text-red' },
	{ id: 3, title: 'Спина', days: null, iconId: 'back', colorClass: 'text-blue' },
	{ id: 4, title: 'Ноги', days: null, iconId: 'legs', colorClass: 'text-lime' },
	{ id: 5, title: 'Плечи', days: null, iconId: 'shoulders', colorClass: 'text-sky' },
	{ id: 6, title: 'Корпус', days: null, iconId: 'core', colorClass: 'text-purple' },
	{ id: 7, title: 'Фулбоди', days: null, iconId: 'fullbody', colorClass: 'text-orange' },
	{ id: 8, title: 'Другое', days: null, iconId: 'another', colorClass: 'text-grey' },
	{ id: 9, title: 'Кардио', days: null, iconId: 'cardio', colorClass: 'text-red' },
])

onMounted(() => {
	if(transition !==  'none') {
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
			<!-- Хедер страницы -->
			<div class="header">
				<h2 class="page-title">Упражнения</h2>
				<div class="header-actions">
					<button class="icon-btn" aria-label="Добавить">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
					</button>
					<button class="icon-btn" aria-label="Поиск">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
					</button>
				</div>
			</div>

			<!-- Основной контент -->
			<div class="body">
				<!-- Сетка быстрых действий -->
				<div class="grid-actions">
					<div class="action-card bg-purple-light">
						<div class="action-icon">
							<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M18 4V3c0-.55-.45-1-1-1H7c-.55 0-1 .45-1 1v1H4c-.55 0-1 .45-1 1v14c0 .55.45 1 1 1h16c.55 0 1-.45 1-1V5c0-.55-.45-1-1-1h-2zM7 4h10v2H7V4zm11 15H6V7h12v12z"/></svg>
						</div>
						<span class="action-title">Из программы</span>
					</div>
					<div class="action-card bg-green-light">
						<div class="action-icon">
							<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
						</div>
						<span class="action-title">Из другого дня</span>
					</div>
					<div class="action-card bg-blue-light">
						<div class="action-icon">
							<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
						</div>
						<span class="action-title">Недавние упражнения</span>
					</div>
					<div class="action-card bg-gray-light">
						<div class="action-icon">
							<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
						</div>
						<span class="action-title">Добавить комментарий</span>
					</div>
				</div>

				<!-- Список групп мышц -->
				<div class="list-container">
					<div v-for="group in muscleGroups" :key="group.id" class="list-item">
						<div class="item-left">
							<div class="item-icon-wrapper" :class="group.colorClass">
								<svg  v-if="group.iconId === 'chest'" xmlns="http://www.w3.org/2000/svg"
									  width="25px" height="25px" viewBox="0 0 512.000000 512.000000"
									  preserveAspectRatio="xMidYMid meet">
									<g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
									   stroke="none">
										<path d="M1945 4695 c-19 -18 -25 -35 -25 -70 0 -69 -28 -191 -61 -263 -120
-265 -392 -455 -1026 -716 -264 -110 -315 -139 -417 -247 -148 -155 -236 -367
-266 -643 -6 -54 -22 -137 -36 -183 -29 -102 -67 -314 -91 -513 -32 -270 -21
-792 18 -892 22 -54 103 -61 135 -12 15 22 16 36 5 122 -46 370 -6 911 97
1293 11 41 25 120 32 175 30 263 137 490 282 601 68 52 94 65 339 167 554 229
812 394 984 628 103 139 165 319 165 481 0 59 -31 97 -80 97 -19 0 -40 -9 -55
-25z"/>
										<path d="M3065 4695 c-28 -28 -32 -74 -15 -185 43 -269 206 -489 509 -687 126
-83 347 -192 613 -302 259 -107 299 -127 365 -180 86 -68 175 -209 221 -351
29 -87 39 -138 52 -250 6 -52 24 -142 40 -200 32 -115 61 -282 86 -490 22
-176 25 -600 5 -757 -12 -102 -12 -115 3 -138 32 -48 113 -41 135 13 39 100
50 621 18 892 -24 198 -62 411 -91 513 -14 47 -30 131 -36 187 -20 185 -77
364 -162 508 -18 31 -73 98 -123 148 -105 105 -139 124 -430 244 -599 245
-876 441 -994 702 -33 72 -61 194 -61 263 0 57 -32 95 -80 95 -19 0 -40 -9
-55 -25z"/>
										<path d="M1705 3735 c-34 -33 -32 -67 10 -154 65 -135 191 -235 350 -276 33
-9 108 -19 167 -22 l107 -6 30 31 c38 37 40 74 6 107 -22 22 -32 25 -104 25
-210 0 -351 78 -422 236 -16 35 -38 68 -48 74 -33 17 -71 11 -96 -15z"/>
										<path d="M3313 3745 c-12 -8 -29 -38 -38 -65 -23 -69 -100 -152 -178 -190 -75
-36 -143 -50 -253 -50 -77 0 -84 -2 -103 -26 -39 -50 -23 -94 44 -120 105 -40
326 7 453 96 103 73 202 215 202 293 0 60 -77 97 -127 62z"/>
										<path d="M2505 3095 l-25 -24 0 -271 0 -271 25 -24 c15 -16 36 -25 55 -25 19
0 40 9 55 25 l25 24 0 271 0 271 -25 24 c-15 16 -36 25 -55 25 -19 0 -40 -9
-55 -25z"/>
										<path d="M868 2730 c-24 -25 -29 -36 -24 -58 4 -15 54 -161 112 -326 l105
-299 -11 -105 c-30 -279 -95 -472 -200 -595 -55 -64 -61 -91 -29 -131 16 -20
29 -26 59 -26 34 0 44 7 94 61 68 73 134 204 171 339 15 52 29 102 32 110 5
15 68 -135 102 -246 52 -164 82 -462 80 -794 l0 -215 26 -22 c34 -30 67 -29
102 1 l28 24 0 279 c-1 424 -33 655 -126 896 -64 166 -141 379 -279 769 -60
168 -113 316 -119 327 -26 49 -80 53 -123 11z"/>
										<path d="M4158 2749 c-26 -15 -31 -26 -148 -357 -138 -390 -215 -603 -279
-769 -93 -241 -125 -465 -126 -886 l0 -289 28 -24 c35 -30 68 -31 102 -1 l26
22 0 215 c-2 332 28 628 78 790 35 112 99 266 104 250 2 -8 17 -58 31 -110 39
-137 105 -266 172 -339 50 -54 60 -61 94 -61 30 0 43 6 59 26 32 40 26 67 -29
131 -106 123 -171 316 -200 594 l-11 106 107 304 c59 167 107 317 107 333 0
53 -69 92 -115 65z"/>
										<path d="M2245 2084 c-186 -135 -428 -158 -704 -69 -112 36 -136 35 -165 -7
-39 -56 -5 -105 99 -141 141 -49 219 -62 385 -62 148 1 159 2 250 33 101 35
207 92 258 141 40 37 43 81 7 116 -34 35 -71 32 -130 -11z"/>
										<path d="M2745 2095 c-36 -35 -33 -79 7 -116 51 -49 157 -106 258 -141 91 -31
102 -32 250 -33 166 0 244 13 385 62 104 36 138 85 99 141 -29 42 -53 43 -165
7 -274 -89 -510 -67 -697 65 -67 47 -102 51 -137 15z"/>
										<path d="M2153 1425 c-12 -8 -27 -32 -34 -53 -22 -68 -57 -126 -101 -169 -43
-42 -117 -82 -151 -83 -10 0 -29 -11 -42 -25 -33 -33 -33 -78 1 -112 22 -22
31 -25 71 -19 75 10 172 63 239 130 67 67 132 184 141 254 5 34 2 44 -20 66
-30 30 -71 34 -104 11z"/>
										<path d="M2863 1414 c-22 -22 -25 -32 -20 -66 3 -23 22 -75 43 -117 67 -137
210 -250 336 -267 41 -6 49 -4 72 19 34 34 34 79 1 112 -13 14 -32 25 -42 25
-34 1 -108 41 -151 83 -44 43 -79 101 -101 169 -23 69 -90 90 -138 42z"/>
										<path d="M2505 655 c-50 -49 -15 -135 55 -135 41 0 80 39 80 80 0 41 -39 80
-80 80 -19 0 -40 -9 -55 -25z"/>
									</g>
								</svg>
								<svg v-else-if="group.iconId === 'arms' "  xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-biceps-flexed-icon lucide-biceps-flexed"><path d="M12.409 13.017A5 5 0 0 1 22 15c0 3.866-4 7-9 7-4.077 0-8.153-.82-10.371-2.462-.426-.316-.631-.832-.62-1.362C2.118 12.723 2.627 2 10 2a3 3 0 0 1 3 3 2 2 0 0 1-2 2c-1.105 0-1.64-.444-2-1"/><path d="M15 14a5 5 0 0 0-7.584 2"/><path d="M9.964 6.825C8.019 7.977 9.5 13 8 15"/></svg>
								<svg v-else-if="group.iconId === 'back'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6h8"/><path d="M8 10h8"/><path d="M8 14h8"/><path d="M6 18h12"/></svg>
								<svg v-else-if="group.iconId === 'legs'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v14"/><path d="M8 12c2-2 4-2 4-2s2 0 4 2"/><path d="M8 16c2 2 4 2 4 2s2 0 4-2"/></svg>
								<svg v-else-if="group.iconId === 'shoulders'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12c4-6 6-6 8-6s4 0 8 6"/><path d="M12 6v10"/></svg>
								<svg v-else-if="group.iconId === 'core'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16v12H4z"/><path d="M12 2v4"/><path d="M12 18v4"/></svg>
								<svg v-else-if="group.iconId === 'fullbody'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="3"/><path d="M6 11l2 3 3-1 1 5-2 5h4l2-5 1-5 3 1 2-3"/></svg>
							</div>
							<span class="item-title">{{ group.title }}</span>
						</div>

						<div class="item-right">
							<span v-if="group.days !== null" class="item-subtitle">{{ group.days }} дня</span>
							<button class="item-more-btn">
								<svg width="4" height="16" viewBox="0 0 4 16" fill="currentColor"><circle cx="2" cy="2" r="2"/><circle cx="2" cy="8" r="2"/><circle cx="2" cy="14" r="2"/></svg>
							</button>
						</div>
					</div>
				</div>
			</div>

			<!-- Кнопка "Закрыть" (FAB) -->
			<div class="fab-wrapper">
				<button class="fab-close" @click="handleClose">ЗАКРЫТЬ</button>
			</div>
		</div>
	</div>
</template>

<style scoped>
/* --- Ваша обертка --- */
.add-workout-screen {
	position: absolute;
	inset: 0;
	display: flex;
	align-items: flex-end;
	transition: none;
}

.slide-up-mode { transform: translateY(100%); }
.add-workout-ready.slide-up-mode { transition: transform 0.35s cubic-bezier(0.2, 0.0, 0.2, 1.0); }
.add-workout-visible.slide-up-mode { transform: translateY(0); }
.add-workout-leaving.slide-up-mode { transform: translateY(100%); }

.slide-left-mode { align-items: stretch; transform: translateX(100%); }
.add-workout-ready.slide-left-mode { transition: transform 0.35s cubic-bezier(0.2, 0.0, 0.2, 1.0); }
.add-workout-visible.slide-left-mode { transform: translateX(0); }
.add-workout-leaving.slide-left-mode { transform: translateX(100%); }

.none-mode { align-items: stretch; transform: none; }
.add-workout-ready.none-mode { transition: none; }
.add-workout-visible.none-mode { transform: none; }
.add-workout-leaving.none-mode { transform: none; }

.content-sheet {
	position: relative;
	width: 100%;
	height: 100%;
	background: #f5f6f8; /* Светлый фон для контента */
	padding: 20px 16px 80px; /* Отступ снизу оставлен для FAB */
	overflow-y: auto;
	box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
	display: flex;
	flex-direction: column;
}

/* --- Хедер страницы --- */
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

/* --- Сетка действий --- */
.body {
	flex: 1;
}

.grid-actions {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 12px;
	margin-bottom: 24px;
}

.action-card {
	border-radius: 16px;
	padding: 16px 12px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 8px;
	min-height: 80px;
	text-align: center;
	cursor: pointer;
	transition: opacity 0.2s;
}
.action-card:active { opacity: 0.7; }
.action-title { font-size: 14px; line-height: 1.2; font-weight: 500; }
.action-icon svg { display: block; }

.bg-purple-light { background-color: #efe6f5; color: #7b3fa0; }
.bg-green-light { background-color: #e8f1e5; color: #4b8b4f; }
.bg-blue-light { background-color: #e4e7f5; color: #4a63b5; }
.bg-gray-light { background-color: #e6e7e9; color: #5d5f64; }

/* --- Список --- */
.list-container { display: flex; flex-direction: column; gap: 8px; }
.list-item {
	background: #ffffff;
	border-radius: 12px;
	padding: 16px 18px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}
.item-left { display: flex; align-items: center; gap: 16px; }
.item-icon-wrapper { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; }
.item-title { font-size: 17px; font-weight: 400; color: #1a1a1a; }
.item-right { display: flex; align-items: center; gap: 12px; }
.item-subtitle { font-size: 13px; color: #8e8e93; }
.item-more-btn {
	background: none; border: none; cursor: pointer; color: #8e8e93; padding: 4px; display: flex; align-items: center;
}
.text-green { color: #58a34a; fill: #58a34a}
.text-red { color: #e8523e; fill: #e8523e; }
.text-blue { color: #4361cb;  fill: #4361cb;}
.text-lime { color: #95b531; fill: #95b531;}
.text-sky { color: #4ba6e3; fill: #4ba6e3; }
.text-purple { color: #8b5cf6; fill: #8b5cf6;}
.text-orange { color: #e59b55;  fill: #e59b55;}

/* --- Кнопка "Закрыть" --- */
.fab-wrapper {
	display: flex;
	justify-content: center;
	pointer-events: none;
	position: fixed;
	bottom: 20px;
	right: 20px;
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
