import path from 'path'
import vue from '@vitejs/plugin-vue'
import vueTSX from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'
import windiCSS from 'vite-plugin-windicss'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueTSX(), windiCSS()],
  resolve: {
    alias: {
      '@/ex': path.resolve(__dirname, 'demo'),
      '@/comps': path.resolve(__dirname, 'src')
    },
    extensions: ['.ts', '.tsx', '.js', '.css', '.json']
  },
  server: {
    host: '0.0.0.0',
    port: 3001
  }
})
