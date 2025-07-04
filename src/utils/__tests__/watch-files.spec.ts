import { readFile } from 'node:fs'

import chokidar from 'chokidar'

import { Linter } from '@Types/lint'

import { EVENTS, fileWatcherEvents, watchFiles } from '../watch-files'

import type { FSWatcher } from 'chokidar'
import type { FilePatterns } from '@Types/lint'

jest.mock('node:fs')
jest.mock('chokidar')

describe('watchFiles', () => {
  let mockWatcher: FSWatcher

  const getEventPromise = (eventHandler: jest.Mock): Promise<void> => new Promise<void>(resolve => {
    fileWatcherEvents.on(EVENTS.FILE_CHANGED, (params: Record<string, unknown>) => {
      eventHandler(params)
      resolve()
    })
  })

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
    } as Partial<FSWatcher> as FSWatcher

    jest.mocked(chokidar.watch).mockReturnValue(mockWatcher)
  })

  afterEach(() => {
    fileWatcherEvents.removeAllListeners()
  })

  it('returns the watcher instance', () => {
    const watcher = watchFiles({
      includePatterns: getIncludePatterns(),
      ignorePatterns: [],
    })

    expect(watcher).toBe(mockWatcher)
  })

  it('initialises chokidar for all linters when no specific linters are provided', () => {
    watchFiles({
      includePatterns: getIncludePatterns(),
      ignorePatterns: ['node_modules'],
    })

    expect(chokidar.watch).toHaveBeenCalledOnceWith(['**/*.ts', '**/*.md', '**/*.css'], {
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

    expect(chokidar.watch).toHaveBeenCalledOnceWith([expectedPattern], {
      ignored: ['node_modules'],
      ignoreInitial: true,
      persistent: true,
    })
  })

  it('emits a "FILE_CHANGED" event when saving an existing file (because there is no hash map yet)', async () => {
    expect.assertions(2)

    const eventHandler = jest.fn()
    const eventPromise = getEventPromise(eventHandler)
    const mockPath = 'mock/existing-file.ts'

    watchFiles({
      includePatterns: getIncludePatterns(mockPath),
      ignorePatterns: [],
    })
    saveFile(mockPath, 'hello-world', 'change')

    await eventPromise

    expect(eventHandler).toHaveBeenCalledTimes(1)
    expect(eventHandler).toHaveBeenNthCalledWith(1, {
      message: `File \`${mockPath}\` has been changed.`,
      path: mockPath,
    })
  })

  it('emits a "FILE_CHANGED" event when saving a file if the file content changes', async () => {
    expect.assertions(3)

    const eventHandler = jest.fn()
    const eventPromise = getEventPromise(eventHandler)
    const mockPath = 'mock/update-file.ts'

    watchFiles({
      includePatterns: getIncludePatterns(mockPath),
      ignorePatterns: [],
    })
    saveFile(mockPath, 'old-content', 'change') // First save - no hash map yet
    saveFile(mockPath, 'new-content', 'change') // Second save - content hash is different

    await eventPromise

    expect(eventHandler).toHaveBeenCalledTimes(2)
    expect(eventHandler).toHaveBeenNthCalledWith(1, {
      message: `File \`${mockPath}\` has been changed.`,
      path: mockPath,
    })
    expect(eventHandler).toHaveBeenNthCalledWith(2, {
      message: `File \`${mockPath}\` has been changed.`,
      path: mockPath,
    })
  })

  it('does not emit a "FILE_CHANGED" event when saving a file if the file content did not change', async () => {
    expect.assertions(2)

    const eventHandler = jest.fn()
    const eventPromise = getEventPromise(eventHandler)
    const mockPath = 'mock/unchanged-file.ts'

    watchFiles({
      includePatterns: getIncludePatterns(mockPath),
      ignorePatterns: [],
    })
    saveFile(mockPath, 'old-content', 'change') // First save - no hash map yet
    saveFile(mockPath, 'old-content', 'change') // Second save - content hash is the same
    saveFile(mockPath, 'old-content', 'change') // Third save - content hash is still the same

    await eventPromise

    expect(eventHandler).toHaveBeenCalledTimes(1)
    expect(eventHandler).toHaveBeenNthCalledWith(1, {
      message: `File \`${mockPath}\` has been changed.`,
      path: mockPath,
    })
  })

  it('emits a "FILE_CHANGED" event when a new file is added', async () => {
    expect.assertions(2)

    const eventHandler = jest.fn()
    const eventPromise = getEventPromise(eventHandler)
    const mockPath = 'mock/new-file.ts'

    watchFiles({
      includePatterns: getIncludePatterns(mockPath),
      ignorePatterns: [],
    })
    saveFile(mockPath, 'new-content', 'add')

    await eventPromise

    expect(eventHandler).toHaveBeenCalledTimes(1)
    expect(eventHandler).toHaveBeenNthCalledWith(1, {
      message: `File \`${mockPath}\` has been added.`,
      path: mockPath,
    })
  })

  it('emits a "FILE_CHANGED" event when a file is removed', async () => {
    expect.assertions(2)

    const eventHandler = jest.fn()
    const eventPromise = getEventPromise(eventHandler)
    const mockPath = 'mock/legacy-file.ts'

    watchFiles({
      includePatterns: getIncludePatterns(mockPath),
      ignorePatterns: [],
    })
    saveFile(mockPath, 'legacy-content', 'unlink')

    await eventPromise

    expect(eventHandler).toHaveBeenCalledTimes(1)
    expect(eventHandler).toHaveBeenNthCalledWith(1, {
      message: `File \`${mockPath}\` has been removed.`,
      path: mockPath,
    })
  })

})
