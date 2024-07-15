import { glob } from 'glob'

import { Linter } from '@Types'
import colourLog from '@Utils/colourLog'

import sourceFiles from '../sourceFiles'

jest.mock('glob')

describe('sourceFiles', () => {

  jest.spyOn(colourLog, 'error').mockImplementation(() => {})
  jest.spyOn(colourLog, 'info').mockImplementation(() => {})
  jest.spyOn(console, 'log').mockImplementation(() => {})
  jest.spyOn(process, 'exit').mockImplementation(() => null as never)

  const commonArgs = {
    filePattern: '*.ts',
    ignore: 'node_modules',
    linter: Linter.ESLint,
  }

  it('returns files matching the file pattern', async () => {
    jest.mocked(glob).mockResolvedValue(['file1.ts', 'file2.ts'])

    const files = await sourceFiles(commonArgs)

    expect(glob).toHaveBeenCalledWith('*.ts', { ignore: 'node_modules' })
    expect(files).toEqual(['file1.ts', 'file2.ts'])
    expect(console.log).not.toHaveBeenCalled()
  })

  it('logs the files sourced if global.debug is true (single file)', async () => {
    global.debug = true

    jest.mocked(glob).mockResolvedValue(['file1.ts'])

    const files = await sourceFiles(commonArgs)

    expect(glob).toHaveBeenCalledWith('*.ts', { ignore: 'node_modules' })
    expect(files).toEqual(['file1.ts'])
    expect(colourLog.info).toHaveBeenCalledWith('\nSourced 1 file matching "*.ts" for ESLint:')
    expect(console.log).toHaveBeenCalledWith(['file1.ts'])
  })

  it('logs the files sourced if global.debug is true (multiple files)', async () => {
    global.debug = true

    jest.mocked(glob).mockResolvedValue(['file1.ts', 'file2.ts'])

    const files = await sourceFiles(commonArgs)

    expect(glob).toHaveBeenCalledWith('*.ts', { ignore: 'node_modules' })
    expect(files).toEqual(['file1.ts', 'file2.ts'])
    expect(colourLog.info).toHaveBeenCalledWith('\nSourced 2 files matching "*.ts" for ESLint:')
    expect(console.log).toHaveBeenCalledWith(['file1.ts', 'file2.ts'])
  })

  it('logs the files sourced if global.debug is true (no sourced files)', async () => {
    global.debug = true

    jest.mocked(glob).mockResolvedValue([])

    const files = await sourceFiles(commonArgs)

    expect(glob).toHaveBeenCalledWith('*.ts', { ignore: 'node_modules' })
    expect(files).toEqual([])
    expect(colourLog.info).toHaveBeenCalledWith('\nSourced 0 files matching "*.ts" for ESLint:')
    expect(console.log).toHaveBeenCalledWith([])
  })

  it('catches any errors and exists the process', async () => {
    const error = new Error('Test error')
    jest.mocked(glob).mockRejectedValue(error)

    await sourceFiles(commonArgs)

    expect(colourLog.error).toHaveBeenCalledWith('An error occurred while trying to source files matching *.ts', error)
    expect(process.exit).toHaveBeenCalledWith(1)
  })

})
