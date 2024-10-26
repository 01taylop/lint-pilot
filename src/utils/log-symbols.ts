import isUnicodeSupported from 'is-unicode-supported'

const _isUnicodeSupported = isUnicodeSupported()

const error = _isUnicodeSupported ? '✗' : '×'
const info = _isUnicodeSupported ? 'ℹ' : '[i]'
const success = _isUnicodeSupported ? '✓' : '√'
const tipEmoji = _isUnicodeSupported ? '💡' : 'TIP:'
const warning = _isUnicodeSupported ? '⚠' : '‼'

export default {
  error,
  info,
  success,
  tipEmoji,
  warning,
}
