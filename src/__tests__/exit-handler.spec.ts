import colourLog from '@Utils/colour-log'

import { exitHandler } from '../exit-handler'

import type { FSWatcher } from 'chokidar'

jest.mock('@Utils/colour-log')

describe('exitHandler', () => {

  it('exits with an exit code of 0', async () => {
    expect.assertions(2)

    try {
      await exitHandler(0, 'Normal Exit', undefined)
    } catch {
      expect(colourLog.error).not.toHaveBeenCalled()
      expect(process.exit).toHaveBeenCalledOnceWith(0)
    }
  })

  it('exits with an exit code of 1', async () => {
    expect.assertions(2)

    try {
      await exitHandler(1, 'Error Exit', undefined)
    } catch {
      expect(colourLog.error).not.toHaveBeenCalled()
      expect(process.exit).toHaveBeenCalledOnceWith(1)
    }
  })

  it('logs an error when the exit code is 1 and there is an error', async () => {
    expect.assertions(2)

    const error = new Error('Test Error')

    try {
      await exitHandler(1, 'Error Exit', undefined, error)
    } catch {
      expect(colourLog.error).toHaveBeenCalledOnceWith('Error Exit', error)
      expect(process.exit).toHaveBeenCalledOnceWith(1)
    }
  })

  it('closes the watcher if provided', async () => {
    expect.assertions(2)

    const mockWatcher = { close: jest.fn() } as unknown as FSWatcher

    try {
      await exitHandler(0, 'Normal Exit', mockWatcher)
    } catch {
      expect(mockWatcher.close).toHaveBeenCalled()
      expect(process.exit).toHaveBeenCalledOnceWith(0)
    }
  })

})
