import { ESLint } from 'eslint'

import { expectedResultThemes } from '@Jest/testData'
import colourLog from '@Utils/colourLog'

import eslintLib from '../eslint'

jest.mock('eslint')
jest.mock('@Utils/colourLog')

describe('eslint', () => {

  jest.spyOn(colourLog, 'error').mockImplementation(() => {})

  const testFiles = ['index.ts']
  const lintFilesMock = ESLint.prototype.lintFiles as jest.Mock
  const outputFixesMock = ESLint.outputFixes as jest.Mock

  const noErrorLintResults: Array<ESLint.LintResult> = [{
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

  it('creates a new ESLint instance', async () => {
    lintFilesMock.mockImplementationOnce(() => [])

    await eslintLib.lintFiles({
      files: testFiles,
      fix: false
    })

    expect(ESLint).toHaveBeenCalledOnceWith({
      cache: false,
      fix: false,
    })
  })

  it('calls ESLint.lintFiles with the files', async () => {
    lintFilesMock.mockImplementationOnce(() => [])

    await eslintLib.lintFiles({
      files: testFiles,
      fix: false
    })

    expect(ESLint.prototype.lintFiles).toHaveBeenCalledOnceWith(testFiles)
  })

  it('exists the process when eslint throws an error', async () => {
    expect.assertions(2)

    const error = new Error('Test error')

    lintFilesMock.mockImplementationOnce(() => {
      throw error
    })

    try {
      await eslintLib.lintFiles({
        files: testFiles,
        fix: false
      })
    } catch {
      expect(colourLog.error).toHaveBeenCalledOnceWith('An error occurred while running eslint', error)
      expect(process.exit).toHaveBeenCalledWith(1)
    }
  })

  it('returns results and a summary when eslint successfully lints (no files)', async () => {
    const lintResults: Array<ESLint.LintResult> = []

    lintFilesMock.mockImplementationOnce(() => lintResults)

    expect(await eslintLib.lintFiles({
      files: [],
      fix: false
    })).toStrictEqual({
      results: {},
      summary: {
        deprecatedRules: [],
        errorCount: 0,
        fileCount: 0,
        fixableErrorCount: 0,
        fixableWarningCount: 0,
        linter: 'ESLint',
        warningCount: 0,
      },
    })
  })

  it('returns results and a summary when eslint successfully lints (no errors)', async () => {
    lintFilesMock.mockImplementationOnce(() => noErrorLintResults)

    expect(await eslintLib.lintFiles({
      files: testFiles,
      fix: false
    })).toStrictEqual({
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

  it('returns results and a summary when eslint successfully lints (with errors, warnings, and deprecations)', async () => {
    const commonResult = {
      fatalErrorCount: 0,
      suppressedMessages: [],
    }

    const lintResults: Array<ESLint.LintResult> = [{
      // No errors or warnings
      ...commonResult,
      errorCount: 0,
      filePath: `${process.cwd()}/constants.ts`,
      fixableErrorCount: 0,
      fixableWarningCount: 0,
      messages: [],
      usedDeprecatedRules: [],
      warningCount: 0,
    }, {
      // 3 errors (2 fixable), 2 warnings (1 fixable), 2 deprecated rules
      ...commonResult,
      errorCount: 3,
      filePath: `${process.cwd()}/index.ts`,
      fixableErrorCount: 2,
      fixableWarningCount: 1,
      messages: [{
        column: 1,
        line: 1,
        message: 'Error rule 1',
        ruleId: 'error-rule-1',
        severity: 2,
      }, {
        column: 1,
        line: 2,
        message: 'Error rule 2',
        ruleId: 'error-rule-2',
        severity: 2,
      }, {
        column: 1,
        line: 3,
        message: 'Warning rule 1',
        ruleId: 'warning-rule-1',
        severity: 1,
      }, {
        column: 2,
        line: 4,
        message: 'Warning rule 2',
        ruleId: 'warning-rule-2',
        severity: 1,
      }, {
        column: 1,
        line: 5,
        message: 'Error with trailing whitespace ',
        ruleId: 'spaced-error',
        severity: 2,
      }],
      usedDeprecatedRules: [{
        ruleId: 'deprecated-rule-1',
        replacedBy: ['new-rule-1'],
      }, {
        ruleId: 'deprecated-rule-2',
        replacedBy: ['new-rule-2'],
      }],
      warningCount: 2,
    }, {
      // 1 error (with no line), 2 deprecated rules (one already reported)
      ...commonResult,
      errorCount: 1,
      filePath: `${process.cwd()}/utils.ts`,
      fixableErrorCount: 0,
      fixableWarningCount: 0,
      // @ts-expect-error - `line` is required, but for ignored files it is not provided
      messages: [{
        column: 1,
        message: 'Core error',
        ruleId: null,
        severity: 1,
      }],
      usedDeprecatedRules: [{
        ruleId: 'deprecated-rule-2',
        replacedBy: ['new-rule-2'],
      }, {
        ruleId: 'deprecated-rule-3',
        replacedBy: ['new-rule-3'],
      }],
      warningCount: 0,
    }]

    lintFilesMock.mockImplementationOnce(() => lintResults)

    expect(await eslintLib.lintFiles({
      files: testFiles,
      fix: false
    })).toStrictEqual({
      results: {
        'index.ts': [{
          ...expectedResultThemes,
          position: '1:1',
          message: 'Error rule 1',
          rule: 'error-rule-1',
          severity: 'X',
        }, {
          ...expectedResultThemes,
          position: '2:1',
          message: 'Error rule 2',
          rule: 'error-rule-2',
          severity: 'X',
        }, {
          ...expectedResultThemes,
          position: '3:1',
          message: 'Warning rule 1',
          rule: 'warning-rule-1',
          severity: '!',
        }, {
          ...expectedResultThemes,
          position: '4:2',
          message: 'Warning rule 2',
          rule: 'warning-rule-2',
          severity: '!',
        }, {
          ...expectedResultThemes,
          position: '5:1',
          message: 'Error with trailing whitespace',
          rule: 'spaced-error',
          severity: 'X',
        }],
        'utils.ts': [{
          ...expectedResultThemes,
          position: '0',
          message: 'Core error',
          rule: 'core-error',
          severity: '!',
        }],
      },
      summary: {
        deprecatedRules: ['deprecated-rule-1', 'deprecated-rule-2', 'deprecated-rule-3'],
        errorCount: 4,
        fileCount: 3,
        fixableErrorCount: 2,
        fixableWarningCount: 1,
        linter: 'ESLint',
        warningCount: 2,
      },
    })
  })

  it('does not fix lint errors when the fix option is disabled', async () => {
    lintFilesMock.mockImplementationOnce(() => noErrorLintResults)

    await eslintLib.lintFiles({
      files: testFiles,
      fix: false
    })

    expect(ESLint).toHaveBeenCalledOnceWith({
      cache: false,
      fix: false,
    })
    expect(outputFixesMock).not.toHaveBeenCalled()
  })

  it('fixes lint errors when the fix option is enabled', async () => {
    lintFilesMock.mockImplementationOnce(() => noErrorLintResults)

    await eslintLib.lintFiles({
      files: testFiles,
      fix: true
    })

    expect(ESLint).toHaveBeenCalledOnceWith({
      cache: false,
      fix: true,
    })
    expect(outputFixesMock).toHaveBeenCalledOnceWith(noErrorLintResults)
  })

})
