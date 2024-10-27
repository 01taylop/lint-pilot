import chalk from 'chalk'

import colourLog from '../colour-log'

jest.mock('chalk', () => ({
  cyan: jest.fn().mockImplementation(text => text),
}))

describe('colourLog', () => {

  const mockedConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {})

  describe('title', () => {

    it('logs the title in cyan', () => {
      colourLog.title('✈️ Lint Pilot')

      expect(chalk.cyan).toHaveBeenCalledOnceWith('✈️ Lint Pilot')
      expect(mockedConsoleLog).toHaveBeenCalledOnceWith('✈️ Lint Pilot')
    })

  })

})
