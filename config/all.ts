import { FILE_PATHS } from './eslint/constants'
import Plugins from './eslint/plugins'
import Rules from './eslint/rules'

export default [{
  plugins: {
    'eslint-comments': Plugins.EslintComments,
    'inclusive-language': Plugins.InclusiveLanguage,
    'n': Plugins.N,
    'promise': Plugins.Promise,
    'sort-destructure-keys': Plugins.SortDestructureKeys,
    'sort-exports': Plugins.SortExports,
  },
  rules: {
    ...Rules.ESLintComments,
    ...Rules.InclusiveLanguage,
    ...Rules.N,
    ...Rules.Promise,
    ...Rules.SortDestructureKeys,
    ...Rules.SortExports,
  },
}, {
  files: FILE_PATHS.TESTS,
  languageOptions: {
    globals: {
      'jest/globals': true,
    },
  },
  plugins: {
    'jest': Plugins.Jest,
  },
  rules: {
    ...Rules.Jest,
  },
}, {
  files: FILE_PATHS.TESTS_TYPESCRIPT,
  languageOptions: {
    globals: {
      'jest/globals': true,
    },
  },
  plugins: {
    'jest': Plugins.Jest,
  },
  rules: {
    ...Rules.JestTypescript,
  },
}]
