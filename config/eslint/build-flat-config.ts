import { FILE_PATHS } from './constants'
import Plugins from './plugins'
import Rules from './rules'

const buildFlatConfig = () => ([{
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
  rules: {
    ...Rules.JestTypescript,
  },
}])

export default buildFlatConfig
