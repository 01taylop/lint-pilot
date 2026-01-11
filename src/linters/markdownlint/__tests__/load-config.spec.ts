import fs from 'node:fs'
import path from 'node:path'

import markdownlint from 'markdownlint'

import colourLog from '@Utils/colour-log'

import defaultConfig from '../../../../config/markdownlint.json'
import { loadConfig } from '../load-config'

jest.mock('node:fs')
jest.mock('markdownlint', () => ({
  readConfigSync: jest.fn().mockImplementation(() => ({ default: true })),
}))

describe('loadConfig', () => {

  it('returns the custom config if it exists', () => {
    jest.mocked(fs.existsSync).mockReturnValueOnce(true)

    const config = loadConfig()

    expect(markdownlint.readConfigSync).toHaveBeenCalledWith(path.join(process.cwd(), '.markdownlint.json'))
    expect(colourLog.configDebug).toHaveBeenCalledWith('Using custom Markdownlint config:', { default: true })
    expect(config).toStrictEqual({ default: true })
  })

  it('returns the default config if no custom config exists', () => {
    jest.mocked(fs.existsSync).mockReturnValueOnce(false)

    const config = loadConfig()

    expect(colourLog.configDebug).toHaveBeenCalledWith('Using default Markdownlint config:', expect.objectContaining(defaultConfig))
    expect(config).toStrictEqual(expect.objectContaining(defaultConfig))
  })

  test.each([
    ['fs.existsSync', fs.existsSync],
    ['readConfigSync', markdownlint.readConfigSync],
  ])('exits the process when `%s` throws an error', (_name, mock) => {
    expect.assertions(2)

    const error = new Error('Test error')

    jest.mocked(mock).mockImplementation(() => {
      throw error
    })

    try {
      loadConfig()
    } catch {
      expect(colourLog.error).toHaveBeenCalledWith('An error occurred while loading the Markdownlint config', error)
      expect(process.exit).toHaveBeenCalledWith(1)
    }
  })

})
