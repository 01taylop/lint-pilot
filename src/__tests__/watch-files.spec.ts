import { readFile } from 'fs'

import chokidar from 'chokidar'

import { Events } from '@Types'

import { fileChangeEvent, watchFiles } from '../watch-files'

jest.mock('fs')
jest.mock('chokidar')

describe('watchFiles', () => {
  let mockWatcher: chokidar.FSWatcher

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

  it('initialises chokidar with the correct file and ignore patterns', () => {
    const filePatterns = ['**/*.ts']
    const ignorePatterns = ['node_modules']

    watchFiles({ filePatterns, ignorePatterns })

    expect(chokidar.watch).toHaveBeenCalledWith(filePatterns, {
      ignored: ignorePatterns,
      ignoreInitial: true,
      persistent: true,
    })
  })

  it('emits a "FILE_CHANGED" event when saving an existing file (because there is no hash map yet)', done => {
    expect.assertions(1)

    const mockPath = 'mock/existing-file.ts'

    fileChangeEvent.on(Events.FILE_CHANGED, params => {
      expect(params).toStrictEqual({
        message: `File \`${mockPath}\` has been changed.`,
        path: mockPath,
      })
      done()
    })

    watchFiles({ filePatterns: [mockPath], ignorePatterns: [] })

    saveFile(mockPath, 'hello-world', 'change')
  })

  it('emits a "FILE_CHANGED" event when saving a file if the file content changes', done => {
    expect.assertions(2)

    const mockPath = 'mock/update-file.ts'

    fileChangeEvent.on(Events.FILE_CHANGED, params => {
      expect(params).toStrictEqual({
        message: `File \`${mockPath}\` has been changed.`,
        path: mockPath,
      })
    })

    watchFiles({ filePatterns: [mockPath], ignorePatterns: [] })

    saveFile(mockPath, 'old-content', 'change') // First save - no hash map yet
    saveFile(mockPath, 'new-content', 'change') // Second save - content hash is different

    setTimeout(() => {
      done()
    }, 100)
  })

  it('does not emit a "FILE_CHANGED" event when saving a file if the file content did not change', done => {
    expect.assertions(1)

    const mockPath = 'mock/unchanged-file.ts'

    fileChangeEvent.on(Events.FILE_CHANGED, params => {
      expect(params).toStrictEqual({
        message: `File \`${mockPath}\` has been changed.`,
        path: mockPath,
      })
    })

    watchFiles({ filePatterns: [mockPath], ignorePatterns: [] })

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

    fileChangeEvent.on(Events.FILE_CHANGED, params => {
      expect(params).toStrictEqual({
        message: `File \`${mockPath}\` has been added.`,
        path: mockPath,
      })
      done()
    })

    watchFiles({ filePatterns: [mockPath], ignorePatterns: [] })

    saveFile(mockPath, 'new-content', 'add')
  })

  it('emits a "FILE_CHANGED" event when a file is removed', done => {
    expect.assertions(1)

    const mockPath = 'mock/legacy-file.ts'

    fileChangeEvent.on(Events.FILE_CHANGED, params => {
      expect(params).toStrictEqual({
        message: `File \`${mockPath}\` has been removed.`,
        path: mockPath,
      })
      done()
    })

    watchFiles({ filePatterns: [mockPath], ignorePatterns: [] })

    saveFile(mockPath, 'legacy-content', 'unlink')
  })

})
