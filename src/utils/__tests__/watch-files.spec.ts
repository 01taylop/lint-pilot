import { readFile } from 'node:fs'

import chokidar from 'chokidar'

import { Linter } from '@Types/lint'

import { EVENTS, fileWatcherEvents, watchFiles } from '../watch-files'

import type { FilePatterns } from '@Types/lint'

jest.mock('node:fs')
jest.mock('chokidar')

describe('watchFiles', () => {
  let mockWatcher: chokidar.FSWatcher

  const getIncludePatterns = (esPattern: string = '**/*.ts'): FilePatterns['includePatterns'] => ({
    [Linter.ESLint]: [esPattern],
    [Linter.Markdownlint]: ['**/*.md'],
    [Linter.Stylelint]: ['**/*.css'],
  })

  const saveFile = (path: string, content: string, event: 'add' | 'change' | 'unlink') => {
    jest.mocked(readFile).mockImplementationOnce((_path: any, _encoding: any, callback?: (error: any, data: any) => void): void => {
      if (callback) {
        callback(null, content)
      }
    })

    const changeEvent = (mockWatcher.on as jest.Mock).mock.calls.find(call => call[0] === event)
    if (changeEvent && changeEvent[1]) {
      changeEvent[1](path)
    }
  }

  beforeEach(() => {
    mockWatcher = {
      add: jest.fn(),
      close: jest.fn(),
      on: jest.fn(),
      unwatch: jest.fn(),
    } as unknown as chokidar.FSWatcher

    jest.mocked(chokidar.watch).mockReturnValue(mockWatcher)
  })

  afterEach(() => {
    fileWatcherEvents.removeAllListeners()
  })

  it('initialises chokidar for all linters when no specific linters are provided', () => {
    watchFiles({
      includePatterns: getIncludePatterns(),
      ignorePatterns: ['node_modules'],
    })

    expect(chokidar.watch).toHaveBeenCalledWith(['**/*.ts', '**/*.md', '**/*.css'], {
      ignored: ['node_modules'],
      ignoreInitial: true,
      persistent: true,
    })
  })

  test.each([
    [Linter.ESLint, '**/*.ts'],
    [Linter.Markdownlint, '**/*.md'],
    [Linter.Stylelint, '**/*.css'],
  ])('initialises chokidar for %s when specified', (linter, expectedPattern) => {
    watchFiles({
      includePatterns: getIncludePatterns(),
      ignorePatterns: ['node_modules'],
    }, [linter])

    expect(chokidar.watch).toHaveBeenCalledWith([expectedPattern], {
      ignored: ['node_modules'],
      ignoreInitial: true,
      persistent: true,
    })
  })

  it('emits a "FILE_CHANGED" event when saving an existing file (because there is no hash map yet)', done => {
    expect.assertions(1)

    const mockPath = 'mock/existing-file.ts'

    fileWatcherEvents.on(EVENTS.FILE_CHANGED, params => {
      expect(params).toStrictEqual({
        message: `File \`${mockPath}\` has been changed.`,
        path: mockPath,
      })
      done()
    })

    watchFiles({
      includePatterns: getIncludePatterns(mockPath),
      ignorePatterns: [],
    })

    saveFile(mockPath, 'hello-world', 'change')
  })

  it('emits a "FILE_CHANGED" event when saving a file if the file content changes', done => {
    expect.assertions(2)

    const mockPath = 'mock/update-file.ts'

    fileWatcherEvents.on(EVENTS.FILE_CHANGED, params => {
      expect(params).toStrictEqual({
        message: `File \`${mockPath}\` has been changed.`,
        path: mockPath,
      })
    })

    watchFiles({
      includePatterns: getIncludePatterns(mockPath),
      ignorePatterns: [],
    })

    saveFile(mockPath, 'old-content', 'change') // First save - no hash map yet
    saveFile(mockPath, 'new-content', 'change') // Second save - content hash is different

    setTimeout(() => {
      done()
    }, 100)
  })

  it('does not emit a "FILE_CHANGED" event when saving a file if the file content did not change', done => {
    expect.assertions(1)

    const mockPath = 'mock/unchanged-file.ts'

    fileWatcherEvents.on(EVENTS.FILE_CHANGED, params => {
      expect(params).toStrictEqual({
        message: `File \`${mockPath}\` has been changed.`,
        path: mockPath,
      })
    })

    watchFiles({
      includePatterns: getIncludePatterns(mockPath),
      ignorePatterns: [],
    })

    saveFile(mockPath, 'old-content', 'change') // First save - no hash map yet
    saveFile(mockPath, 'old-content', 'change') // Second save - content hash is the same
    saveFile(mockPath, 'old-content', 'change') // Third save - content hash is still the same

    setTimeout(() => {
      done()
    }, 100)
  })

  it('emits a "FILE_CHANGED" event when a new file is added', done => {
    expect.assertions(1)

    const mockPath = 'mock/new-file.ts'

    fileWatcherEvents.on(EVENTS.FILE_CHANGED, params => {
      expect(params).toStrictEqual({
        message: `File \`${mockPath}\` has been added.`,
        path: mockPath,
      })
      done()
    })

    watchFiles({
      includePatterns: getIncludePatterns(mockPath),
      ignorePatterns: [],
    })

    saveFile(mockPath, 'new-content', 'add')
  })

  it('emits a "FILE_CHANGED" event when a file is removed', done => {
    expect.assertions(1)

    const mockPath = 'mock/legacy-file.ts'

    fileWatcherEvents.on(EVENTS.FILE_CHANGED, params => {
      expect(params).toStrictEqual({
        message: `File \`${mockPath}\` has been removed.`,
        path: mockPath,
      })
      done()
    })

    watchFiles({
      includePatterns: getIncludePatterns(mockPath),
      ignorePatterns: [],
    })

    saveFile(mockPath, 'legacy-content', 'unlink')
  })

})
