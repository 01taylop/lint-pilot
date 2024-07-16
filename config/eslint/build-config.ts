import InclusiveLanguage from './rules/inclusive-language'
import SortDestructureKeys from './rules/sort-destructure-keys'
import SortExports from './rules/sort-exports'

const buildConfig = () => ({
  plugins: [
    'inclusive-language',
    'sort-destructure-keys',
    'sort-exports',
  ],
  rules: {
    ...InclusiveLanguage,
    ...SortDestructureKeys,
    ...SortExports,
  },
})

export default buildConfig
