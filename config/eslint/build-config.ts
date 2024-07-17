import ESLintComments from './rules/eslint-comments'
import InclusiveLanguage from './rules/inclusive-language'
import SortDestructureKeys from './rules/sort-destructure-keys'
import SortExports from './rules/sort-exports'

const buildConfig = () => ({
  plugins: [
    'eslint-comments',
    'inclusive-language',
    'sort-destructure-keys',
    'sort-exports',
  ],
  rules: {
    ...ESLintComments,
    ...InclusiveLanguage,
    ...SortDestructureKeys,
    ...SortExports,
  },
})

export default buildConfig
