// src/services/NavigationService.js
import { ref, readonly, markRaw, computed } from 'vue'

export const pageRegistry = {
	home: {
		component: null,
		defaultTransition: null
	},
	addWorkout: {
		component: () => import('@/views/AddWorkout.vue'),
		defaultTransition: 'slide-left'
	},
	settings: {
		component: () => import('@/views/Settings.vue'),
		defaultTransition: 'slide-bottom'
	},
	listWorkouts: {
		component: () => import('@/views/ListWorkouts.vue'),
		defaultTransition: 'slide-bottom'
	},
	exerciseList: {
		component: () => import('@/views/ExerciseList.vue'),
		defaultTransition: 'none'
	},

}

const stack = ref([])
const isTransitioning = ref(false)

export function createNavigationService(homeComponent) {

	function init() {
		stack.value = [{
			id: 'home',
			name: 'home',
			transition: null,
			component: markRaw(homeComponent),
			params: {},
			timestamp: Date.now()
		}]

		window.history.replaceState({ depth: 1 }, '', '/')
		window.addEventListener('popstate', handleBrowserBack)
		
		// Проверяем текущий URL и открываем нужную страницу если это не '/'
		checkInitialRoute()
	}
	
	async function checkInitialRoute() {
		const path = window.location.pathname.slice(1) // убираем ведущий '/'
		
		if (!path || path === '/') return
		
		// Нормализуем путь: add-workout -> addWorkout
		const pageName = path.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase())
		
		if (pageRegistry[pageName]) {
			await navigateTo(pageName, {}, null)
		}
	}

	async function navigateTo(pageName, params = {}, transitionOverride = null) {
		if (isTransitioning.value) return false


		const config = pageRegistry[pageName]
		if (!config) {
			console.error(`Страница "${pageName}" не найдена в pageRegistry`)
			return false
		}

		isTransitioning.value = true

		try {
			const resolvedComponent = config.component
				? (await config.component()).default
				: null

			if (!resolvedComponent) {
				throw new Error(`Компонент для "${pageName}" не загружен`)
			}

			const newPage = {
				id: generateId(),
				name: pageName,
				transition: transitionOverride || config.defaultTransition || 'slide-left',
				component: resolvedComponent,
				params: params || {},
				timestamp: Date.now()
			}

			stack.value.push(newPage)

			window.history.pushState(
				{ depth: stack.value.length, pageId: newPage.id },
				'',
				`/${pageName}`
			)

			return newPage.id // ← Возвращаем ID новой страницы

		} catch (error) {
			console.error('Ошибка навигации:', error)
			return false

		} finally {
			setTimeout(() => {
				isTransitioning.value = false
			}, 50)
		}
	}

	// Обычный goBack — удаляет сразу (для кнопки браузера)
	function goBack() {
		if (stack.value.length <= 1) return false
		stack.value.pop()
		window.history.back()
		return true
	}

	// Мягкое удаление — для анимации (удаляет ПОСЛЕ того как анимация закончится)
	function removePage(pageId: string) {
		const index = stack.value.findIndex(p => p.id === pageId)
		if (index === -1 || index === stack.value.length - 1) return false

		stack.value.splice(index, 1)
		return true
	}

	// Удалить верхнюю страницу (после анимации)
	function popTopPage() {
		if (stack.value.length <= 1) return null

		const removed = stack.value.pop()
		window.history.back()
		return removed
	}

	function handleBrowserBack(event: PopStateEvent) {
		if (isTransitioning.value) {
			event.preventDefault()
			window.history.forward()
			return
		}

		if (stack.value.length > 1) {
			const expectedDepth = event.state?.depth || 1

			while (stack.value.length > expectedDepth) {
				stack.value.pop()
			}
		}
	}

	function cleanup(maxPages = 15) {
		if (stack.value.length > maxPages) {
			stack.value.splice(1, stack.value.length - maxPages)
		}
	}

	function destroy() {
		window.removeEventListener('popstate', handleBrowserBack)
	}

	return {
		stack: readonly(stack),
		currentPage: computed(() => stack.value[stack.value.length - 1]),
		canGoBack: computed(() => stack.value.length > 1),
		init,
		navigateTo,
		goBack,
		popTopPage,      // ← НОВЫЙ: удаляет верхнюю страницу
		removePage,      // ← НОВЫЙ: удаляет конкретную страницу
		cleanup,
		destroy,
		isTransitioning: readonly(isTransitioning)
	}
}

function generateId(): string {
	return Date.now().toString(36) + Math.random().toString(36).substring(2)
}
