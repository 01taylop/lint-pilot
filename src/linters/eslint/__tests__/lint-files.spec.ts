import path from 'node:path'

import { ESLint, loadESLint } from 'eslint'

import colourLog from '@Utils/colour-log'

import lintFiles from '../lint-files'

jest.mock('eslint')
jest.mock('@Utils/colour-log')

describe('lintFiles', () => {

  const mockedLintResults: Array<ESLint.LintResult> = [{
    errorCount: 0,
    fatalErrorCount: 0,
    filePath: path.join(process.cwd(), 'index.ts'),
    fixableErrorCount: 0,
    fixableWarningCount: 0,
    messages: [],
    suppressedMessages: [],
    usedDeprecatedRules: [],
    warningCount: 0,
  }]

  jest.mocked(ESLint.prototype.lintFiles).mockImplementation(async () => mockedLintResults)

  const loadESLintMock = jest.mocked(loadESLint).mockResolvedValue(ESLint)
  const outputFixesMock = jest.mocked(ESLint.outputFixes)

  it('exists the process when eslint throws an error', async () => {
    expect.assertions(2)

    const error = new Error('Test error')

    jest.mocked(ESLint.prototype.lintFiles).mockRejectedValueOnce(error)

    try {
      await lintFiles({
        cache: false,
        files: ['index.ts'],
        fix: false
      })
    } catch {
      expect(colourLog.error).toHaveBeenCalledOnceWith('An error occurred while running eslint', error)
      expect(process.exit).toHaveBeenCalledWith(1)
    }
  })

  it('creates a new ESLint instance using flat config by default', async () => {
    expect.assertions(2)

    await lintFiles({
      cache: false,
      files: ['index.ts'],
      fix: false
    })

    expect(loadESLintMock).toHaveBeenCalledOnceWith({
      useFlatConfig: true,
    })
    expect(ESLint).toHaveBeenCalledOnceWith({
      cache: false,
      cacheLocation: undefined,
      fix: false,
    })
  })

  it('creates a new ESLint instance using flat config when eslintUseLegacyConfig is false', async () => {
    expect.assertions(2)

    await lintFiles({
      cache: false,
      eslintUseLegacyConfig: false,
      files: ['index.ts'],
      fix: false
    })

    expect(loadESLintMock).toHaveBeenCalledOnceWith({
      useFlatConfig: true,
    })
    expect(ESLint).toHaveBeenCalledOnceWith({
      cache: false,
      cacheLocation: undefined,
      fix: false,
    })
  })

  it('creates a new ESLint instance using legacy config when eslintUseLegacyConfig is true', async () => {
    expect.assertions(2)

    await lintFiles({
      cache: false,
      eslintUseLegacyConfig: true,
      files: ['index.ts'],
      fix: false
    })

    expect(loadESLintMock).toHaveBeenCalledOnceWith({
      useFlatConfig: false,
    })
    expect(ESLint).toHaveBeenCalledOnceWith({
      cache: false,
      cacheLocation: undefined,
      fix: false,
    })
  })

  it('creates a new ESLint instance with cacheing enabled', async () => {
    expect.assertions(1)

    await lintFiles({
      cache: true,
      files: ['index.ts'],
      fix: false
    })

    expect(ESLint).toHaveBeenCalledOnceWith({
      cache: true,
      cacheLocation: expect.stringContaining('.cache/lint/eslint'),
      fix: false,
    })
  })

  it('returns a report when eslint successfully lints', async () => {
    expect.assertions(2)

    const result = await lintFiles({
      cache: false,
      files: ['index.ts'],
      fix: false
    })

    expect(ESLint.prototype.lintFiles).toHaveBeenCalledOnceWith(['index.ts'])
    expect(result).toStrictEqual({
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

  it('does not fix lint errors when the fix option is disabled', async () => {
    expect.assertions(2)

    await lintFiles({
      cache: false,
      files: ['index.ts'],
      fix: false
    })

    expect(ESLint.prototype.lintFiles).toHaveBeenCalledOnceWith(['index.ts'])
    expect(outputFixesMock).not.toHaveBeenCalled()
  })

  it('fixes lint errors when the fix option is enabled', async () => {
    expect.assertions(2)

    await lintFiles({
      cache: false,
      files: ['index.ts'],
      fix: true
    })

    expect(ESLint.prototype.lintFiles).toHaveBeenCalledOnceWith(['index.ts'])
    expect(outputFixesMock).toHaveBeenCalledOnceWith(mockedLintResults)
  })

})
