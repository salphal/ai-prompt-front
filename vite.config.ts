import react from '@vitejs/plugin-react';
import { ConfigEnv, defineConfig, loadEnv, UserConfig } from 'vite';

/**
 * https://vitejs.dev/config/
 *
 * @param command {string} - 执行的命令
 * @param mode {string} - 环境
 */
export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
  console.log('=>(vite.config.ts:11) mode', mode);
  console.log('=>(vite.config.ts:11) command', command);
  console.log('=>(vite.config.ts:11) command', process.cwd());

  const root = process.cwd(); // 根目录
  /**
   * @param mode {string} - 环境
   * @param root {string} - 目录
   * @param prefix {string} - 仅读取该前缀的环境变量
   *
   * @return {[key: string]: string} - 返回的值类型都是字符串
   */
  const envs = loadEnv(mode, root, 'VITE_');
  console.log('=>(vite.config.ts:22) envs', envs);

  return {
    server: {
      port: 3000,
      open: true,
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': '/src',
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
