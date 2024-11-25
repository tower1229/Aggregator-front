// @ts-check
import { resolve as pathResolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import vue from '@vitejs/plugin-vue'
import vueTSX from '@vitejs/plugin-vue-jsx'
import { build as esBuild } from 'esbuild'
import glob from 'fast-glob'
import { build } from 'vite'
import windiCSS from 'vite-plugin-windicss'
// import injectImportCss from './injectImportCss.js'
import libInjectCss from './libInjectCss.js'

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

function getOutputDir(path) {
  return path.replace(/\/.*.tsx?/, '')
}

function getFileName(path) {
  return path
    .split('/')
    .pop()
    .replace(/\.tsx?$/, '.js')
}

function buildComponent(componentName, isDev) {
  // console.log('dir', getOutputDir(componentName))
  // console.log('file', getFileName(componentName))
  return build({
    // @ts-ignore
    plugins: [vue(), vueTSX(), windiCSS(), libInjectCss()],
    build: {
      emptyOutDir: false,
      watch: isDev,
      outDir: resolve('dist/es', getOutputDir(componentName)),
      lib: {
        entry: resolve('src', componentName),
        fileName: () => getFileName(componentName),
        formats: ['es']
      },
      assetsDir: resolve('src', 'assets'),
      rollupOptions: {
        external: ['vue', 'naive-ui']
        // output: {
        //   assetFileNames: assetInfo => {
        //     console.log('asset', assetInfo)
        //     if (assetInfo.name === 'style.css') {
        //       return 'index.css'
        //     }
        //     return assetInfo.name
        //   }
        // }
      }
    }
  })
}

function buildEntry(entry, isDev) {
  return esBuild({
    entryPoints: [resolve('src', entry)],
    outfile: resolve('dist/es', entry.replace(/\/?index.ts/, ''), 'index.js'),
    minify: false,
    bundle: false,
    target: ['esnext'],
    format: 'esm',
    platform: 'browser',
    sourcemap: false,
    tsconfig: resolve('tsconfig.json'),
    watch: isDev
  })
}

;(async () => {
  const isDev = process.env.NODE_ENV === 'development'
  const components = glob.sync('**/*.tsx', {
    absolute: false,
    cwd: resolve('src')
  })
  for (const component of components) {
    await buildComponent(component, isDev)
  }
  const entries = glob.sync('**/index.ts', {
    absolute: false,
    cwd: resolve('src')
  })
  for (const entry of entries) {
    await buildEntry(entry, isDev)
  }
})()
