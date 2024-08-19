import Rules from './stylelint/rules'

export default () => ({
  extends: [
    'stylelint-config-property-sort-order-smacss',
  ],
  overrides: [{
    files: ['**/*.scss'], // TODO: Extend and make dry
    rules: {
      'annotation-no-unknown': null,
      'at-rule-no-unknown': null, // scss/at-rule-no-unknown
      'comment-no-empty': null, // scss/comment-no-empty
      'function-no-unknown': null, // scss/function-no-unknown
      'import-notation': 'string',
      'media-query-no-invalid': null,
      'no-invalid-position-at-import-rule': [true, {
				ignoreAtRules: ['use', 'forward'],
			}],
      'property-no-unknown': null, // scss/property-no-unknown
      ...Rules.DeclarationStrictValue,
      ...Rules.Scss,
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
