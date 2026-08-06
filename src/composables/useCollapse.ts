// @/composables/useCollapse.ts
import { ref, nextTick, type Ref } from 'vue'

export const useCollapse = (initialState = false) => {
	const isOpen = ref(initialState)
	const bodyRef = ref<HTMLElement | null>(null)

	const toggle = async () => {
		isOpen.value = !isOpen.value
		await nextTick()

		const el = bodyRef.value
		if (!el) return // Проверка один раз, а не в каждой строчке!

		if (isOpen.value) {
			el.style.height = '0px'
			el.style.overflow = 'hidden'
			const height = el.scrollHeight + 'px'

			requestAnimationFrame(() => {
				el.style.transition = 'height 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)'
				el.style.height = height
			})
		} else {
			const currentHeight = el.scrollHeight + 'px'
			el.style.transition = 'height 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)'
			el.style.height = currentHeight

			requestAnimationFrame(() => {
				el.style.height = '0px'
			})
		}
	}

	return {
		isOpen,
		bodyRef,
		toggle
	}
}
