import fs from 'node:fs'
import path from 'node:path'

import colourLog from '@Utils/colour-log'

import { clearCacheDirectory, getCacheDirectory } from '../cache'

jest.mock('node:fs')

describe('clearCacheDirectory', () => {

  const expectedCacheDirectory = `${process.cwd()}/.lintpilotcache`

  beforeEach(() => {
    jest.spyOn(colourLog, 'info').mockImplementation(() => true)
  })

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

  it('returns the cache directory for a given file', () => {
    jest.spyOn(path, 'resolve')

    const result = getCacheDirectory('.eslintcache')

    expect(path.resolve).toHaveBeenCalledWith(process.cwd(), '.lintpilotcache', '.eslintcache')
    expect(result).toBe(`${process.cwd()}/.lintpilotcache/.eslintcache`)
  })

})
