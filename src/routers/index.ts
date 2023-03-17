import { createRouter, createWebHashHistory } from 'vue-router';
// import { defineStore, createPinia } from 'pinia';

const modules = import.meta.glob('@/views/**/*.vue');
const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{
			path: '/',
			redirect: 'pineapple',
		},
		{
			path: '/pineapple',
            name: 'home',
			component: () => import('../views/Home.vue'),
		},
	],
	strict: false,
	scrollBehavior: () => ({ left: 0, top: 0 }),
});

router.beforeEach((to, from, next) => {
	if (to.matched.length === 0) {
		next({ name : 'home' });
	}
	else {
		next();
	}
});

export default router;
