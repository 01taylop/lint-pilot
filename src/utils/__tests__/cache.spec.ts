import fs from 'node:fs'
import path from 'node:path'

import colourLog from '@Utils/colour-log'

import { clearCacheDirectory, getCacheDirectory } from '../cache'

jest.mock('node:fs')
jest.mock('@Utils/colour-log')

describe('clearCacheDirectory', () => {

  const expectedCacheDirectory = `${process.cwd()}/.lintpilotcache`

  it('clears the cache directory if it exists', () => {
    jest.mocked(fs.existsSync).mockReturnValueOnce(true)

    clearCacheDirectory()

    expect(fs.existsSync).toHaveBeenCalledOnceWith(expectedCacheDirectory)
    expect(fs.rmSync).toHaveBeenCalledOnceWith(expectedCacheDirectory, {
      force: true,
      recursive: true,
    })
    expect(colourLog.info).toHaveBeenCalledOnceWith('Cache cleared.\n')
  })

  it('clears a cache sub-directory if it exists', () => {
    jest.mocked(fs.existsSync).mockReturnValueOnce(true)

    clearCacheDirectory('eslint')

    expect(fs.existsSync).toHaveBeenCalledOnceWith(`${expectedCacheDirectory}/eslint`)
    expect(fs.rmSync).toHaveBeenCalledOnceWith(`${expectedCacheDirectory}/eslint`, {
      force: true,
      recursive: true,
    })
    expect(colourLog.info).toHaveBeenCalledOnceWith('Cache cleared for eslint.\n')
  })

  it('does not attempt to clear the cache if the directory does not exist', () => {
    jest.mocked(fs.existsSync).mockReturnValueOnce(false)

    clearCacheDirectory()

    expect(fs.existsSync).toHaveBeenCalledOnceWith(expectedCacheDirectory)
    expect(fs.rmSync).not.toHaveBeenCalled()
    expect(colourLog.info).toHaveBeenCalledOnceWith('No cache to clear.\n')
  })

  it('does not attempt to clear the cache if the sub-directory does not exist', () => {
    jest.mocked(fs.existsSync).mockReturnValueOnce(false)

    clearCacheDirectory('eslint')

    expect(fs.existsSync).toHaveBeenCalledOnceWith(`${expectedCacheDirectory}/eslint`)
    expect(fs.rmSync).not.toHaveBeenCalled()
    expect(colourLog.info).toHaveBeenCalledOnceWith('No cache to clear for eslint.\n')
  })

})

describe('getCacheDirectory', () => {

  it('returns the resolved path to the cache sub-directory for a given tool', () => {
    jest.spyOn(path, 'resolve')

    const result = getCacheDirectory('eslint')

    expect(path.resolve).toHaveBeenCalledOnceWith(process.cwd(), '.lintpilotcache', 'eslint')
    expect(result).toBe(`${process.cwd()}/.lintpilotcache/eslint`)
  })

})
