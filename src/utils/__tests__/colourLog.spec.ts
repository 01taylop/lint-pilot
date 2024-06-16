import chalk from 'chalk'

import { Linter } from '@Types'

import colourLog from '../colourLog'

jest.mock('chalk', () => ({
  bgGreen: {
    black: jest.fn().mockImplementation(text => text),
  },
  bgRed: {
    black: jest.fn().mockImplementation(text => text),
  },
  bgYellow: {
    black: jest.fn().mockImplementation(text => text),
  },
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

      expect(chalk.magenta).toHaveBeenCalledTimes(1)
      expect(chalk.magenta).toHaveBeenCalledWith('setting:')
      expect(chalk.dim).toHaveBeenCalledTimes(1)
      expect(chalk.dim).toHaveBeenCalledWith('foo')
      expect(mockedConsoleLog).toHaveBeenCalledTimes(1)
      expect(mockedConsoleLog).toHaveBeenCalledWith('setting:', 'foo')
    })

    it('logs the key in magenta and the config array in dim', () => {
      colourLog.config('setting', ['foo', 'bar', 'baz'])

      expect(chalk.magenta).toHaveBeenCalledTimes(1)
      expect(chalk.magenta).toHaveBeenCalledWith('setting:')
      expect(chalk.dim).toHaveBeenCalledTimes(1)
      expect(chalk.dim).toHaveBeenCalledWith('[foo, bar, baz]')
      expect(mockedConsoleLog).toHaveBeenCalledTimes(1)
      expect(mockedConsoleLog).toHaveBeenCalledWith('setting:', '[foo, bar, baz]')
    })

  })

  describe('info', () => {

    it('logs the text in blue', () => {
      colourLog.info('Starting lint...')

      expect(chalk.blue).toHaveBeenCalledTimes(1)
      expect(chalk.blue).toHaveBeenCalledWith('Starting lint...')
      expect(mockedConsoleLog).toHaveBeenCalledTimes(1)
      expect(mockedConsoleLog).toHaveBeenCalledWith('Starting lint...')
    })

  })

  // TODO: Write test for the colourLog.result function
  describe.skip('result', () => {
  })

  describe('resultBlock', () => {

    const commonResult = {
      deprecatedRules: [],
      errorCount: 0,
      fileCount: 1,
      fixableErrorCount: 0,
      fixableWarningCount: 0,
      linter: Linter.ESLint,
      warningCount: 0,
    }

    it('logs the error count in a red background', () => {
      colourLog.resultBlock({
        ...commonResult,
        errorCount: 1,
      })

      expect(chalk.bgRed.black).toHaveBeenCalledTimes(1)
      expect(chalk.bgRed.black).toHaveBeenCalledWith(' 1 ESLint Error ')
      expect(mockedConsoleLog).toHaveBeenCalledTimes(1)
      expect(mockedConsoleLog).toHaveBeenCalledWith('💔  1 ESLint Error \n')
    })

    it('logs the warning count in a yellow background', () => {
      colourLog.resultBlock({
        ...commonResult,
        warningCount: 1,
      })

      expect(chalk.bgYellow.black).toHaveBeenCalledTimes(1)
      expect(chalk.bgYellow.black).toHaveBeenCalledWith(' 1 ESLint Warning ')
      expect(mockedConsoleLog).toHaveBeenCalledTimes(1)
      expect(mockedConsoleLog).toHaveBeenCalledWith('🚧  1 ESLint Warning \n')
    })

    it('logs the both the error and warning counts if both are present', () => {
      colourLog.resultBlock({
        ...commonResult,
        errorCount: 2,
        warningCount: 3,
      })

      expect(chalk.bgRed.black).toHaveBeenCalledTimes(1)
      expect(chalk.bgRed.black).toHaveBeenCalledWith(' 2 ESLint Errors ')
      expect(chalk.bgYellow.black).toHaveBeenCalledTimes(1)
      expect(chalk.bgYellow.black).toHaveBeenCalledWith(' 3 ESLint Warnings ')
      expect(mockedConsoleLog).toHaveBeenCalledTimes(2)
      expect(mockedConsoleLog).toHaveBeenCalledWith('💔  2 ESLint Errors \n')
      expect(mockedConsoleLog).toHaveBeenCalledWith('🚧  3 ESLint Warnings \n')
    })

    it('logs a success message if there are no errors or warnings', () => {
      colourLog.resultBlock(commonResult)

      expect(chalk.bgGreen.black).toHaveBeenCalledTimes(1)
      expect(chalk.bgGreen.black).toHaveBeenCalledWith(' ESLint Success! ')
      expect(mockedConsoleLog).toHaveBeenCalledTimes(1)
      expect(mockedConsoleLog).toHaveBeenCalledWith('✅  ESLint Success! \n')
    })

  })

  describe('title', () => {

    it('logs the title in cyan', () => {
      colourLog.title('✈️ Lint Pilot ✈️')

      expect(chalk.cyan).toHaveBeenCalledTimes(1)
      expect(chalk.cyan).toHaveBeenCalledWith('✈️ Lint Pilot ✈️')
      expect(mockedConsoleLog).toHaveBeenCalledTimes(1)
      expect(mockedConsoleLog).toHaveBeenCalledWith('✈️ Lint Pilot ✈️')
    })

  })

})
