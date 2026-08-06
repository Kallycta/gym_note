<script setup lang="ts">
const emit = defineEmits(['onClickTimer', 'onClickCalendar']);

defineProps<{
	headerDate?: string
}>()

</script>

<template>
	<div class="my_gym_main_header_main">
		<div class="my_gym_main_header_main-menu-left">
			<button class="my_gym_main_header_main-menu-btn" aria-label="Открыть меню">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<line x1="3" y1="12" x2="21" y2="12"></line>
					<line x1="3" y1="6" x2="21" y2="6"></line>
					<line x1="3" y1="18" x2="21" y2="18"></line>
				</svg>
			</button>

			<div class="my_gym_main_header_main-date-selector" :class="{'today': headerDate?.toLowerCase() === 'сегодня'}">
				{{ headerDate || 'Сегодня' }}
			</div>
		</div>

			<div class="my_gym_main_header_main-header-icons">
				<button @click="emit('onClickTimer')" class="my_gym_main_header_main-icon-btn" aria-label="Таймер">
					<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="12" cy="12" r="10"></circle>
						<polyline points="12 6 12 12 16 14"></polyline>
					</svg>
				</button>
				<button @click="emit('onClickCalendar')" class="my_gym_main_header_main-icon-btn" aria-label="Календарь">
					<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
						<line x1="16" y1="2" x2="16" y2="6"></line>
						<line x1="8" y1="2" x2="8" y2="6"></line>
						<line x1="3" y1="10" x2="21" y2="10"></line>
					</svg>
				</button>
<!--				<button class="my_gym_main_header_main-icon-btn" aria-label="Ещё">-->
<!--					<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">-->
<!--						<circle cx="12" cy="12" r="2"></circle>-->
<!--						<circle cx="19" cy="12" r="2"></circle>-->
<!--						<circle cx="5" cy="12" r="2"></circle>-->
<!--					</svg>-->
<!--				</button>-->
			</div>
	</div>
</template>

<style scoped>
.my_gym_main_header_main {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 12px 16px;
	background-color: #f6f7f8;
	z-index: 10;
}
.my_gym_main_header_main-menu-left {
	display: flex;
	align-items: center;
	gap: 25%;
}

.my_gym_main_header_main-menu-btn {
	color: #222;
	display: flex;
	align-items: center;
	padding: 4px;
}

.my_gym_main_header_main-date-selector {
	color: #555;
	padding: 5px 12px;
	border-radius: 8px;
	font-weight: 500;
	font-size: 18px;
	letter-spacing: 0.3px;
	white-space: nowrap;
}
.my_gym_main_header_main-date-selector.today {
	background-color: var(--base-green);
	color: #ffffff;
}

.my_gym_main_header_main-header-icons {
	display: flex;
	gap: 20px;
	align-items: center;
	color: #666;
}

.my_gym_main_header_main-icon-btn {
	display: flex;
	align-items: center;
	color: #888;
	transition: opacity 0.2s;
}
.my_gym_main_header_main-icon-btn:hover {
	opacity: 0.7;
}
.my_gym_main_header_main-icon-btn svg {
	color: var(--base-dark-grey)
}
</style>
