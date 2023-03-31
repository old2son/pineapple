import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from '@/routers/index';
import './style.css';
import App from './App.vue';

const app = createApp(App);
const pinia = createPinia();

// setup语法糖下 $reset 失效处理
pinia.use(({ store }) => {
	const initialState = JSON.parse(JSON.stringify(store.$state));
	store.$reset = () => {
		store.$state = JSON.parse(JSON.stringify(initialState));
	};
});

app.use(router).use(pinia).mount('#app');
