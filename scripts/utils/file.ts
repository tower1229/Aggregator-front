import fs from 'fs'
import { resolve } from 'path'
import { ensureFile } from 'fs-extra'
import { template } from 'lodash'

export async function writeToFile(filePath: string, content: string) {
  await ensureFile(filePath)
  await fs.promises.writeFile(filePath, content, {
    encoding: 'utf8'
  })
}

export async function renderToFile(filePath: string, templateFileName: string, data: object) {
  const tpl = await fs.promises.readFile(resolve(__dirname, '../templates', templateFileName), {
    encoding: 'utf-8'
  })
  const content = template(tpl)(data)
  await writeToFile(filePath, content)
}
