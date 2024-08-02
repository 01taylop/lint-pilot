// https://github.com/eslint-community/eslint-plugin-promise

export default {
  'promise/always-return': 2,
  'promise/avoid-new': 0,
  'promise/catch-or-return': 2,
  'promise/no-callback-in-promise': 2,
  'promise/no-multiple-resolved': 2,
  'promise/no-native': 0,
  'promise/no-nesting': 2,
  'promise/no-new-statics': 2,
  'promise/no-promise-in-callback': 2,
  'promise/no-return-in-finally': 2,
  'promise/no-return-wrap': 2,
  'promise/param-names': [2, {
    rejectPattern: '^_?reject',
    resolvePattern: '^_?resolve',
  }],
  'promise/prefer-await-to-callbacks': 0,
  'promise/prefer-await-to-then': 0,
  'promise/valid-params': 2,
}
