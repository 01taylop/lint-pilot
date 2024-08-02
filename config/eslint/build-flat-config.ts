import { FILE_PATHS } from './constants'
import Plugins from './plugins'
import Rules from './rules'

const buildFlatConfig = () => ([{
  plugins: {
    'eslint-comments': Plugins.eslintComments,
    'inclusive-language': Plugins.inclusiveLanguage,
    'promise': Plugins.promise,
    'sort-destructure-keys': Plugins.sortDestructureKeys,
    'sort-exports': Plugins.sortExports,
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
    'jest': Plugins.jest,
    'jest-formatting': Plugins.jestFormatting,
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