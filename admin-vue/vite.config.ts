import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import path from "path";
import VueSetupExtend from 'vite-plugin-vue-setup-extend';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers';

export default defineConfig({
  base: './',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 7000,
    open: true, // 服务启动时自动在浏览器打开
    https: false, // 是否启用http2
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:7001/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
    hmr: true, // 开启热更新
    strictPort: false, //
  },
  plugins: [
    vue(),
    VueSetupExtend(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],
  optimizeDeps: {
    include: ['schart.js']
  }
});
