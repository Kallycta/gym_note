import { createRouter, createWebHistory } from 'vue-router'

import MainPage from '@/views/MainPage.vue'
import AddWorkout from '@/views/AddWorkout.vue'
import Settings from '@/views/Settings.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),

	routes: [
		{
			path: '/',
			name: 'main',
			component: MainPage,
			meta: {
				root: true,
				transition: 'fade', // 👈 replace style
			},
		},

		{
			path: '/add-workout',
			name: 'add-workout',
			component: AddWorkout,
			meta: {
				modal: true,
				transition: 'slide-up', // 👈 bottom sheet
			},
		},

		{
			path: '/settings',
			name: 'settings',
			component: Settings,
			meta: {
				transition: 'slide-left', // 👈 push style
			},
		},
	],
})

export default router
