import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { nodeResolve } from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
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
    nodeResolve({
      preferBuiltins: true,
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      preventAssignment: true,
    }),
    terser(),
    typescript(),
  ],
}
