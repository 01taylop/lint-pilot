import { ESLint } from 'eslint'

import colourLog from '@Utils/colourLog'

import eslintLib from '../eslint'

jest.mock('eslint')
jest.mock('@Utils/colourLog')

describe('eslint', () => {

  jest.spyOn(colourLog, 'error').mockImplementation(() => {})

  const testFiles = ['index.ts']
  const lintFilesMock = ESLint.prototype.lintFiles as jest.Mock

  it('creates a new ESLint instance', async () => {
    lintFilesMock.mockImplementationOnce(() => [])

    await eslintLib.lintFiles(testFiles)

    expect(ESLint).toHaveBeenCalledTimes(1)
    expect(ESLint).toHaveBeenCalledWith({
      cache: false,
      fix: false,
    })
  })

  it('calls eslint with the files', async () => {
    lintFilesMock.mockImplementationOnce(() => [])

    await eslintLib.lintFiles(testFiles)

    expect(ESLint.prototype.lintFiles).toHaveBeenCalledTimes(1)
    expect(ESLint.prototype.lintFiles).toHaveBeenCalledWith(testFiles)
  })

  it('exists the process when eslint throws an error', async () => {
    expect.assertions(2)

    const error = new Error('Test error') as any

    lintFilesMock.mockImplementationOnce(() => {
      throw error
    })

    try {
      await eslintLib.lintFiles(testFiles)
    } catch {
      expect(colourLog.error).toHaveBeenCalledOnceWith('An error occurred while running eslint', error)
      expect(process.exit).toHaveBeenCalledWith(1)
    }
  })

  it('resolves with results and a summary when eslint successfully lints (no errors)', async () => {
    const lintResults: Array<ESLint.LintResult> = [{
      errorCount: 0,
      fatalErrorCount: 0,
      filePath: `${process.cwd()}/index.ts`,
      fixableErrorCount: 0,
      fixableWarningCount: 0,
      messages: [],
      suppressedMessages: [],
      usedDeprecatedRules: [],
      warningCount: 0,
    }]

    lintFilesMock.mockImplementationOnce(() => lintResults)

    expect(await eslintLib.lintFiles(testFiles)).toStrictEqual({
      results: {},
      summary: {
        deprecatedRules: [],
        errorCount: 0,
        fileCount: 1,
        fixableErrorCount: 0,
        fixableWarningCount: 0,
        linter: 'ESLint',
        warningCount: 0,
      },
    })
  })

  it('resolves with results and a summary when eslint successfully lints (with errors, warnings, and deprecations)', async () => {
    const lintResults: Array<ESLint.LintResult> = [{
      errorCount: 0,
      fatalErrorCount: 0,
      filePath: `${process.cwd()}/constants.ts`,
      fixableErrorCount: 0,
      fixableWarningCount: 0,
      messages: [],
      suppressedMessages: [],
      usedDeprecatedRules: [],
      warningCount: 0,
    }, {
      errorCount: 4,
      fatalErrorCount: 0,
      filePath: `${process.cwd()}/index.ts`,
      fixableErrorCount: 3,
      fixableWarningCount: 1,
      messages: [{
        column: 1,
        line: 1,
        message: 'Normal rule error',
        ruleId: 'normal-error',
        severity: 2,
      }, {
        column: 1,
        line: 2,
        message: 'Normal rule warning',
        ruleId: 'normal-warning',
        severity: 1,
      }, {
        column: 1,
        line: 3,
        message: 'Error with trailing whitespace ',
        ruleId: 'spaced-error',
        severity: 2,
      }],
      suppressedMessages: [],
      usedDeprecatedRules: [{
        ruleId: 'deprecated-rule-1',
        replacedBy: ['new-rule-1'],
      }],
      warningCount: 2,
    }, {
      errorCount: 1,
      fatalErrorCount: 0,
      filePath: `${process.cwd()}/utils.ts`,
      fixableErrorCount: 0,
      fixableWarningCount: 0,
      // @ts-expect-error - line is required, but for ignored files it is not provided
      messages: [{
        column: 1,
        message: 'Test core error',
        ruleId: null,
        severity: 1,
      }],
      suppressedMessages: [],
      usedDeprecatedRules: [{
        ruleId: 'deprecated-rule-1',
        replacedBy: ['new-rule-1'],
      }, {
        ruleId: 'deprecated-rule-2',
        replacedBy: ['new-rule-2'],
      }],
      warningCount: 0,
    }]

    const commonResult = {
      messageTheme: expect.any(Function),
      positionTheme: expect.any(Function),
      ruleTheme: expect.any(Function),
    }

    lintFilesMock.mockImplementationOnce(() => lintResults)

    expect(await eslintLib.lintFiles(testFiles)).toStrictEqual({
      results: {
        'index.ts': [{
          ...commonResult,
          position: '1:1',
          message: 'Normal rule error',
          rule: 'normal-error',
          severity: 'X',
        }, {
          ...commonResult,
          position: '2:1',
          message: 'Normal rule warning',
          rule: 'normal-warning',
          severity: '!',
        }, {
          ...commonResult,
          position: '3:1',
          message: 'Error with trailing whitespace',
          rule: 'spaced-error',
          severity: 'X',
        }],
        'utils.ts': [{
          ...commonResult,
          position: '1:1',
          message: 'Test core error',
          rule: 'core-error',
          severity: 'X',
        }],
      },
      summary: {
        deprecatedRules: ['deprecated-rule-1', 'deprecated-rule-2'],
        errorCount: 5,
        fileCount: 3,
        fixableErrorCount: 3,
        fixableWarningCount: 1,
        linter: 'ESLint',
        warningCount: 2,
      },
    })
  })
})
