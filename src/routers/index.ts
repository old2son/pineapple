import { createRouter, createWebHashHistory } from 'vue-router';
// import { defineStore, createPinia } from 'pinia';

const modules = import.meta.glob('@/views/**/*.vue');
const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{
			path: '/',
			redirect: 'home',
		},
		{
			path: '/home',
            name: 'home',
			component: () => import('../views/Home.vue'),
		},
	],
	strict: false,
	scrollBehavior: () => ({ left: 0, top: 0 }),
});

export default router;
