import { readFile } from 'node:fs'

import chokidar from 'chokidar'

import { EVENTS, fileChangeEvent, watchFiles } from '../watch-files'

jest.mock('node:fs')
jest.mock('chokidar')

describe('watchFiles', () => {
  let mockWatcher: chokidar.FSWatcher

  const getEventPromise = (eventHandler: jest.Mock): Promise<void> => new Promise<void>((resolve) => {
    fileChangeEvent.on(EVENTS.FILE_CHANGED, (params: Record<string, unknown>) => {
      eventHandler(params)
      resolve()
    })
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
    fileChangeEvent.removeAllListeners()
  })

  it('initialises chokidar with the file patterns and ignore patterns', () => {
    const filePatterns = ['**/*.ts']
    const ignorePatterns = ['node_modules']

    watchFiles({ filePatterns, ignorePatterns })

    expect(chokidar.watch).toHaveBeenCalledWith(filePatterns, {
      ignored: ignorePatterns,
      ignoreInitial: true,
      persistent: true,
    })
  })

  it('emits a "FILE_CHANGED" event when saving an existing file (because there is no hash map yet)', async () => {
    expect.assertions(2)

    const eventHandler = jest.fn()
    const eventPromise = getEventPromise(eventHandler)
    const mockPath = 'mock/existing-file.ts'

    watchFiles({ filePatterns: [mockPath], ignorePatterns: [] })
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

    watchFiles({ filePatterns: [mockPath], ignorePatterns: [] })
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

    watchFiles({ filePatterns: [mockPath], ignorePatterns: [] })
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

    watchFiles({ filePatterns: [mockPath], ignorePatterns: [] })
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

    watchFiles({ filePatterns: [mockPath], ignorePatterns: [] })
    saveFile(mockPath, 'legacy-content', 'unlink')

    await eventPromise

    expect(eventHandler).toHaveBeenCalledTimes(1)
    expect(eventHandler).toHaveBeenNthCalledWith(1, {
      message: `File \`${mockPath}\` has been removed.`,
      path: mockPath,
    })
  })

})
