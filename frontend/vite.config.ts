import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
// import {componentTagger} from 'lovable-tagger';

// https://vite.dev/config/
export default defineConfig({
  server: {
    host:'::',
    port: 8080,
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:8000',
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, ''),
    //   },
    // },
  },
  plugins: [react()],
  resolve
: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
