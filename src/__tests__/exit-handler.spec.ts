import colourLog from '@Utils/colour-log'

import { exitHandler } from '../exit-handler'

import type { FSWatcher } from 'chokidar'

jest.mock('@Utils/colour-log')

describe('exitHandler', () => {

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => true)
  })

  it('exits with an exit code of 0', () => {
    expect.assertions(3)

    try {
      exitHandler(0, 'Normal Exit', undefined)
    } catch {
      expect(colourLog.error).not.toHaveBeenCalled()
      expect(console.log).toHaveBeenCalledOnceWith()
      expect(process.exit).toHaveBeenCalledOnceWith(0)
    }
  })

  it('exits with an exit code of 1', () => {
    expect.assertions(3)

    try {
      exitHandler(1, 'Error Exit', undefined)
    } catch {
      expect(colourLog.error).not.toHaveBeenCalled()
      expect(console.log).toHaveBeenCalledOnceWith()
      expect(process.exit).toHaveBeenCalledOnceWith(1)
    }
  })

  it('logs an error when the exit code is 1 and there is an error', () => {
    expect.assertions(3)

    const err = new Error('Test Error')

    try {
      exitHandler(1, 'Error Exit', undefined, err)
    } catch {
      expect(colourLog.error).toHaveBeenCalledOnceWith('Error Exit', err)
      expect(console.log).toHaveBeenCalledOnceWith()
      expect(process.exit).toHaveBeenCalledOnceWith(1)
    }
  })

  it('closes the watcher if provided', () => {
    expect.assertions(3)

    const mockWatcher = { close: jest.fn() }

    try {
      exitHandler(0, 'Normal Exit', mockWatcher as Partial<FSWatcher> as FSWatcher)
    } catch {
      expect(mockWatcher.close).toHaveBeenCalled()
      expect(console.log).toHaveBeenCalledOnceWith()
      expect(process.exit).toHaveBeenCalledOnceWith(0)
    }
  })

})
