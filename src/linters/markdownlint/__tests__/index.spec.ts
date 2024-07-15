import markdownlint from 'markdownlint'

import colourLog from '@Utils/colourLog'

import markdownLib from '..'
import loadConfig from '../loadConfig'

jest.mock('markdownlint')
jest.mock('@Utils/colourLog')
jest.mock('../loadConfig')

describe('markdownlint', () => {

  jest.spyOn(colourLog, 'info').mockImplementation(() => {})
  jest.spyOn(console, 'log').mockImplementation(() => {})

  const mockedConfig = { default: true }
  const testFiles = ['README.md']

  beforeEach(() => {
    jest.mocked(loadConfig).mockReturnValue(['default', mockedConfig])
  })

  it('logs the config when global.debug is true', async () => {
    global.debug = true
    jest.mocked(markdownlint).mockImplementationOnce((_options, callback) => {
      callback(null, {})
    })

    await markdownLib.lintFiles(testFiles)

    expect(colourLog.info).toHaveBeenCalledWith('\nUsing default markdownlint config:')
    expect(console.log).toHaveBeenCalledWith(mockedConfig)
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
    const mockedResults = {
      'README.md': []
    }

    jest.mocked(markdownlint).mockImplementationOnce((_options, callback) => {
      callback(null, mockedResults)
    })

    const result = await markdownLib.lintFiles(testFiles)

    expect(result).toStrictEqual({
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

    const mockedResults = {
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
    }

    jest.mocked(markdownlint).mockImplementationOnce((_options, callback) => {
      callback(null, mockedResults)
    })

    const result = await markdownLib.lintFiles(testFiles)

    expect(result).toStrictEqual({
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
