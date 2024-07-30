import fs from 'fs'
import path from 'path'

import colourLog from '@Utils/colourLog'

import { clearCacheDirectory, getCacheDirectory } from '../cache'

jest.mock('fs')
jest.mock('@Utils/colourLog', () => ({
  info: jest.fn(),
}))

describe('clearCacheDirectory', () => {

  const expectedCacheDirectory = `${process.cwd()}/.lintpilotcache`

  it('clears the cache directory if it exists', () => {
    jest.mocked(fs.existsSync).mockReturnValueOnce(true)

    clearCacheDirectory()

    expect(fs.existsSync).toHaveBeenCalledWith(expectedCacheDirectory)
    expect(fs.rmSync).toHaveBeenCalledWith(expectedCacheDirectory, {
      force: true,
      recursive: true,
    })
    expect(colourLog.info).toHaveBeenCalledWith('Cache cleared.\n')
  })

  it('does not attempt to clear the cache if the directory does not exist', () => {
    jest.mocked(fs.existsSync).mockReturnValueOnce(false)

    clearCacheDirectory()

    expect(fs.existsSync).toHaveBeenCalledWith(expectedCacheDirectory)
    expect(fs.rmSync).not.toHaveBeenCalled()
    expect(colourLog.info).toHaveBeenCalledWith('No cache to clear.\n')
  })

})

describe('getCacheDirectory', () => {

  it('returns the correct cache directory path for a given file', () => {
    jest.spyOn(path, 'resolve')

    const result = getCacheDirectory('.eslintcache')

    expect(path.resolve).toHaveBeenCalledWith(process.cwd(), '.lintpilotcache', '.eslintcache')
    expect(result).toEqual(`${process.cwd()}/.lintpilotcache/.eslintcache`)
  })

})
