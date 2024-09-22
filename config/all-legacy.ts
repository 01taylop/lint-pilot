import { FILE_PATHS } from './eslint/constants'
import Rules from './eslint/rules'

export default {
  env: {
    'jest/globals': true,
  },
  plugins: [
    'eslint-comments',
    'inclusive-language',
    'n',
    'promise',
    'sort-destructure-keys',
    'sort-exports',
  ],
  rules: {
    ...Rules.ESLintComments,
    ...Rules.InclusiveLanguage,
    ...Rules.N,
    ...Rules.Promise,
    ...Rules.SortDestructureKeys,
    ...Rules.SortExports,
  },
  overrides: [{
    files: FILE_PATHS.TESTS,
    plugins: [
      'jest',
    ],
    rules: {
      ...Rules.Jest,
    },
  }, {
    files: FILE_PATHS.TESTS_TYPESCRIPT,
    plugins: [
      'jest',
    ],
    rules: {
      ...Rules.JestTypescript,
    },
  }],
}
