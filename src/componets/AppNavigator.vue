<!-- src/components/AppNavigator.vue -->
<script lang="ts" setup>
import { computed, onMounted, onUnmounted, provide } from 'vue'
import { createNavigationService } from '@/services/NavigationService'
import { NAVIGATION_KEY } from '@/composables/useNavigationStack'

const props = defineProps({
	homeComponent: {
		type: Object,
		required: true
	}
})

const navigation = createNavigationService(props.homeComponent)
provide(NAVIGATION_KEY, navigation)

const stack = computed(() => navigation.stack.value)

// Просто открыть страницу
async function navigateForward(pageName: string, params = {}, transition?: string) {
	await navigation.navigateTo(pageName, params, transition)
}

// Просто закрыть страницу
function goBack() {
	if (navigation.canGoBack.value) {
		navigation.goBack()
	}
}

onMounted(() => {
	navigation.init()
})

onUnmounted(() => {
	navigation.destroy()
})

// Пробрасываем для страниц
provide('navigateForward', navigateForward)
provide('goBack', goBack)
</script>

<template>
	<div class="app-navigator">

		<!-- Все страницы рендерятся друг над другом -->
		<div
			v-for="(page, index) in stack"
			:key="page.id"
			class="page-layer"
			:style="{ zIndex: index + 1 }"
		>
			<component
				:is="page.component"
				v-bind="page.params"
			/>
		</div>

	</div>
</template>

<style scoped>
.app-navigator {
	position: relative;
	width: 100%;
	height: 100vh;
	height: 100dvh;
	overflow: hidden;
}

.page-layer {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}
</style>
