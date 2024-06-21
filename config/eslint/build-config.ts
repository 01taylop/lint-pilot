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
})

export default buildConfig
