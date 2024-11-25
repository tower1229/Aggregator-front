// @ts-check
import { resolve as pathResolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import vue from '@vitejs/plugin-vue'
import vueTSX from '@vitejs/plugin-vue-jsx'
import { build } from 'vite'
import windiCSS from 'vite-plugin-windicss'
// import injectImportCss from './injectImportCss.js'

const resolve = (...args) =>
  pathResolve(
    dirname(
      fileURLToPath(
        // @ts-ignore
        import.meta.url
      )
    ),
    '../',
    ...args
  )

;(async () => {
  // const isDev = process.env.NODE_ENV === 'development'
  return build({
    // @ts-ignore
    plugins: [vue(), vueTSX(), windiCSS()],
    build: {
      emptyOutDir: false,
      watch: {
        buildDelay: 1000,
        include: [resolve('../src/**/*.*')]
      },
      outDir: resolve('dist/es'),
      lib: {
        entry: resolve('src/index.ts'),
        fileName: () => 'index.js',
        formats: ['es']
      },
      assetsDir: resolve('src', 'assets'),
      rollupOptions: {
        external: ['vue', 'naive-ui'],
        output: {
          assetFileNames: () => 'index.css'
        }
      }
    }
  })
})()
