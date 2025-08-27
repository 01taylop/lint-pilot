import colourLog from '@Utils/colour-log'

import { exitHandler } from '../exit-handler'

import type { FSWatcher } from 'chokidar'

describe('exitHandler', () => {

  it('exits with an exit code of 0', async () => {
    expect.assertions(2)

    try {
      await exitHandler(0, 'SIGINT', undefined)
    } catch {
      expect(colourLog.error).not.toHaveBeenCalled()
      expect(process.exit).toHaveBeenCalledOnceWith(0)
    }
  })

  it('exits with an exit code of 1', async () => {
    expect.assertions(2)

    try {
      await exitHandler(1, 'Unexpected Error', undefined)
    } catch {
      expect(colourLog.error).not.toHaveBeenCalled()
      expect(process.exit).toHaveBeenCalledOnceWith(1)
    }
  })

  describe('when there is an error', () => {

    it('logs the error', async () => {
      expect.assertions(2)

      const error = new Error('Test Error')

      try {
        await exitHandler(1, 'Unexpected Error', undefined, error)
      } catch {
        expect(colourLog.error).toHaveBeenCalledOnceWith('Unexpected Error', error)
        expect(process.exit).toHaveBeenCalledOnceWith(1)
      }
    })

  })

  describe('when a watcher is provided', () => {

    it('closes the watcher', async () => {
      expect.assertions(3)

      const mockWatcher = {
        close: jest.fn(),
      } as unknown as FSWatcher

      try {
        await exitHandler(0, 'SIGINT', mockWatcher)
      } catch {
        expect(mockWatcher.close).toHaveBeenCalledTimes(1)
        expect(colourLog.error).not.toHaveBeenCalled()
        expect(process.exit).toHaveBeenCalledOnceWith(0)
      }
    })

    it('logs an error if the watcher fails to close', async () => {
      expect.assertions(3)

      const closeError = new Error('Close Error')
      const mockWatcher = {
        close: jest.fn(() => Promise.reject(closeError)),
      } as unknown as FSWatcher

      try {
        await exitHandler(0, 'SIGINT', mockWatcher)
      } catch {
        expect(mockWatcher.close).toHaveBeenCalledTimes(1)
        expect(colourLog.error).toHaveBeenCalledOnceWith('Failed to close file watcher', closeError)
        expect(process.exit).toHaveBeenCalledOnceWith(0)
      }
    })

    it('exits if the watcher fails to close after 5 seconds', async () => {
      expect.assertions(3)
      jest.useFakeTimers()

      const mockWatcher = {
        close: jest.fn(() => new Promise(() => {
          // Never resolves - simulates hanging watcher
        })),
      } as unknown as FSWatcher

      const exitPromise = exitHandler(0, 'SIGINT', mockWatcher)

      jest.advanceTimersByTime(5000)

      try {
        await exitPromise
      } catch {
        expect(mockWatcher.close).toHaveBeenCalledTimes(1)
        expect(colourLog.error).toHaveBeenCalledOnceWith('Failed to close file watcher', new Error('Watcher close timeout'))
        expect(process.exit).toHaveBeenCalledOnceWith(0)
      }
    })

  })

})
