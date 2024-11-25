// @ts-check
import { resolve as pathResolve, dirname, sep } from 'path'
import { fileURLToPath } from 'url'
import windiCssPlugin from '@luncheon/esbuild-plugin-windicss'
import { build } from 'esbuild'
import glob from 'fast-glob'

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

function buildComponent(componentName, isDev) {
  return build({
    entryPoints: [resolve('src', componentName)],
    outfile: resolve('dist/es', componentName, 'index.js'),
    minify: false,
    bundle: true,
    target: ['esnext'],
    format: 'esm',
    platform: 'browser',
    sourcemap: false,
    external: ['vue', 'naive-ui'],
    tsconfig: resolve('tsconfig.json'),
    watch: isDev,
    plugins: [
      // @ts-ignore
      windiCssPlugin({
        windiCssConfig: { prefixer: false }
      })
    ]
  })
}

function buildEntry(isDev) {
  return build({
    entryPoints: [resolve('src/index.ts')],
    outfile: resolve('dist/es/index.js'),
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
  const components = glob.sync('*/index.{ts,tsx}', {
    absolute: false,
    cwd: resolve('src')
  })
  for (const component of components) {
    await buildComponent(component.split(sep)[0], isDev)
  }
  await buildEntry(isDev)
})()
