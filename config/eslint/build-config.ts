import InclusiveLanguageRules from './rules/inclusive-language'
import SortDestructureKeysRules from './rules/sort-destructure-keys'

const buildConfig = () => ({
  plugins: [
    'inclusive-language',
    'sort-destructure-keys',
  ],
  rules: {
    ...InclusiveLanguageRules,
    ...SortDestructureKeysRules,
  },
})

export default buildConfig
