import path from 'node:path'

import stylelint from 'stylelint'

import colourLog from '@Utils/colour-log'

import lintFiles from '../lint-files'

import type { LintResult } from 'stylelint'

jest.mock('stylelint', () => ({
  lint: jest.fn(),
}))
jest.mock('@Utils/colour-log')

describe('lintFiles', () => {

  const commonLintOptions = {
    allowEmptyInput: true,
    cache: false,
    cacheLocation: undefined,
    config: expect.any(Object),
    files: ['index.scss'],
    fix: false,
    quietDeprecationWarnings: true,
    reportDescriptionlessDisables: true,
    reportInvalidScopeDisables: true,
    reportNeedlessDisables: true,
  }

  const mockedLintResults: Array<LintResult> = [{
    deprecations: [],
    errored: false,
    ignored: false,
    invalidOptionWarnings: [],
    parseErrors: [],
    source: path.join(process.cwd(), 'index.scss'),
    warnings: [],
  }]

  jest.mocked(stylelint.lint).mockImplementation(async () => ({
    cwd: '',
    errored: false,
    output: '',
    report: '',
    reportedDisables: [],
    results: mockedLintResults,
    ruleMetadata: {},
  }))

  it('exists the process when stylelint throws an error', async () => {
    expect.assertions(2)

    const error = new Error('Test error')

    jest.mocked(stylelint.lint).mockRejectedValueOnce(error)

    try {
      await lintFiles({
        cache: false,
        files: ['index.scss'],
        fix: false
      })
    } catch {
      expect(colourLog.error).toHaveBeenCalledOnceWith('An error occurred while running stylelint', error)
      expect(process.exit).toHaveBeenCalledWith(1)
    }
  })

  it('calls stylelint.lint with cacheing disabled by default', async () => {
    expect.assertions(1)

    await lintFiles({
      cache: false,
      files: ['index.scss'],
      fix: false
    })

    expect(stylelint.lint).toHaveBeenCalledOnceWith({
      ...commonLintOptions,
      cache: false,
      cacheLocation: undefined,
    })
  })

  it('calls stylelint.lint with cacheing enabled', async () => {
    expect.assertions(1)

    await lintFiles({
      cache: true,
      files: ['index.scss'],
      fix: false
    })

    expect(stylelint.lint).toHaveBeenCalledOnceWith({
      ...commonLintOptions,
      cache: true,
      cacheLocation: expect.stringContaining('.cache/lint/stylelint'),
    })
  })

  it('calls stylelint.lint with fix enabled', async () => {
    expect.assertions(1)

    await lintFiles({
      cache: false,
      files: ['index.scss'],
      fix: true
    })

    expect(stylelint.lint).toHaveBeenCalledOnceWith({
      ...commonLintOptions,
      fix: true,
    })
  })

  it('returns a report when stylelint successfully lints', async () => {
    expect.assertions(2)

    const result = await lintFiles({
      cache: false,
      files: ['index.scss'],
      fix: false
    })

    expect(stylelint.lint).toHaveBeenCalledOnceWith(commonLintOptions)
    expect(result).toStrictEqual({
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

})
