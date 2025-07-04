import fs from 'node:fs'

import markdownlint from 'markdownlint'

import colourLog from '@Utils/colour-log'

import loadConfig from '../load-config'

jest.mock('node:fs')

describe('loadConfig', () => {

  jest.spyOn(colourLog, 'error').mockImplementation(() => {})
  jest.spyOn(markdownlint, 'readConfigSync').mockImplementation(() => ({ default: true }))

  it('returns the custom config if it exists', () => {
    jest.mocked(fs.existsSync).mockReturnValueOnce(true)

    expect(loadConfig()).toStrictEqual(['custom', {
      default: true,
    }])
    expect(markdownlint.readConfigSync).toHaveBeenCalledWith(`${process.cwd()}/.markdownlint.json`)
  })

  it('returns the default config if no custom config exists', () => {
    jest.mocked(fs.existsSync).mockReturnValueOnce(false)

    expect(loadConfig()).toStrictEqual(['default', {
      default: true,
    }])
    expect(markdownlint.readConfigSync).toHaveBeenCalledWith(expect.stringContaining('markdownlint/markdownlint.json'))
  })

  it('catches and logs any errors', () => {
    expect.assertions(2)

    const error = new Error('Test error')

    jest.mocked(fs.existsSync).mockImplementationOnce(() => {
      throw error
    })

    try {
      loadConfig()
    } catch {
      expect(colourLog.error).toHaveBeenCalledWith('An error occurred while loading the markdownlint config', error)
      expect(process.exit).toHaveBeenCalledWith(1)
    }
  })

})
