import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from '@/routers/index';
import './style.css';
import App from './App.vue';

const app = createApp(App);
const pinia = createPinia();
app.use(router).use(pinia).mount('#app');
