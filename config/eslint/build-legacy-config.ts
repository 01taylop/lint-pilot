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
    files: ['*.spec.*', '*.test.*'],
    plugins: [
      'jest',
      'jest-formatting',
    ],
    rules: {
      ...Rules.Jest,
      ...Rules.JestFormatting,
    },
  }, {
    files: ['*.spec.ts', '*.spec.tsx', '*.test.ts', '*.test.tsx'],
    plugins: [
      'jest',
    ],
    rules: {
      ...Rules.JestTypescript,
    },
  }],
})

export default buildLegacyConfig
