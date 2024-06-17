import { glob } from 'glob'

import { Linter } from '@Types'

import sourceFiles from '../sourceFiles'

jest.mock('glob')

describe('sourceFiles', () => {

  jest.spyOn(console, 'log').mockImplementation(() => {})
  jest.spyOn(console, 'error').mockImplementation(() => {})
  jest.spyOn(process, 'exit').mockImplementation(() => null as never)

  const commonArgs = {
    debug: false,
    filePattern: '*.ts',
    ignore: 'node_modules',
    linter: Linter.ESLint,
  }

  it('returns files matching the pattern', async () => {
    jest.mocked(glob).mockResolvedValue(['file1.ts', 'file2.ts'])

    const files = await sourceFiles(commonArgs)

    expect(glob).toHaveBeenCalledWith('*.ts', { ignore: 'node_modules' })
    expect(files).toEqual(['file1.ts', 'file2.ts'])
    expect(console.log).not.toHaveBeenCalled()
  })

  it('logs the files sourced if debug is true (single file)', async () => {
    jest.mocked(glob).mockResolvedValue(['file1.ts'])

    const files = await sourceFiles({
      ...commonArgs,
      debug: true,
    })

    expect(glob).toHaveBeenCalledWith('*.ts', { ignore: 'node_modules' })
    expect(files).toEqual(['file1.ts'])
    expect(console.log).toHaveBeenCalledWith('\nSourced 1 file matching "*.ts" for ESLint:')
    expect(console.log).toHaveBeenCalledWith(['file1.ts'])
  })

  it('logs the files sourced if debug is true (multiple files)', async () => {
    jest.mocked(glob).mockResolvedValue(['file1.ts', 'file2.ts'])

    const files = await sourceFiles({
      ...commonArgs,
      debug: true,
    })

    expect(glob).toHaveBeenCalledWith('*.ts', { ignore: 'node_modules' })
    expect(files).toEqual(['file1.ts', 'file2.ts'])
    expect(console.log).toHaveBeenCalledWith('\nSourced 2 files matching "*.ts" for ESLint:')
    expect(console.log).toHaveBeenCalledWith(['file1.ts', 'file2.ts'])
  })

  it('logs the files sourced if debug is true (no sourced files)', async () => {
    jest.mocked(glob).mockResolvedValue([])

    const files = await sourceFiles({
      ...commonArgs,
      debug: true,
    })

    expect(glob).toHaveBeenCalledWith('*.ts', { ignore: 'node_modules' })
    expect(files).toEqual([])
    expect(console.log).toHaveBeenCalledWith('\nSourced 0 files matching "*.ts" for ESLint:')
    expect(console.log).toHaveBeenCalledWith([])
  })

  it('catches any errors and exists the process', async () => {
    jest.mocked(glob).mockRejectedValue(new Error('Test error'))

    await sourceFiles(commonArgs)

    expect(console.error).toHaveBeenCalledWith('An error occurred while trying to source files matching *.ts', new Error('Test error'))
    expect(process.exit).toHaveBeenCalledWith(1)
  })

})
