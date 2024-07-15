import fs from 'fs'

import markdownlint from 'markdownlint'

import colourLog from '@Utils/colourLog'

import loadConfig from '../loadConfig'

jest.mock('fs')

describe('loadConfig', () => {

  jest.spyOn(colourLog, 'error').mockImplementation(() => {})
  jest.spyOn(markdownlint, 'readConfigSync').mockImplementation(() => ({ default: true }))
  jest.spyOn(process, 'exit').mockImplementation(() => null as never)

  it('returns the custom config if it exists', () => {
    jest.mocked(fs.existsSync).mockReturnValueOnce(true)

    expect(loadConfig()).toStrictEqual(['custom', {
      default: true,
    }])
    expect(markdownlint.readConfigSync).toHaveBeenCalledWith(`${process.cwd()}/markdownlint.json`)
  })

  it('returns the development config when NODE_ENV is development', () => {
    process.env.NODE_ENV = 'development'

    jest.mocked(fs.existsSync).mockReturnValueOnce(false)

    expect(loadConfig()).toStrictEqual(['development', {
      default: true,
    }])
    expect(markdownlint.readConfigSync).toHaveBeenCalledWith(expect.stringContaining('lint-pilot/config/markdownlint.json'))
  })

  it('returns the default config when NODE_ENV is production', () => {
    process.env.NODE_ENV = 'production'

    jest.mocked(fs.existsSync).mockReturnValueOnce(false)

    expect(loadConfig()).toStrictEqual(['default', {
      default: true,
    }])
    expect(markdownlint.readConfigSync).toHaveBeenCalledWith(expect.stringContaining('markdownlint/markdownlint.json'))
  })

  it('catches and logs any errors', () => {
    const error = new Error('Test error')
    jest.mocked(fs.existsSync).mockImplementationOnce(() => {
      throw error
    })

    loadConfig()

    expect(colourLog.error).toHaveBeenCalledWith('An error occurred while loading the markdownlint config', error)
    expect(process.exit).toHaveBeenCalledWith(1)
  })

})
