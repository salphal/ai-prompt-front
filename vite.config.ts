import react from '@vitejs/plugin-react';
import { ConfigEnv, defineConfig, UserConfig } from 'vite';

/**
 * https://vitejs.dev/config/
 *
 * @param command {string} - 执行的命令
 * @param mode {string} - 环境
 */
export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': '/src',
        '@components': '/src/components',
      },
    },
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
  };
});
