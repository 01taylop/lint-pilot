import InclusiveLanguageRules from './rules/inclusive-language'

const buildConfig = () => ({
  plugins: [
    'inclusive-language',
  ],
  rules: {
    ...InclusiveLanguageRules,
  },
})

export default buildConfig
