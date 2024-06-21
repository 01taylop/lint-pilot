import { commonOverrides } from './overrides'
import ImportRules from './rules/import'
import InclusiveLanguageRules from './rules/inclusive-language'

const buildConfig = () => ({
  plugins: [
    'import',
    'inclusive-language',
  ],
  rules: {
    ...ImportRules,
    ...InclusiveLanguageRules,
  },
  overrides: [
    commonOverrides,
  ],
})

export default buildConfig
