import chalk from 'chalk'

import colourLog from '../colour-log'

jest.mock('chalk', () => ({
  blue: jest.fn().mockImplementation(text => text),
  cyan: jest.fn().mockImplementation(text => text),
  dim: jest.fn().mockImplementation(text => text),
  magenta: jest.fn().mockImplementation(text => text),
}))

describe('colourLog', () => {

  const mockedConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {})

  describe('config', () => {

    it('logs the key in magenta and a single config item in dim', () => {
      colourLog.config('setting', ['foo'])

      expect(chalk.magenta).toHaveBeenCalledOnceWith('setting: ')
      expect(chalk.dim).toHaveBeenCalledOnceWith('foo')
      expect(mockedConsoleLog).toHaveBeenCalledOnceWith('setting: ', 'foo')
    })

    it('logs the key in magenta and a config array in dim', () => {
      colourLog.config('setting', ['foo', 'bar', 'baz'])

      expect(chalk.magenta).toHaveBeenCalledOnceWith('setting: ')
      expect(chalk.dim).toHaveBeenCalledOnceWith('[foo, bar, baz]')
      expect(mockedConsoleLog).toHaveBeenCalledOnceWith('setting: ', '[foo, bar, baz]')
    })

  })

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
