import chalk from 'chalk'

import { RuleSeverity } from '@Types/lint'

import { formatResult } from '../format-result'

describe('formatResult', () => {

  const commonResult = {
    column: 5,
    lineNumber: 10,
    message: 'Test message',
    rule: 'test-rule',
    severity: RuleSeverity.ERROR,
  }

  const commonFormattedResult = {
    message: 'Test message',
    messageTheme: chalk.white,
    position: '10:5',
    positionTheme: chalk.dim,
    rule: 'test-rule',
    ruleTheme: chalk.dim,
    severity: 'X',
  }

  it('formats a result with a severity of ERROR', () => {
    const formattedResult = formatResult(commonResult)

    expect(formattedResult).toStrictEqual(commonFormattedResult)
  })

  it('formats a result with a severity of WARNING', () => {
    const formattedResult = formatResult({
      ...commonResult,
      severity: RuleSeverity.WARNING,
    })

    expect(formattedResult).toStrictEqual({
      ...commonFormattedResult,
      severity: '!',
    })
  })

  it('formats a result without a column', () => {
    const formattedResult = formatResult({
      ...commonResult,
      column: undefined,
    })

    expect(formattedResult).toStrictEqual({
      ...commonFormattedResult,
      position: '10',
    })
  })

  it('trims the message', () => {
    const formattedResult = formatResult({
      ...commonResult,
      message: '  Test message  ',
    })

    expect(formattedResult).toStrictEqual(commonFormattedResult)
  })

})
