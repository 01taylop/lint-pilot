import { FILE_PATHS } from './constants'
import Rules from './rules'

const buildLegacyConfig = () => ({
  env: {
    'jest/globals': true,
  },
  plugins: [
    'eslint-comments',
    'inclusive-language',
    'promise',
    'sort-destructure-keys',
    'sort-exports',
  ],
  rules: {
    ...Rules.ESLintComments,
    ...Rules.InclusiveLanguage,
    ...Rules.Promise,
    ...Rules.SortDestructureKeys,
    ...Rules.SortExports,
  },
  overrides: [{
    files: FILE_PATHS.TESTS,
    plugins: [
      'jest',
      'jest-formatting',
    ],
    rules: {
      ...Rules.Jest,
      ...Rules.JestFormatting,
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
})

export default buildLegacyConfig
