import fs from 'node:fs'
import path from 'node:path'

import { Linter } from '@Types/lint'
import colourLog from '@Utils/colour-log'

import { clearCacheDirectory, getCacheDirectory } from '../cache'

jest.mock('node:fs')

const expectedCacheDirectory = path.join(process.cwd(), '.cache/lint')
const expectedCacheSubDirectory = path.join(expectedCacheDirectory, 'eslint')

describe('clearCacheDirectory', () => {

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

  it('clears the cache directory for a specific linter if it exists', () => {
    jest.mocked(fs.existsSync).mockReturnValueOnce(true)

    clearCacheDirectory(Linter.ESLint)

    expect(fs.existsSync).toHaveBeenCalledOnceWith(expectedCacheSubDirectory)
    expect(fs.rmSync).toHaveBeenCalledOnceWith(expectedCacheSubDirectory, {
      force: true,
      recursive: true,
    })
    expect(colourLog.info).toHaveBeenCalledOnceWith('Cache cleared for ESLint.\n')
  })

  it('does not attempt to clear the cache if the directory does not exist', () => {
    jest.mocked(fs.existsSync).mockReturnValueOnce(false)

    clearCacheDirectory()

    expect(fs.existsSync).toHaveBeenCalledOnceWith(expectedCacheDirectory)
    expect(fs.rmSync).not.toHaveBeenCalled()
    expect(colourLog.info).toHaveBeenCalledOnceWith('No cache to clear.\n')
  })

  it('does not attempt to clear the cache for a specific linter if the directory does not exist', () => {
    jest.mocked(fs.existsSync).mockReturnValueOnce(false)

    clearCacheDirectory(Linter.ESLint)

    expect(fs.existsSync).toHaveBeenCalledOnceWith(expectedCacheSubDirectory)
    expect(fs.rmSync).not.toHaveBeenCalled()
    expect(colourLog.info).toHaveBeenCalledOnceWith('No cache to clear for ESLint.\n')
  })

})

describe('getCacheDirectory', () => {

  it('returns the resolved path to a cache directory', () => {
    jest.spyOn(path, 'resolve')

    const result = getCacheDirectory(Linter.ESLint)

    expect(path.resolve).toHaveBeenCalledOnceWith(process.cwd(), '.cache/lint', 'eslint')
    expect(result).toBe(expectedCacheSubDirectory)
  })

})
