import stylelint, { type LintResult } from 'stylelint'

import colourLog from '@Utils/colourLog'

import stylelintLib from '../stylelint'

jest.mock('stylelint', () => ({
  lint: jest.fn(),
}))
jest.mock('@Utils/colourLog')

describe('stylelint', () => {

  jest.spyOn(colourLog, 'error').mockImplementation(() => {})

  const testFiles = ['index.css']
  const lintFilesMock = stylelint.lint as jest.Mock

  it('calls stylelint.lint with the files', async () => {
    lintFilesMock.mockImplementationOnce(() => ({
      results: [],
      ruleMetadata: {},
    }))

    await stylelintLib.lintFiles(testFiles)

    expect(stylelint.lint).toHaveBeenCalledOnceWith(expect.objectContaining({ files: testFiles }))
  })

  it('exists the process when stylelint throws an error', async () => {
    expect.assertions(2)

    const error = new Error('Test error')

    lintFilesMock.mockImplementationOnce(() => {
      throw error
    })

    try {
      await stylelintLib.lintFiles(testFiles)
    } catch {
      expect(colourLog.error).toHaveBeenCalledOnceWith('An error occurred while running stylelint', error)
      expect(process.exit).toHaveBeenCalledWith(1)
    }
  })

  it('returns results and a summary when stylelint successfully lints (no files)', async () => {
    const lintResults: Array<LintResult> = []

    lintFilesMock.mockImplementationOnce(() => ({
      results: lintResults,
      ruleMetadata: {},
    }))

    expect(await stylelintLib.lintFiles([])).toStrictEqual({
      results: {},
      summary: {
        deprecatedRules: [],
        errorCount: 0,
        fileCount: 0,
        fixableErrorCount: 0,
        fixableWarningCount: 0,
        linter: 'Stylelint',
        warningCount: 0,
      },
    })
  })

  it('returns results and a summary when stylelint successfully lints (no errors)', async () => {
    const lintResults: Array<LintResult> = [{
      deprecations: [],
      invalidOptionWarnings: [],
      parseErrors: [],
      source: `${process.cwd()}/index.css`,
      warnings: [],
    }]

    lintFilesMock.mockImplementationOnce(() => ({
      results: lintResults,
      ruleMetadata: {},
    }))

    expect(await stylelintLib.lintFiles(testFiles)).toStrictEqual({
      results: {},
      summary: {
        deprecatedRules: [],
        errorCount: 0,
        fileCount: 1,
        fixableErrorCount: 0,
        fixableWarningCount: 0,
        linter: 'Stylelint',
        warningCount: 0,
      },
    })
  })

  it('returns results and a summary when stylelint successfully lints (with warnings and deprecations)', async () => {
    const commonResult = {
      invalidOptionWarnings: [],
      parseErrors: [],
    }

    const lintResults: Array<LintResult> = [{
      // No errors or warnings
      ...commonResult,
      deprecations: [],
      source: `${process.cwd()}/button.css`,
      warnings: [],
    }, {
      // 2 errors, 1 warning, 2 deprecated rules
      ...commonResult,
      deprecations: [{
        text: 'deprecated-rule-1',
      }, {
        text: 'deprecated-rule-2',
      }],
      source: `${process.cwd()}/card.css`,
      warnings: [{
        column: 1,
        line: 1,
        rule: 'error-rule-1',
        severity: 'error',
        text: 'Error rule 1 (error-rule-1)',
      }, {
        column: 1,
        line: 2,
        rule: 'error-rule-2',
        severity: 'error',
        text: 'Error rule 2 (error-rule-2)',
      }, {
        column: 1,
        line: 3,
        rule: 'warning-rule-1',
        severity: 'warning',
        text: 'Warning rule 1 (warning-rule-1)',
      }],
    }, {
      // 1 fixable error
      ...commonResult,
      deprecations: [],
      source: `${process.cwd()}/datepicker.css`,
      warnings: [{
        column: 1,
        line: 1,
        rule: 'fixable-rule',
        severity: 'error',
        text: 'Fixable rule (fixable-rule)',
      }],
    }, {
      // 2 deprecated rules (one already reported), no warnings
      ...commonResult,
      deprecations: [{
        text: 'deprecated-rule-2',
      }, {
        text: 'deprecated-rule-3',
      }],
      source: `${process.cwd()}/dialog.css`,
      warnings: [],
    }, {
      // No source, no warnings
      ...commonResult,
      deprecations: [],
      warnings: [],
    }, {
      // No source, with warnings
      ...commonResult,
      deprecations: [],
      warnings: [{
        column: 1,
        line: 1,
        rule: 'unknown-source-rule',
        severity: 'error',
        text: 'Unknown source rule (unknown-source-rule)',
      }],
    }]

    const resultThemes = {
      messageTheme: expect.any(Function),
      positionTheme: expect.any(Function),
      ruleTheme: expect.any(Function),
    }

    lintFilesMock.mockImplementationOnce(() => ({
      results: lintResults,
      ruleMetadata: {
        'fixable-rule': { fixable: true },
      },
    }))

    expect(await stylelintLib.lintFiles(testFiles)).toStrictEqual({
      results: {
        'card.css': [{
          ...resultThemes,
          message: 'Error rule 1',
          position: '1:1',
          rule: 'error-rule-1',
          severity: 'X',
        }, {
          ...resultThemes,
          message: 'Error rule 2',
          position: '2:1',
          rule: 'error-rule-2',
          severity: 'X',
        }, {
          ...resultThemes,
          message: 'Warning rule 1',
          position: '3:1',
          rule: 'warning-rule-1',
          severity: 'X',
        }],
        'datepicker.css': [{
          ...resultThemes,
          message: 'Fixable rule',
          position: '1:1',
          rule: 'fixable-rule',
          severity: 'X',
        }],
        'unknown-source': [{
          ...resultThemes,
          message: 'Unknown source rule',
          position: '1:1',
          rule: 'unknown-source-rule',
          severity: 'X',
        }],
      },
      summary: {
        deprecatedRules: ['deprecated-rule-1', 'deprecated-rule-2', 'deprecated-rule-3'],
        errorCount: 5,
        fileCount: 6,
        fixableErrorCount: 1,
        fixableWarningCount: 0,
        linter: 'Stylelint',
        warningCount: 0,
      },
    })
  })

})