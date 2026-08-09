// src/composables/useNavigationStack.ts
import { inject, computed } from 'vue'

// Ключ для provide/inject
export const NAVIGATION_KEY = Symbol('navigation')

interface NavigationService {
  stack: any
  currentPage: any
  canGoBack: any
  isTransitioning: any
  navigateTo: (pageName: string, params?: Record<string, any>, transition?: string | null) => Promise<any>
  goBack: () => boolean
  popTopPage: () => any
  removePage: (pageId: string) => boolean
  cleanup: (maxPages?: number) => void
  destroy: () => void
}

// Использовать в любом компоненте для доступа к навигации
export function useNavigationStack() {
  const navigation = inject<NavigationService | null>(NAVIGATION_KEY, null)

  if (!navigation) {
    throw new Error(
      'useNavigationStack() должен использоваться внутри компонента-потомка AppNavigator'
    )
  }

  // Дополнительные удобные методы
  const navigateWithCheck = async (pageName: string, params: Record<string, any>, transition: string | null) => {
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
