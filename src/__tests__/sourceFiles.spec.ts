import { glob } from 'glob'

import { Linter } from '@Types'
import colourLog from '@Utils/colourLog'

import sourceFiles from '../sourceFiles'

jest.mock('glob')

describe('sourceFiles', () => {

  jest.spyOn(colourLog, 'configDebug').mockImplementation(() => {})
  jest.spyOn(colourLog, 'error').mockImplementation(() => {})
  jest.spyOn(process, 'exit').mockImplementation(() => null as never)

  const commonArgs = {
    filePattern: '*.ts',
    ignore: 'node_modules',
    linter: Linter.ESLint,
  }

  it('returns an empty array when no files match the file pattern', async () => {
    jest.mocked(glob).mockResolvedValue([])

    const files = await sourceFiles(commonArgs)

    expect(glob).toHaveBeenCalledWith('*.ts', { ignore: 'node_modules' })
    expect(files).toEqual([])
    expect(colourLog.configDebug).toHaveBeenCalledWith('Sourced 0 files matching "*.ts" for ESLint:', [])
  })

  it('returns files matching the file pattern (single file)', async () => {
    const mockedFiles = ['file1.ts']

    jest.mocked(glob).mockResolvedValue(mockedFiles)

    const files = await sourceFiles(commonArgs)

    expect(glob).toHaveBeenCalledWith('*.ts', { ignore: 'node_modules' })
    expect(files).toEqual(mockedFiles)
    expect(colourLog.configDebug).toHaveBeenCalledWith('Sourced 1 file matching "*.ts" for ESLint:', mockedFiles)
  })

  it('returns files matching the file pattern (multiple files)', async () => {
    const mockedFiles = ['file1.ts', 'file2.ts']

    jest.mocked(glob).mockResolvedValue(mockedFiles)

    const files = await sourceFiles(commonArgs)

    expect(glob).toHaveBeenCalledWith('*.ts', { ignore: 'node_modules' })
    expect(files).toEqual(mockedFiles)
    expect(colourLog.configDebug).toHaveBeenCalledWith('Sourced 2 files matching "*.ts" for ESLint:', mockedFiles)
  })

  it('catches any errors and exists the process', async () => {
    const error = new Error('Test error')

    jest.mocked(glob).mockRejectedValue(error)

    await sourceFiles(commonArgs)

    expect(colourLog.error).toHaveBeenCalledWith('An error occurred while trying to source files matching *.ts', error)
    expect(process.exit).toHaveBeenCalledWith(1)
  })

})
