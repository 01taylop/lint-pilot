import { markdownlintError } from '@Jest/testData'
import colourLog from '@Utils/colourLog'

import fixFile from '../fixFile'
import loadConfig from '../loadConfig'
import markdownlintAsync, { type LintResults } from '../markdownlintAsync'
import markdownlintLib from '..'

jest.mock('@Utils/colourLog')
jest.mock('../fixFile')
jest.mock('../loadConfig')
jest.mock('../markdownlintAsync')

describe('markdownlint', () => {

  jest.spyOn(colourLog, 'configDebug').mockImplementation(() => {})
  jest.spyOn(colourLog, 'error').mockImplementation(() => {})

  const mockedConfig = { default: true }
  const testFiles = ['README.md']

  beforeEach(() => {
    jest.mocked(fixFile).mockImplementation(() => {})
    jest.mocked(loadConfig).mockReturnValue(['default', mockedConfig])
  })

  it('loads the config and logs it', async () => {
    jest.mocked(markdownlintAsync).mockResolvedValueOnce({})

    await markdownlintLib.lintFiles({
      files: testFiles,
      fix: false,
    })

    expect(loadConfig).toHaveBeenCalledTimes(1)
    expect(colourLog.configDebug).toHaveBeenCalledOnceWith('Using default markdownlint config:', mockedConfig)
  })

  it('calls markdownlint with the config and files', async () => {
    jest.mocked(markdownlintAsync).mockResolvedValueOnce({})

    await markdownlintLib.lintFiles({
      files: testFiles,
      fix: false,
    })

    expect(markdownlintAsync).toHaveBeenCalledOnceWith({
      config: mockedConfig,
      files: testFiles,
    })
  })

  it('exists the process when markdownlint throws an error', async () => {
    expect.assertions(2)

    const error = new Error('Test error')

    jest.mocked(markdownlintAsync).mockImplementationOnce(() => {
      throw error
    })

    try {
      await markdownlintLib.lintFiles({
        files: testFiles,
        fix: false,
      })
    } catch {
      expect(colourLog.error).toHaveBeenCalledOnceWith('An error occurred while running markdownlint', error)
      expect(process.exit).toHaveBeenCalledWith(1)
    }
  })

  it('resolves with results and a summary when markdownlint successfully lints (no files)', async () => {
    jest.mocked(markdownlintAsync).mockResolvedValueOnce({})

    expect(await markdownlintLib.lintFiles({
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
        linter: 'MarkdownLint',
        warningCount: 0,
      },
    })
  })

  it('resolves with results and a summary when markdownlint successfully lints (no errors)', async () => {
    const lintResults: LintResults = {
      'README.md': [],
    }

    jest.mocked(markdownlintAsync).mockResolvedValueOnce(lintResults)

    expect(await markdownlintLib.lintFiles({
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
        linter: 'MarkdownLint',
        warningCount: 0,
      },
    })
  })

  it('resolves with results and a summary when markdownlint successfully lints (with errors)', async () => {
    const commonResult = {
      ruleNames: ['MD000', 'test-rule-name'],
      ruleInformation: 'test-rule-information',
      errorDetail: 'test-error-detail',
      errorContext: 'test-error-context',
      errorRange: [1, 2],
    }

    const lintResults: LintResults = {
      // No errors
      'CHANGELOG.md': [],
      'CONTRIBUTING.md': [{
        ...commonResult,
        lineNumber: 1,
        fixInfo: {
          lineNumber: 1,
        },
        ruleDescription: 'test-rule-description',
      }],
      // 5 errors
      'README.md': [{
        ...commonResult,
        lineNumber: 7,
        errorRange: [],
        fixInfo: {
          lineNumber: 7,
        },
        ruleDescription: 'no-error-range',
      }, {
        ...commonResult,
        errorDetail: '',
        lineNumber: 9,
        ruleDescription: 'no-error-detail',
      }, {
        ...commonResult,
        lineNumber: 13,
        ruleNames: ['MD000', 'test-rule-b'],
        ruleDescription: 'sorted-by-name',
      }, {
        ...commonResult,
        lineNumber: 13,
        ruleNames: ['MD000', 'test-rule-a'],
        ruleDescription: 'sorted-by-name',
      }, {
        ...commonResult,
        errorDetail: '',
        lineNumber: 3,
        ruleDescription: 'sort-by-line-number',
      }],
    }

    const resultThemes = {
      messageTheme: expect.any(Function),
      positionTheme: expect.any(Function),
      ruleTheme: expect.any(Function),
    }

    jest.mocked(markdownlintAsync).mockResolvedValueOnce(lintResults)

    expect(await markdownlintLib.lintFiles({
      files: testFiles,
      fix: false,
    })).toStrictEqual({
      results: {
        'CONTRIBUTING.md': [{
          ...resultThemes,
          message: 'test-rule-description: test-error-detail',
          position: '1:1',
          rule: 'test-rule-name',
          severity: 'X',
        }],
        'README.md': [{
          ...resultThemes,
          message: 'sort-by-line-number',
          position: '3:1',
          rule: 'test-rule-name',
          severity: 'X',
        }, {
          ...resultThemes,
          message: 'no-error-range: test-error-detail',
          position: '7',
          rule: 'test-rule-name',
          severity: 'X',
        }, {
          ...resultThemes,
          message: 'no-error-detail',
          position: '9:1',
          rule: 'test-rule-name',
          severity: 'X',
        }, {
          ...resultThemes,
          message: 'sorted-by-name: test-error-detail',
          position: '13:1',
          rule: 'test-rule-a',
          severity: 'X',
        }, {
          ...resultThemes,
          message: 'sorted-by-name: test-error-detail',
          position: '13:1',
          rule: 'test-rule-b',
          severity: 'X',
        }],
      },
      summary: {
        deprecatedRules: [],
        errorCount: 6,
        fileCount: 3,
        fixableErrorCount: 2,
        fixableWarningCount: 0,
        linter: 'MarkdownLint',
        warningCount: 0,
      },
    })
  })

  it('does not fix lint errors when the fix option is disabled', async () => {
    const lintResults: LintResults = {
      'README.md': [],
    }

    jest.mocked(markdownlintAsync).mockResolvedValueOnce(lintResults)

    await markdownlintLib.lintFiles({
      files: testFiles,
      fix: false,
    })

    expect(markdownlintAsync).toHaveBeenCalledOnceWith({
      config: mockedConfig,
      files: testFiles,
    })
    expect(fixFile).not.toHaveBeenCalled()
  })

  it('calls markdownlint once when the fix option is enabled but there are no errors auto fixed', async () => {
    const lintResults: LintResults = {
      'README.md': [],
    }

    jest.mocked(markdownlintAsync).mockResolvedValueOnce(lintResults)

    await markdownlintLib.lintFiles({
      files: testFiles,
      fix: true,
    })

    expect(markdownlintAsync).toHaveBeenCalledOnceWith({
      config: mockedConfig,
      files: testFiles,
    })
    expect(fixFile).not.toHaveBeenCalled()
  })

  it('fixes lint errors when the fix option is enabled and returns the updated results (running markdownlint a second time)', async () => {
    const lintResultsWithError: LintResults = {
      'README.md': [markdownlintError],
    }
    const lintResultsWithoutError: LintResults = {
      'README.md': [],
    }

    jest.mocked(markdownlintAsync).mockResolvedValueOnce(lintResultsWithError)
    jest.mocked(markdownlintAsync).mockResolvedValueOnce(lintResultsWithoutError)

    await markdownlintLib.lintFiles({
      files: testFiles,
      fix: true,
    })

    expect(markdownlintAsync).toHaveBeenCalledTimes(2)
    expect(markdownlintAsync).toHaveBeenNthCalledWith(1, {
      config: mockedConfig,
      files: testFiles,
    })
    expect(markdownlintAsync).toHaveBeenNthCalledWith(2, {
      config: mockedConfig,
      files: testFiles,
    })
    expect(fixFile).toHaveBeenCalledTimes(1)
    expect(fixFile).toHaveBeenCalledWith({
      errors: [markdownlintError],
      file: 'README.md',
    })
  })

})
