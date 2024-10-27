import chalk from 'chalk'

import colourLog from '../colour-log'

jest.mock('chalk', () => ({
  blue: jest.fn().mockImplementation(text => text),
  cyan: jest.fn().mockImplementation(text => text),
}))

describe('colourLog', () => {

  const mockedConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {})

  describe('info', () => {

    it('logs the text in blue', () => {
      colourLog.info('Starting lint...')

      expect(chalk.blue).toHaveBeenCalledOnceWith('Starting lint...')
      expect(mockedConsoleLog).toHaveBeenCalledOnceWith('Starting lint...')
    })

  })

  describe('title', () => {

    it('logs the title in cyan', () => {
      colourLog.title('✈️ Lint Pilot')

      expect(chalk.cyan).toHaveBeenCalledOnceWith('✈️ Lint Pilot')
      expect(mockedConsoleLog).toHaveBeenCalledOnceWith('✈️ Lint Pilot')
    })

  })

})
