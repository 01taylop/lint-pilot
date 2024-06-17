import { readFile } from 'fs'

import chokidar from 'chokidar'

import { Events } from '@Types'

import { fileChangeEvent, watchFiles } from '../watchFiles'

jest.mock('fs')
jest.mock('chokidar')

describe('watchFiles', () => {
  let mockWatcher: chokidar.FSWatcher

  const mockReadFile = (content: string) => {
    jest.mocked(readFile).mockImplementationOnce((_path: any, _encoding: any, callback?: (error: any, data: any) => void): void => {
      if (callback) {
        callback(null, content)
      }
    })
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
      persistent: true,
    })
  })

  it('emits a "FILE_CHANGED" event when saving an existing file (because there is no hash map yet)', done => {
    expect.assertions(1)

    const mockPath = 'mock/existing-file.ts'
    mockReadFile('open-and-save')

    fileChangeEvent.on(Events.FILE_CHANGED, params => {
      expect(params).toStrictEqual({
        message: `File \`${mockPath}\` has been changed.`,
        path: mockPath,
      })
      done()
    })

    watchFiles({ filePatterns: [mockPath], ignorePatterns: [] })

    const changeHandler = (mockWatcher.on as jest.Mock).mock.calls.find(call => call[0] === 'change')[1]
    changeHandler(mockPath)
  })

  it('emits a "FILE_CHANGED" event if the file content changes', done => {
    expect.assertions(2)

    const mockPath = 'mock/old-file.ts'
    mockReadFile('old-content')

    fileChangeEvent.on(Events.FILE_CHANGED, params => {
      expect(params).toStrictEqual({
        message: `File \`${mockPath}\` has been changed.`,
        path: mockPath,
      })
    })

    watchFiles({ filePatterns: [mockPath], ignorePatterns: [] })

    const changeHandler = (mockWatcher.on as jest.Mock).mock.calls.find(call => call[0] === 'change')[1]
    changeHandler(mockPath)

    mockReadFile('new-content')
    changeHandler(mockPath)

    setTimeout(() => {
      done()
    }, 100)
  })

  it('does not emit a "FILE_CHANGED" event if the file content did not change', done => {
    expect.assertions(1)

    const mockPath = 'mock/old-file.ts'
    mockReadFile('old-content')

    fileChangeEvent.on(Events.FILE_CHANGED, params => {
      expect(params).toStrictEqual({
        message: `File \`${mockPath}\` has been changed.`,
        path: mockPath,
      })
    })

    watchFiles({ filePatterns: [mockPath], ignorePatterns: [] })

    const changeHandler = (mockWatcher.on as jest.Mock).mock.calls.find(call => call[0] === 'change')[1]
    changeHandler(mockPath)
    changeHandler(mockPath)
    changeHandler(mockPath)

    setTimeout(() => {
      done()
    }, 100)
  })

  it('emits a "FILE_CHANGED" event if a file is added', done => {
    expect.assertions(1)

    const mockPath = 'mock/new-file.ts'
    mockReadFile('new-content')

    fileChangeEvent.on(Events.FILE_CHANGED, params => {
      expect(params).toStrictEqual({
        message: `File \`${mockPath}\` has been added.`,
        path: mockPath,
      })
      done()
    })

    watchFiles({ filePatterns: [mockPath], ignorePatterns: [] })

    const changeHandler = (mockWatcher.on as jest.Mock).mock.calls.find(call => call[0] === 'add')[1]
    changeHandler(mockPath)
  })

  it('emits a "FILE_CHANGED" event if a file is removed', done => {
    expect.assertions(1)

    const mockPath = 'mock/legacy-file.ts'
    mockReadFile('legacy-content')

    fileChangeEvent.on(Events.FILE_CHANGED, params => {
      expect(params).toStrictEqual({
        message: `File \`${mockPath}\` has been removed.`,
        path: mockPath,
      })
      done()
    })

    watchFiles({ filePatterns: [mockPath], ignorePatterns: [] })

    const changeHandler = (mockWatcher.on as jest.Mock).mock.calls.find(call => call[0] === 'unlink')[1]
    changeHandler(mockPath)
  })

})
