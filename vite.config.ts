import { defineConfig, loadEnv, ConfigEnv, UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path'; // 路径

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
	return {
		base: './',
		resolve: {
			alias: {
				'@': resolve('src'),
			},
		},
		publicDir: resolve('public'),
		mode: mode,
		server: {
			host: '0.0.0.0',
			port: 8080,
			proxy: {
				'/api': {
					target: 'http://localhost:8080',
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api/, ''),
				},
			},
		},
		plugins: [vue()],
	}

});
