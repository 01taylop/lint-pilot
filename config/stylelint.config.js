import Rules from './stylelint/rules'

export default () => ({
  extends: [
    'stylelint-config-property-sort-order-smacss',
  ],
  overrides: [{
    files: ['**/*.scss'], // TODO: Extend and make dry
    rules: {
      'at-rule-no-unknown': null, // scss/at-rule-no-unknown
      'function-no-unknown': null, // scss/function-no-unknown
      'property-no-unknown': null, // scss/property-no-unknown
      ...Rules.DeclarationStrictValue,
      ...Rules.SCSS,
    },
  }],
  plugins: [
    '@stylistic/stylelint-plugin',
    'stylelint-declaration-strict-value',
    'stylelint-order',
    'stylelint-scss',
  ],
  rules: {
    ...Rules.Order,
    ...Rules.Stylelint,
    ...Rules.Stylistic,
  },
})
