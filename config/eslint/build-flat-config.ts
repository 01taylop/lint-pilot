import { FILE_PATHS } from './constants'
import Plugins from './plugins'
import Rules from './rules'

const buildFlatConfig = () => ([{
  plugins: {
    'eslint-comments': Plugins.EslintComments,
    'inclusive-language': Plugins.InclusiveLanguage,
    'promise': Plugins.Promise,
    'sort-destructure-keys': Plugins.SortDestructureKeys,
    'sort-exports': Plugins.SortExports,
  },
  rules: {
    ...Rules.ESLintComments,
    ...Rules.InclusiveLanguage,
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
    'jest-formatting': Plugins.JestFormatting,
  },
  rules: {
    ...Rules.Jest,
    ...Rules.JestFormatting,
  },
}, {
  files: FILE_PATHS.TESTS_TYPESCRIPT,
  rules: {
    ...Rules.JestTypescript,
  },
}])

export default buildFlatConfig
