import ESLintComments from './rules/eslint-comments'
import InclusiveLanguage from './rules/inclusive-language'
import { JestRules, JestTypescriptRules } from './rules/jest'
import PromiseRules from './rules/promise'
import SortDestructureKeys from './rules/sort-destructure-keys'
import SortExports from './rules/sort-exports'

const buildConfig = () => ({
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
    ...ESLintComments,
    ...InclusiveLanguage,
    ...PromiseRules,
    ...SortDestructureKeys,
    ...SortExports,
  },
  overrides: [{
    files: ['*.spec.*', '*.test.*'],
    plugins: [
      'jest',
    ],
    rules: {
      ...JestRules,
    },
  }, {
    files: ['*.spec.ts', '*.spec.tsx', '*.test.ts', '*.test.tsx'],
    rules: {
      ...JestTypescriptRules,
    },
  }],
})

export default buildConfig
