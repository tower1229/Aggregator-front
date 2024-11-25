import type { Options } from 'tsup'

export const tsup: Options = {
  clean: true,
  format: ['esm'],
  outDir: 'dist',
  target: 'es2020',
  legacyOutput: true,
  entryPoints: ['src']
}
