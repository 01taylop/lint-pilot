import { readFileSync } from 'fs'
import { resolve } from 'path'

import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'

const packageJSON = JSON.parse(readFileSync(resolve('./package.json'), 'utf-8'))

export default {
  external: Object.keys(packageJSON.dependencies),
  input: 'src/index.ts',
  output: {
    file: 'lib/index.min.js',
    format: 'es',
  },
  plugins: [
    terser(),
    typescript(),
  ],
}
