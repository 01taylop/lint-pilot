import { readFileSync } from 'fs'
import { resolve } from 'path'

import { terser } from 'rollup-plugin-terser'

const packageJSON = JSON.parse(readFileSync(resolve('./package.json'), 'utf-8'))

export default {
  external: Object.keys(packageJSON.dependencies),
  input: 'src/index.js',
  output: {
    file: 'lib/index.min.js',
    format: 'es',
  },
  plugins: [terser()],
}
