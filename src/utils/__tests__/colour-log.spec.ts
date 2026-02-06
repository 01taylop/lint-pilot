import chalk from 'chalk'

import colourLog from '../colour-log'

jest.mock('chalk', () => ({
  blue: jest.fn().mockImplementation(text => text),
  cyan: jest.fn().mockImplementation(text => text),
  dim: jest.fn().mockImplementation(text => text),
  magenta: jest.fn().mockImplementation(text => text),
  red: jest.fn().mockImplementation(text => text),
  yellow: jest.fn().mockImplementation(text => text),
}))

jest.unmock('@Utils/colour-log')

describe('colourLog', () => {

  const mockedConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {})
  const mockedConsoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {})

  describe('config', () => {

    it('logs the key in magenta and a single config item in dim', () => {
      colourLog.config('setting', ['foo'])

      expect(chalk.magenta).toHaveBeenCalledOnceWith('setting: ')
      expect(chalk.dim).toHaveBeenCalledOnceWith('foo')
      expect(mockedConsoleLog).toHaveBeenCalledOnceWith('setting: ', 'foo')
    })

    it('logs the key in magenta and the config array in dim', () => {
      colourLog.config('setting', ['foo', 'bar', 'baz'])

      expect(chalk.magenta).toHaveBeenCalledOnceWith('setting: ')
      expect(chalk.dim).toHaveBeenCalledOnceWith('[foo, bar, baz]')
      expect(mockedConsoleLog).toHaveBeenCalledOnceWith('setting: ', '[foo, bar, baz]')
    })

  })

  describe('configDebug', () => {

    it('does not log if global.debug is false', () => {
      global.debug = false

      colourLog.configDebug('Debug message', 'config')

      expect(chalk.blue).not.toHaveBeenCalled()
      expect(mockedConsoleLog).not.toHaveBeenCalled()
    })

    it('logs the message in blue and the config in default if global.debug is true', () => {
      global.debug = true

      colourLog.configDebug('Debug message', 'config')

      expect(chalk.blue).toHaveBeenCalledOnceWith('Debug message')
      expect(mockedConsoleLog).toHaveBeenCalledTimes(2)
      expect(mockedConsoleLog).toHaveBeenNthCalledWith(1, '\nDebug message')
      expect(mockedConsoleLog).toHaveBeenNthCalledWith(2, 'config')
    })

  })

  describe('error', () => {

    const error = new Error('Oops')

    it('logs the text in red', () => {
      colourLog.error('An error occurred')

      expect(chalk.red).toHaveBeenCalledOnceWith('\nAn error occurred.')
      expect(mockedConsoleLog).toHaveBeenCalledOnceWith('\nAn error occurred.')
    })

    it('logs additional debug information if there is an error and global.debug is false', () => {
      colourLog.error('An error occurred', error)

      expect(chalk.red).toHaveBeenCalledOnceWith('\nAn error occurred. Run with --debug for more information.')
      expect(mockedConsoleLog).toHaveBeenCalledOnceWith('\nAn error occurred. Run with --debug for more information.')
    })

    it('does not log the error if global.debug is false', () => {
      global.debug = false

      colourLog.error('An error occurred', error)

      expect(chalk.red).toHaveBeenCalledOnceWith('\nAn error occurred. Run with --debug for more information.')
      expect(mockedConsoleLog).toHaveBeenCalledTimes(1)
      expect(mockedConsoleLog).toHaveBeenNthCalledWith(1, '\nAn error occurred. Run with --debug for more information.')
    })

    it('logs the error if global.debug is true', () => {
      global.debug = true

      colourLog.error('An error occurred', error)

      expect(chalk.red).toHaveBeenCalledOnceWith('\nAn error occurred.')
      expect(mockedConsoleLog).toHaveBeenCalledTimes(3)
      expect(mockedConsoleLog).toHaveBeenNthCalledWith(1, '\nAn error occurred.')
      expect(mockedConsoleLog).toHaveBeenNthCalledWith(2)
      expect(mockedConsoleLog).toHaveBeenNthCalledWith(3, error)
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
      colourLog.title('✈️ Lint Pilot ✈️')

      expect(chalk.cyan).toHaveBeenCalledOnceWith('✈️ Lint Pilot ✈️')
      expect(mockedConsoleLog).toHaveBeenCalledOnceWith('✈️ Lint Pilot ✈️')
    })

  })

  describe('warning', () => {

    it('logs the text in yellow', () => {
      colourLog.warning('Be careful!')

      expect(chalk.yellow).toHaveBeenCalledOnceWith('Be careful!')
      expect(mockedConsoleWarn).toHaveBeenCalledOnceWith('Be careful!')
    })

  })

})
