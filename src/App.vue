<!-- src/App.vue -->
<script setup lang="ts">

import MainPage from '@/views/MainPage.vue'
import AppNavigator from '@/componets/AppNavigator.vue'
</script>

<template>
	<AppNavigator :home-component="MainPage" />
</template>

<style>
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

body {
	overflow: hidden;
}

#app {
	width: 100%;
	height: 100vh;
}
</style>
