// src/composables/useNavigationStack.js
import { inject, computed } from 'vue'

// Ключ для provide/inject
export const NAVIGATION_KEY = Symbol('navigation')

// Использовать в любом компоненте для доступа к навигации
export function useNavigationStack() {
	const navigation = inject(NAVIGATION_KEY)

	if (!navigation) {
		throw new Error(
			'useNavigationStack() должен использоваться внутри компонента-потомка AppNavigator'
		)
	}

	// Дополнительные удобные методы
	const navigateWithCheck = async (pageName, params, transition) => {
		if (navigation.isTransitioning.value) {
			console.warn('Переход уже выполняется')
			return false
		}
		return await navigation.navigateTo(pageName, params, transition)
	}

	return {
		...navigation,
		navigateWithCheck,
		isHome: computed(() => navigation.stack.value.length === 1)
	}
}
