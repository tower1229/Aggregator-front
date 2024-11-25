import http from 'http'
import https from 'https'

export function fetch(url: string) {
  return new Promise<string>((resolve, reject) => {
    ;(url.startsWith('https') ? https : http).get(url, res => {
      let data = ''
      res.on('data', chunk => {
        data += chunk
      })
      res.once('end', () => {
        resolve(data)
      })
      res.once('error', e => {
        reject(e)
      })
    })
  })
}
