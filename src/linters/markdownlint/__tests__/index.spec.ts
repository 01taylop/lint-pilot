import markdownlint from 'markdownlint'

import colourLog from '@Utils/colourLog'

import loadConfig from '../loadConfig'
import markdownLib from '..'

jest.mock('markdownlint')
jest.mock('@Utils/colourLog')
jest.mock('../loadConfig')

describe('markdownlint', () => {

  jest.spyOn(colourLog, 'configDebug').mockImplementation(() => {})
  jest.spyOn(colourLog, 'error').mockImplementation(() => {})

  const mockedConfig = { default: true }
  const testFiles = ['README.md']

  beforeEach(() => {
    jest.mocked(loadConfig).mockReturnValue(['default', mockedConfig])
  })

  it('logs the config', async () => {
    jest.mocked(markdownlint).mockImplementationOnce((_options, callback) => {
      callback(null, {})
    })

    await markdownLib.lintFiles(testFiles)

    expect(colourLog.configDebug).toHaveBeenCalledWith('Using default markdownlint config:', mockedConfig)
  })

  it('rejects when markdownlint returns an error', async () => {
    const error = new Error('Test error')

    jest.mocked(markdownlint).mockImplementationOnce((_options, callback) => {
      callback(error, undefined)
    })

    await expect(markdownLib.lintFiles(testFiles)).rejects.toThrow('Test error')

    expect(colourLog.error).toHaveBeenCalledWith('An error occurred while running markdownlint', error)
  })

  it('rejects when markdownlint returns no results', async () => {
    jest.mocked(markdownlint).mockImplementationOnce((_options, callback) => {
      callback(null, undefined)
    })

    await expect(markdownLib.lintFiles(testFiles)).rejects.toThrow('No results')

    expect(colourLog.error).toHaveBeenCalledWith('An error occurred while running markdownlint: no results')
  })

  it('resolves with processed results when markdownlint successfully lints', async () => {
    jest.mocked(markdownlint).mockImplementationOnce((_options, callback) => {
      callback(null, {
        'README.md': []
      })
    })

    expect(await markdownLib.lintFiles(testFiles)).toStrictEqual({
      processedResult: {
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

  it('counts fixable errors correctly', async () => {
    const commonError = {
      ruleNames: ['test-rule'],
      ruleDescription: 'test-rule-description',
      ruleInformation: 'test-rule-information',
      errorDetail: 'test-error-detail',
      errorContext: 'test-error-context',
      errorRange: [1, 2],
    }

    jest.mocked(markdownlint).mockImplementationOnce((_options, callback) => {
      callback(null, {
        'CHANGELOG.md': [{
          ...commonError,
          lineNumber: 1,
          fixInfo: {
            lineNumber: 1,
          },
        }],
        'CONTRIBUTING.md': [],
        'README.md': [{
          ...commonError,
          lineNumber: 7,
          fixInfo: {
            lineNumber: 7,
          },
        }, {
          ...commonError,
          lineNumber: 13,
        }, {
          ...commonError,
          lineNumber: 18,
        }],
      })
    })

    expect(await markdownLib.lintFiles(testFiles)).toStrictEqual({
      processedResult: {
        deprecatedRules: [],
        errorCount: 4,
        fileCount: 3,
        fixableErrorCount: 2,
        fixableWarningCount: 0,
        linter: 'MarkdownLint',
        warningCount: 0,
      },
    })
  })

})
