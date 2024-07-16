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

  it('loads the config and logs it', async () => {
    jest.mocked(markdownlint).mockImplementationOnce((_options, callback) => {
      callback(null, {})
    })

    await markdownLib.lintFiles(testFiles)

    expect(loadConfig).toHaveBeenCalledTimes(1)
    expect(colourLog.configDebug).toHaveBeenCalledWith('Using default markdownlint config:', mockedConfig)
  })

  it('calls markdownlint with the config and files', async () => {
    jest.mocked(markdownlint).mockImplementationOnce((_options, callback) => {
      callback(null, {})
    })

    await markdownLib.lintFiles(testFiles)

    expect(markdownlint).toHaveBeenCalledOnceWith({
      config: mockedConfig,
      files: testFiles,
    }, expect.any(Function))
  })

  it('rejects when markdownlint returns an error', async () => {
    const error = new Error('Test error')

    jest.mocked(markdownlint).mockImplementationOnce((_options, callback) => {
      callback(error, undefined)
    })

    await expect(markdownLib.lintFiles(testFiles)).rejects.toThrow(error)

    expect(colourLog.error).toHaveBeenCalledOnceWith('An error occurred while running markdownlint', error)
  })

  it('rejects when markdownlint returns no results', async () => {
    jest.mocked(markdownlint).mockImplementationOnce((_options, callback) => {
      callback(null, undefined)
    })

    await expect(markdownLib.lintFiles(testFiles)).rejects.toThrow('No results')

    expect(colourLog.error).toHaveBeenCalledOnceWith('An error occurred while running markdownlint: no results')
  })

  it('resolves with logs and a summary when markdownlint successfully lints (no errors)', async () => {
    jest.mocked(markdownlint).mockImplementationOnce((_options, callback) => {
      callback(null, {
        'README.md': []
      })
    })

    expect(await markdownLib.lintFiles(testFiles)).toStrictEqual({
      logs: {},
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

  describe('when markdownlint successfully lints (with errors)', () => {

    const commonError = {
      ruleNames: ['MD000', 'test-rule'],
      ruleDescription: 'test-rule-description',
      ruleInformation: 'test-rule-information',
      errorDetail: 'test-error-detail',
      errorContext: 'test-error-context',
      errorRange: [1, 2],
    }

    const markdownlintResult = {
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
        errorDetail: '',
        lineNumber: 18,
      }, {
        ...commonError,
        lineNumber: 13,
        ruleNames: ['MD000', 'test-rule-b'],
      }, {
        ...commonError,
        lineNumber: 13,
        ruleNames: ['MD000', 'test-rule-a'],
      }],
    }

    it('formats the errors sorted by lineNumber and then alphabetically by ruleName', async () => {
      jest.mocked(markdownlint).mockImplementationOnce((_options, callback) => {
        callback(null, markdownlintResult)
      })

      expect(await markdownLib.lintFiles(testFiles)).toStrictEqual({
        logs: {
          'CHANGELOG.md': [{
            message: ' test-rule-description: test-error-detail ',
            messageTheme: expect.any(Function),
            position: ' 1:1 ',
            positionTheme: expect.any(Function),
            rule: ' test-rule',
            ruleTheme: expect.any(Function),
            type: 'X ',
          }],
          'README.md': [{
            message: ' test-rule-description: test-error-detail ',
            messageTheme: expect.any(Function),
            position: ' 7:1 ',
            positionTheme: expect.any(Function),
            rule: ' test-rule',
            ruleTheme: expect.any(Function),
            type: 'X ',
          }, {
            message: ' test-rule-description: test-error-detail ',
            messageTheme: expect.any(Function),
            position: ' 13:1 ',
            positionTheme: expect.any(Function),
            rule: ' test-rule-a',
            ruleTheme: expect.any(Function),
            type: 'X ',
          }, {
            message: ' test-rule-description: test-error-detail ',
            messageTheme: expect.any(Function),
            position: ' 13:1 ',
            positionTheme: expect.any(Function),
            rule: ' test-rule-b',
            ruleTheme: expect.any(Function),
            type: 'X ',
          }, {
            message: ' test-rule-description ',
            messageTheme: expect.any(Function),
            position: ' 18:1 ',
            positionTheme: expect.any(Function),
            rule: ' test-rule',
            ruleTheme: expect.any(Function),
            type: 'X ',
          }],
        },
        summary: expect.any(Object),
      })
    })

    it('counts fixable errors correctly', async () => {
      jest.mocked(markdownlint).mockImplementationOnce((_options, callback) => {
        callback(null, markdownlintResult)
      })

      expect(await markdownLib.lintFiles(testFiles)).toStrictEqual({
        logs: expect.any(Object),
        summary: {
          deprecatedRules: [],
          errorCount: 5,
          fileCount: 3,
          fixableErrorCount: 2,
          fixableWarningCount: 0,
          linter: 'MarkdownLint',
          warningCount: 0,
        },
      })
    })
  })

})
