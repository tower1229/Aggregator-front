import { readdir, readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import { convertCamelCase } from '@aggregator/utils'
import { compileTemplate } from '@vue/compiler-sfc'
import { ensureFile } from 'fs-extra'
import { optimize } from 'svgo'

const sourceDir = join(__dirname, '../src')
const outlinedDir = join(sourceDir, 'outlined')
const filledDir = join(sourceDir, 'filled')
const targetDir = join(__dirname, '../dist')

const typeDeclaration = `VNode<RendererNode, RendererElement, {
  [key: string]: any;
}>`

function optimizeSvg(filename: string, content: string): string {
  const ret: any = optimize(content, {
    path: filename,
    js2svg: {
      indent: 2, // string with spaces or number of spaces. 4 by default
      pretty: true // boolean, false by default
    },
    plugins: ['removeXMLNS']
  })
  if (ret.error) {
    return content
  }
  return ret.data
}

function compileSvg(filename: string, content: string) {
  const { code } = compileTemplate({
    id: filename,
    source: content,
    filename
  })
  return code.replace('export function render(', 'export default function render(')
}

async function buildSvg(suffix: string, dirPath: string, filename: string) {
  const svgFile = join(dirPath, filename)
  const content = await readFile(svgFile, { encoding: 'utf-8' })
  const CamelCaseFilename = convertCamelCase(filename, true)
  const optimized = optimizeSvg(CamelCaseFilename, content)
  const componentCode = compileSvg(CamelCaseFilename, optimized)
  const typeDir = suffix.toLowerCase()
  const componentName = CamelCaseFilename.replace(/\.svg/, '')
  const targetFile = join(targetDir, typeDir, CamelCaseFilename.replace(/\.svg/, `.js`))
  await ensureFile(targetFile)
  await writeFile(targetFile, componentCode, {
    encoding: 'utf-8'
  })
  // entry file
  return [
    `export { default as ${componentName}${suffix} } from './${typeDir}/${componentName}.js'`,
    `export function ${componentName}${suffix}(props?: { class?: string; onClick?: (e:Event) => void }): ${typeDeclaration}`
  ]
}

async function build() {
  const exportEntries = []
  const exportTypes = [`import type { RendererElement, RendererNode, VNode } from "vue"`, '']
  let svgs = await readdir(outlinedDir)
  for (const svg of svgs) {
    if (svg.match(/\.svg$/)) {
      const [entry, types] = await buildSvg('Outlined', outlinedDir, svg)
      exportEntries.push(entry)
      exportTypes.push(types)
    }
  }
  svgs = await readdir(filledDir)
  for (const svg of svgs) {
    if (svg.match(/\.svg$/)) {
      const [entry, types] = await buildSvg('Filled', filledDir, svg)
      exportEntries.push(entry)
      exportTypes.push(types)
    }
  }
  const entryFile = join(targetDir, 'index.esm.js')
  await ensureFile(entryFile)
  await writeFile(entryFile, exportEntries.join('\n'), {
    encoding: 'utf-8'
  })
  const typeFile = join(targetDir, 'index.d.ts')
  await ensureFile(typeFile)
  await writeFile(typeFile, exportTypes.join('\n'), {
    encoding: 'utf-8'
  })
}

build()
