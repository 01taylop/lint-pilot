import { FILE_PATHS } from './constants'
import Overrides from './overrides'
import Plugins from './plugins'
import Rules from './rules'

const buildFlatConfig = () => ([{
  plugins: {
    'eslint-comments': Plugins.EslintComments,
    'import': Plugins.Import,
    'inclusive-language': Plugins.InclusiveLanguage,
    'n': Plugins.N,
    'promise': Plugins.Promise,
    'sort-destructure-keys': Plugins.SortDestructureKeys,
    'sort-exports': Plugins.SortExports,
  },
  rules: {
    ...Rules.ESLintComments,
    ...Rules.Import,
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
    'jest-formatting': Plugins.JestFormatting,
  },
  rules: {
    ...Rules.Jest,
    ...Rules.JestFormatting,
    ...Overrides.TESTS,
  },
}, {
  files: FILE_PATHS.TESTS_TYPESCRIPT,
  rules: {
    ...Rules.JestTypescript,
  },
}])

export default buildFlatConfig
