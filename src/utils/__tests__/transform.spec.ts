import chalk from 'chalk'

import { LogType } from '@Types'

import { formatFileLog, pluralise } from '../transform'

describe('formatFileLog', () => {

  const commonLog = {
    column: 1,
    lineNumber: 1,
    message: 'This is an error message',
    rule: 'no-error',
    type: LogType.ERROR,
  }

  it('formats the file log with a padded message and theme', () => {
    const result = formatFileLog(commonLog)

    expect(result).toStrictEqual(expect.objectContaining({
      message: ' This is an error message ',
      messageTheme: chalk.white,
    }))
  })

  it('truncates the message when it exceeds 72 characters', () => {
    const result = formatFileLog({
      ...commonLog,
      message: 'This is a very long error message. So long that it exceeds 72 characters.',
    })

    expect(result).toStrictEqual(expect.objectContaining({
      message: ' This is a very long error message. So long that it exceeds 72 charact... ',
      messageTheme: chalk.white,
    }))
  })

  it('formats the file log with a padded position: line number and column number', () => {
    const result = formatFileLog(commonLog)

    expect(result).toStrictEqual(expect.objectContaining({
      position: ' 1:1 ',
      positionTheme: chalk.dim,
    }))
  })

  it('formats the file log with a padded position: only line number', () => {
    const result = formatFileLog({
      ...commonLog,
      column: undefined,
      lineNumber: 7,
    })

    expect(result).toStrictEqual(expect.objectContaining({
      position: ' 7 ',
      positionTheme: chalk.dim,
    }))
  })

  it('formats the file log with a padded rule', () => {
    const result = formatFileLog(commonLog)

    expect(result).toStrictEqual(expect.objectContaining({
      rule: ' no-error',
      ruleTheme: chalk.dim,
    }))
  })

  it('formats the file log with padded type for an error', () => {
    const result = formatFileLog(commonLog)

    expect(result).toStrictEqual(expect.objectContaining({
      type: 'X ',
    }))
  })

  it('formats the file log with padded type for a warning', () => {
    const result = formatFileLog({
      ...commonLog,
      type: LogType.WARNING,
    })

    expect(result).toStrictEqual(expect.objectContaining({
      type: '! ',
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
