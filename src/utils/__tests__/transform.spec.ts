import chalk from 'chalk'

import { RuleSeverity } from '@Types'

import { formatResult, pluralise } from '../transform'

describe('formatResult', () => {

  const commonResult = {
    column: 1,
    lineNumber: 1,
    message: 'This is an error message',
    rule: 'no-error',
    severity: RuleSeverity.ERROR,
  }

  it('formats the result with a message and theme', () => {
    const formattedResult = formatResult(commonResult)

    expect(formattedResult).toStrictEqual(expect.objectContaining({
      message: 'This is an error message',
      messageTheme: chalk.white,
    }))
  })

  it('truncates the message when it exceeds 72 characters', () => {
    const formattedResult = formatResult({
      ...commonResult,
      message: 'This is a very long error message. So long that it exceeds 72 characters.',
    })

    expect(formattedResult).toStrictEqual(expect.objectContaining({
      message: 'This is a very long error message. So long that it exceeds 72 charact...',
      messageTheme: chalk.white,
    }))
  })

  it('formats the result with a position: line number and column number', () => {
    const formattedResult = formatResult(commonResult)

    expect(formattedResult).toStrictEqual(expect.objectContaining({
      position: '1:1',
      positionTheme: chalk.dim,
    }))
  })

  it('formats the result with a position: only line number', () => {
    const formattedResult = formatResult({
      ...commonResult,
      column: undefined,
      lineNumber: 7,
    })

    expect(formattedResult).toStrictEqual(expect.objectContaining({
      position: '7',
      positionTheme: chalk.dim,
    }))
  })

  it('formats the result with a rule', () => {
    const formattedResult = formatResult(commonResult)

    expect(formattedResult).toStrictEqual(expect.objectContaining({
      rule: 'no-error',
      ruleTheme: chalk.dim,
    }))
  })

  it('formats the result with a rule severity of error', () => {
    const formattedResult = formatResult(commonResult)

    expect(formattedResult).toStrictEqual(expect.objectContaining({
      severity: 'X',
    }))
  })

  it('formats the result with a rule severity of warning', () => {
    const formattedResult = formatResult({
      ...commonResult,
      severity: RuleSeverity.WARNING,
    })

    expect(formattedResult).toStrictEqual(expect.objectContaining({
      severity: '!',
    }))
  })
})

describe('pluralise', () => {

  it('returns the original word if count is 1', () => {
    expect(pluralise('apple', 1)).toBe('apple')
  })

  it('returns the pluralised word if count is not 1', () => {
    expect(pluralise('apple', 0)).toBe('apples')
    expect(pluralise('apple', 2)).toBe('apples')
  })

})
