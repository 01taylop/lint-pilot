import isUnicodeSupported from 'is-unicode-supported'

jest.mock('is-unicode-supported')

describe('logSymbols', () => {

  afterEach(() => {
    jest.resetModules()
  })

  it('returns Unicode symbols when supported', () => {
    (isUnicodeSupported as jest.Mock).mockReturnValue(true)

    const logSymbols = require('../log-symbols').default

    expect(logSymbols).toEqual({
      error: '✗',
      info: 'ℹ',
      success: '✓',
      tipEmoji: '💡',
      warning: '⚠',
    })
  })

  it('returns fallback symbols when Unicode is not supported', () => {
    (isUnicodeSupported as jest.Mock).mockReturnValue(false)

    const logSymbols = require('../log-symbols').default

    expect(logSymbols).toEqual({
      error: '×',
      info: '[i]',
      success: '√',
      tipEmoji: 'TIP:',
      warning: '‼',
    })
  })
})
