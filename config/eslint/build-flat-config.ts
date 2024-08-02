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
  files: ['*.spec.*', '*.test.*'],
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
  files: ['*.spec.ts', '*.spec.tsx', '*.test.ts', '*.test.tsx'],
  plugins: {
    'jest': Plugins.jest,
  },
  rules: {
    ...Rules.JestFormatting,
  },
}])

export default buildFlatConfig
