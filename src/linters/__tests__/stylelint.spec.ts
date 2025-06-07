import stylelint, { type LintResult } from 'stylelint'

import { expectedResultThemes } from '@Jest/testData'
import colourLog from '@Utils/colour-log'

import stylelintLib from '../stylelint'

jest.mock('stylelint', () => ({
  lint: jest.fn(),
}))
jest.mock('@Utils/colour-log')

describe('stylelint', () => {

  jest.spyOn(colourLog, 'error').mockImplementation(() => {})

  const testFiles = ['index.css']
  const lintFilesMock = jest.mocked(stylelint.lint)

  const commonLintFilesResult = {
    cwd: '',
    errored: false,
    output: '',
    report: '',
    reportedDisables: [],
  }

  const noErrorLintResults: Array<LintResult> = [{
    deprecations: [],
    invalidOptionWarnings: [],
    parseErrors: [],
    source: `${process.cwd()}/index.css`,
    warnings: [],
  }]

  it('calls stylelint.lint with the files', async () => {
    lintFilesMock.mockImplementationOnce(async () => ({
      ...commonLintFilesResult,
      results: [],
      ruleMetadata: {},
    }))

    await stylelintLib.lintFiles({
      cache: false,
      files: testFiles,
      fix: false,
    })

    expect(stylelint.lint).toHaveBeenCalledOnceWith({
      allowEmptyInput: true,
      cache: false,
      cacheLocation: undefined,
      config: expect.anything(),
      files: testFiles,
      fix: false,
      quietDeprecationWarnings: true,
      reportDescriptionlessDisables: true,
      reportInvalidScopeDisables: true,
      reportNeedlessDisables: true,
    })
  })

  it('calls stylelint.lint with cacheing enabled', async () => {
    lintFilesMock.mockImplementationOnce(async () => ({
      ...commonLintFilesResult,
      results: [],
      ruleMetadata: {},
    }))

    await stylelintLib.lintFiles({
      cache: true,
      files: testFiles,
      fix: false,
    })

    expect(stylelint.lint).toHaveBeenCalledOnceWith({
      allowEmptyInput: true,
      cache: true,
      cacheLocation: expect.stringContaining('.cache/lint/stylelint'),
      config: expect.anything(),
      files: testFiles,
      fix: false,
      quietDeprecationWarnings: true,
      reportDescriptionlessDisables: true,
      reportInvalidScopeDisables: true,
      reportNeedlessDisables: true,
    })
  })

  it('exists the process when stylelint throws an error', async () => {
    expect.assertions(2)

    const error = new Error('Test error')

    lintFilesMock.mockImplementationOnce(() => {
      throw error
    })

    try {
      await stylelintLib.lintFiles({
        cache: false,
        files: testFiles,
        fix: false,
      })
    } catch {
      expect(colourLog.error).toHaveBeenCalledOnceWith('An error occurred while running stylelint', error)
      expect(process.exit).toHaveBeenCalledWith(1)
    }
  })

  it('returns results and a summary when stylelint successfully lints (no files)', async () => {
    const lintResults: Array<LintResult> = []

    lintFilesMock.mockImplementationOnce(async () => ({
      ...commonLintFilesResult,
      results: lintResults,
      ruleMetadata: {},
    }))

    expect(await stylelintLib.lintFiles({
      cache: false,
      files: [],
      fix: false,
    })).toStrictEqual({
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
    lintFilesMock.mockImplementationOnce(async () => ({
      ...commonLintFilesResult,
      results: noErrorLintResults,
      ruleMetadata: {},
    }))

    expect(await stylelintLib.lintFiles({
      cache: false,
      files: testFiles,
      fix: false,
    })).toStrictEqual({
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

    lintFilesMock.mockImplementationOnce(async () => ({
      ...commonLintFilesResult,
      results: lintResults,
      ruleMetadata: {
        'fixable-rule': { fixable: true },
      },
    }))

    expect(await stylelintLib.lintFiles({
      cache: false,
      files: testFiles,
      fix: false,
    })).toStrictEqual({
      results: {
        'card.css': [{
          ...expectedResultThemes,
          message: 'Error rule 1',
          position: '1:1',
          rule: 'error-rule-1',
          severity: '  ×',
        }, {
          ...expectedResultThemes,
          message: 'Error rule 2',
          position: '2:1',
          rule: 'error-rule-2',
          severity: '  ×',
        }, {
          ...expectedResultThemes,
          message: 'Warning rule 1',
          position: '3:1',
          rule: 'warning-rule-1',
          severity: '  ×',
        }],
        'datepicker.css': [{
          ...expectedResultThemes,
          message: 'Fixable rule',
          position: '1:1',
          rule: 'fixable-rule',
          severity: '  ×',
        }],
        'unknown-source': [{
          ...expectedResultThemes,
          message: 'Unknown source rule',
          position: '1:1',
          rule: 'unknown-source-rule',
          severity: '  ×',
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

  it('does not fix lint errors when the fix option is disabled', async () => {
    lintFilesMock.mockImplementationOnce(async () => ({
      ...commonLintFilesResult,
      results: noErrorLintResults,
      ruleMetadata: {},
    }))

    await stylelintLib.lintFiles({
      cache: false,
      files: testFiles,
      fix: false,
    })

    expect(stylelint.lint).toHaveBeenCalledOnceWith(expect.objectContaining({
      files: testFiles,
      fix: false,
    }))
  })

  it('fixes lint errors when the fix option is enabled', async () => {
    lintFilesMock.mockImplementationOnce(async () => ({
      ...commonLintFilesResult,
      results: noErrorLintResults,
      ruleMetadata: {},
    }))

    await stylelintLib.lintFiles({
      cache: false,
      files: testFiles,
      fix: true,
    })

    expect(stylelint.lint).toHaveBeenCalledOnceWith(expect.objectContaining({
      files: testFiles,
      fix: true,
    }))
  })

})
