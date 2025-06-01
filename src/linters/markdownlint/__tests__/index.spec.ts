import { markdownlintError } from '@Jest/testData'
import colourLog from '@Utils/colour-log'

import fixFile from '../fix-file'
import loadConfig from '../load-config'
import markdownlintAsync, { type LintResults } from '../markdownlint-async'
import markdownlintLib from '..'

jest.mock('@Utils/colour-log')
jest.mock('../fix-file')
jest.mock('../load-config')
jest.mock('../markdownlint-async')

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
      cache: false,
      files: testFiles,
      fix: false,
    })

    expect(loadConfig).toHaveBeenCalledTimes(1)
    expect(colourLog.configDebug).toHaveBeenCalledOnceWith('Using default markdownlint config:', mockedConfig)
  })

  it('calls markdownlint with the config and files', async () => {
    jest.mocked(markdownlintAsync).mockResolvedValueOnce({})

    await markdownlintLib.lintFiles({
      cache: false,
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
        cache: false,
        files: testFiles,
        fix: false,
      })
    } catch {
      expect(colourLog.error).toHaveBeenCalledOnceWith('An error occurred while running markdownlint', error)
      expect(process.exit).toHaveBeenCalledWith(1)
    }
  })

  it('does not fix lint errors when the fix option is disabled', async () => {
    const lintResults: LintResults = {
      'README.md': [],
    }

    jest.mocked(markdownlintAsync).mockResolvedValueOnce(lintResults)

    await markdownlintLib.lintFiles({
      cache: false,
      files: testFiles,
      fix: false,
    })

    expect(markdownlintAsync).toHaveBeenCalledOnceWith({
      config: mockedConfig,
      files: testFiles,
    })
    expect(fixFile).not.toHaveBeenCalled()
  })

  it('calls markdownlint once when the fix option is enabled but there are no errors to be fixed', async () => {
    const lintResults: LintResults = {
      'README.md': [],
    }

    jest.mocked(markdownlintAsync).mockResolvedValueOnce(lintResults)

    await markdownlintLib.lintFiles({
      cache: false,
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

    jest.mocked(markdownlintAsync)
      .mockResolvedValueOnce(lintResultsWithError)
      .mockResolvedValueOnce(lintResultsWithoutError)

    await markdownlintLib.lintFiles({
      cache: false,
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
