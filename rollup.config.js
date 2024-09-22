import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { nodeResolve } from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import typescript from '@rollup/plugin-typescript'
import copy from 'rollup-plugin-copy'
import { terser } from 'rollup-plugin-terser'

const packageJSON = JSON.parse(readFileSync(resolve('./package.json'), 'utf-8'))

const OUTPUT_DIR = 'lib'

const COPY_FILES = [
  'package.json',
  'README.md',
]

const createConfig = inputFile => ({
  external: Object.keys(packageJSON.dependencies),
  input: inputFile,
  output: {
    dir: OUTPUT_DIR,
    format: 'cjs',
  },
  plugins: [
    nodeResolve(),
    typescript(),
  ],
})

export default [{
  external: Object.keys(packageJSON.dependencies),
  input: 'src/index.ts',
  output: {
    file: `${OUTPUT_DIR}/index.min.js`,
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
    typescript(),
    terser(),
    copy({
      targets: COPY_FILES.map(file => ({ src: file, dest: OUTPUT_DIR })),
    }),
  ],
},
  createConfig('config/all-legacy.ts'),
  createConfig('config/all.ts'),
  createConfig('config/stylelint.config.js'),
]
