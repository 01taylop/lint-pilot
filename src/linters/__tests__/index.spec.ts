import { Linter } from '@Types'

import linters from '..'

describe('linters', () => {

  it('registers each of the linters', () => {
    expect(Object.keys(linters)).toStrictEqual([
      Linter.ESLint,
      Linter.Markdownlint,
      Linter.Stylelint,
    ])
  })

  it('exposes a lintFiles function for each linter', () => {
    for (const linter of Object.values(linters)) {
      expect(typeof linter.lintFiles).toBe('function')
    }
  })

})
