// @ts-check
// https://github.com/vitejs/vite/issues/1579
import fs from 'fs'
import { resolve } from 'path'

const template = `console.log(\`__INJECT_CSS__$$\`)`

let viteConfig

export default function libInjectCss() {
  return {
    name: 'inject-import-css',

    configResolved(resolvedConfig) {
      viteConfig = resolvedConfig
    },

    transform(code, id) {
      if (id.includes(viteConfig.build.lib.entry)) {
        const matched = code.match(/import\s+['"].+\.css['"]/)
        return {
          code: !matched
            ? code
            : `${template.replace('$$', matched[0])}
          ${code}`
        }
      }
      return { code }
    },

    async writeBundle(_, bundle) {
      for (const file of Object.entries(bundle)) {
        const { root } = viteConfig
        const outDir = viteConfig.build.outDir || 'dist'
        const fileName = file[0]
        const filePath = resolve(root, outDir, fileName)

        try {
          let data = fs.readFileSync(filePath, {
            encoding: 'utf8'
          })
          data = data.replace(/\/\*\* __INJECT_CSS__(import\s+['"].+\.css['"]) \*\//, (_, r) => {
            return r
          })

          fs.writeFileSync(filePath, data)
        } catch (e) {
          console.error(e)
        }
      }
    }
  }
}
