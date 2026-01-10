import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import copy from 'rollup-plugin-copy'
import { terser } from 'rollup-plugin-terser'

const packageJSON = JSON.parse(readFileSync(resolve('./package.json'), 'utf-8'))

const OUTPUT_DIR = 'lib'

const COPY_FILES = [
  'config/markdownlint.json',
]

const createConfig = (configFile, format) => ({
  external: Object.keys(packageJSON.dependencies),
  input: configFile,
  output: {
    dir: OUTPUT_DIR,
    format,
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
    json(),
    nodeResolve({
      preferBuiltins: true,
    }),
    typescript(),
    terser(),
    copy({
      targets: COPY_FILES.map(file => ({ src: file, dest: OUTPUT_DIR })),
    }),
  ],
},
  createConfig('config/all-legacy.ts', 'cjs'),
  createConfig('config/all.ts', 'es'),
  createConfig('config/stylelint.config.js', 'cjs'),
]
