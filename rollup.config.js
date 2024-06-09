import { terser } from 'rollup-plugin-terser'

export default {
  input: 'src/index.js',
  output: {
    file: 'lib/index.min.js',
    format: 'es',
  },
  plugins: [terser()],
}
