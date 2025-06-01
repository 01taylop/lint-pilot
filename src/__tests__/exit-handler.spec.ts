import colourLog from '@Utils/colour-log'

import { exitHandler } from '../exit-handler'

jest.mock('@Utils/colour-log')

describe('exitHandler', () => {

  it('exits with an exit code of 0', () => {
    try {
      exitHandler(0, 'Normal Exit')
    } catch {
      expect(colourLog.error).not.toHaveBeenCalled()
      expect(process.exit).toHaveBeenCalledWith(0)
    }
  })

  it('exits with an exit code of 1', () => {
    try {
      exitHandler(1, 'Error Exit')
    } catch {
      expect(colourLog.error).not.toHaveBeenCalled()
      expect(process.exit).toHaveBeenCalledWith(1)
    }
  })

  it('logs an error when the exit code is 1 and there is an error', () => {
    const err = new Error('Test Error')

    try {
      exitHandler(1, 'Error Exit', err)
    } catch {
      expect(colourLog.error).toHaveBeenCalledOnceWith('Error Exit', err)
      expect(process.exit).toHaveBeenCalledWith(1)
    }
  })

})
