import chalk from 'chalk'

import { Linter, type ProcessedResult } from '@Types'

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
  red: jest.fn().mockImplementation(text => text),
  yellow: jest.fn().mockImplementation(text => text),
}))

jest.useFakeTimers().setSystemTime(1718971200)

describe('colourLog', () => {

  const mockedConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {})

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

      expect(chalk.red).toHaveBeenCalledOnceWith('An error occurred')
      expect(mockedConsoleLog).toHaveBeenCalledOnceWith('\nAn error occurred')
    })

    it('logs the text in red but does not log the error if global.debug is false', () => {
      global.debug = false

      colourLog.error('An error occurred', error)

      expect(chalk.red).toHaveBeenCalledOnceWith('An error occurred')
      expect(mockedConsoleLog).toHaveBeenCalledTimes(1)
      expect(mockedConsoleLog).toHaveBeenNthCalledWith(1, '\nAn error occurred')
    })

    it('logs the text in red and logs the error if global.debug is true', () => {
      global.debug = true

      colourLog.error('An error occurred', error)

      expect(chalk.red).toHaveBeenCalledOnceWith('An error occurred')
      expect(mockedConsoleLog).toHaveBeenCalledTimes(2)
      expect(mockedConsoleLog).toHaveBeenNthCalledWith(1, '\nAn error occurred')
      expect(mockedConsoleLog).toHaveBeenNthCalledWith(2, error)
    })

  })

  describe('info', () => {

    it('logs the text in blue', () => {
      colourLog.info('Starting lint...')

      expect(chalk.blue).toHaveBeenCalledOnceWith('Starting lint...')
      expect(mockedConsoleLog).toHaveBeenCalledOnceWith('Starting lint...')
    })

  })

  describe('result', () => {

    const commonResult: ProcessedResult = {
      deprecatedRules: [],
      errorCount: 0,
      fileCount: 1,
      fixableErrorCount: 0,
      fixableWarningCount: 0,
      linter: Linter.ESLint,
      warningCount: 0,
    }

    const startTime = new Date().getTime()
    jest.advanceTimersByTime(1000)

    const expectResult = () => {
      expect(chalk.cyan).toHaveBeenCalledWith('Finished eslint')
      expect(chalk.yellow).toHaveBeenCalledWith('[1 file, 1000ms]')
      expect(mockedConsoleLog).toHaveBeenCalledTimes(2)
      expect(mockedConsoleLog).toHaveBeenNthCalledWith(1, '\nFinished eslint', '[1 file, 1000ms]')
    }

    it('logs the finished lint message along with the file count and duration (single file)', () => {
      colourLog.result(commonResult, startTime)

      expect(chalk.cyan).toHaveBeenCalledOnceWith('Finished eslint')
      expect(chalk.yellow).toHaveBeenCalledOnceWith('[1 file, 1000ms]')
      expect(mockedConsoleLog).toHaveBeenCalledOnceWith('\nFinished eslint', '[1 file, 1000ms]')
    })

    it('logs the finished lint message along with the file count and duration (multiple files)', () => {
      colourLog.result({
        ...commonResult,
        fileCount: 7,
      }, startTime)

      expect(chalk.cyan).toHaveBeenCalledOnceWith('Finished eslint')
      expect(chalk.yellow).toHaveBeenCalledOnceWith('[7 files, 1000ms]')
      expect(mockedConsoleLog).toHaveBeenCalledOnceWith('\nFinished eslint', '[7 files, 1000ms]')
    })

    it('logs the error count in red (single error)', () => {
      colourLog.result({
        ...commonResult,
        errorCount: 1,
      }, startTime)

      expectResult()
      expect(chalk.red).toHaveBeenCalledWith('  1 error')
      expect(mockedConsoleLog).toHaveBeenNthCalledWith(2, '  1 error')
    })

    it('logs the error count in red (multiple errors)', () => {
      colourLog.result({
        ...commonResult,
        errorCount: 2,
      }, startTime)

      expectResult()
      expect(chalk.red).toHaveBeenCalledWith('  2 errors')
      expect(mockedConsoleLog).toHaveBeenNthCalledWith(2, '  2 errors')
    })

    it('logs the error count in red with the fixable error count in dim', () => {
      colourLog.result({
        ...commonResult,
        errorCount: 3,
        fixableErrorCount: 2,
      }, startTime)

      expectResult()
      expect(chalk.red).toHaveBeenCalledWith('  3 errors')
      expect(chalk.dim).toHaveBeenCalledWith(' (2 fixable)')
      expect(mockedConsoleLog).toHaveBeenNthCalledWith(2, '  3 errors (2 fixable)')
    })

    it('logs the warning count in yellow (single warning)', () => {
      colourLog.result({
        ...commonResult,
        warningCount: 1,
      }, startTime)

      expectResult()
      expect(chalk.yellow).toHaveBeenCalledWith('  1 warning')
      expect(mockedConsoleLog).toHaveBeenNthCalledWith(2, '  1 warning')
    })

    it('logs the warning count in yellow (multiple warnings)', () => {
      colourLog.result({
        ...commonResult,
        warningCount: 5,
      }, startTime)

      expectResult()
      expect(chalk.yellow).toHaveBeenCalledWith('  5 warnings')
      expect(mockedConsoleLog).toHaveBeenNthCalledWith(2, '  5 warnings')
    })

    it('logs the warning count in yellow with the fixable warning count in dim', () => {
      colourLog.result({
        ...commonResult,
        warningCount: 6,
        fixableWarningCount: 3,
      }, startTime)

      expectResult()
      expect(chalk.yellow).toHaveBeenCalledWith('  6 warnings')
      expect(chalk.dim).toHaveBeenCalledWith(' (3 fixable)')
      expect(mockedConsoleLog).toHaveBeenNthCalledWith(2, '  6 warnings (3 fixable)')
    })

    it('logs the deprecated rule count in magenta and the list in dim (single deprecation)', () => {
      colourLog.result({
        ...commonResult,
        deprecatedRules: ['foo'],
      }, startTime)

      expectResult()
      expect(chalk.magenta).toHaveBeenCalledWith('  1 deprecation')
      expect(chalk.dim).toHaveBeenCalledWith(' [foo]')
      expect(mockedConsoleLog).toHaveBeenNthCalledWith(2, '  1 deprecation [foo]')
    })

    it('logs the deprecated rule count in magenta and the list alphabetised in dim (multiple deprecations)', () => {
      colourLog.result({
        ...commonResult,
        deprecatedRules: ['foo', 'bar', 'baz'],
      }, startTime)

      expectResult()
      expect(chalk.magenta).toHaveBeenCalledWith('  3 deprecations')
      expect(chalk.dim).toHaveBeenCalledWith(' [bar, baz, foo]')
      expect(mockedConsoleLog).toHaveBeenNthCalledWith(2, '  3 deprecations [bar, baz, foo]')
    })

    it('logs everything together', () => {
      colourLog.result({
        ...commonResult,
        deprecatedRules: ['foo', 'bar', 'baz'],
        errorCount: 2,
        fixableErrorCount: 1,
        warningCount: 3,
        fixableWarningCount: 2,
      }, startTime)

      expectResult()
      expect(chalk.red).toHaveBeenCalledWith('  2 errors')
      expect(chalk.dim).toHaveBeenCalledWith(' (1 fixable)')
      expect(chalk.yellow).toHaveBeenCalledWith('  3 warnings')
      expect(chalk.dim).toHaveBeenCalledWith(' (2 fixable)')
      expect(chalk.magenta).toHaveBeenCalledWith('  3 deprecations')
      expect(chalk.dim).toHaveBeenCalledWith(' [bar, baz, foo]')
      expect(mockedConsoleLog).toHaveBeenNthCalledWith(2, '  2 errors (1 fixable)\n  3 warnings (2 fixable)\n  3 deprecations [bar, baz, foo]')
    })

  })

  describe('resultBlock', () => {

    const commonResult: ProcessedResult = {
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

      expect(chalk.bgRed.black).toHaveBeenCalledOnceWith(' 1 ESLint Error ')
      expect(mockedConsoleLog).toHaveBeenCalledOnceWith('\n🚨  1 ESLint Error ')
    })

    it('logs the warning count in a yellow background', () => {
      colourLog.resultBlock({
        ...commonResult,
        warningCount: 1,
      })

      expect(chalk.bgYellow.black).toHaveBeenCalledOnceWith(' 1 ESLint Warning ')
      expect(mockedConsoleLog).toHaveBeenCalledOnceWith('\n🚧  1 ESLint Warning ')
    })

    it('logs the both the error and warning counts if both are present', () => {
      colourLog.resultBlock({
        ...commonResult,
        errorCount: 2,
        warningCount: 3,
      })

      expect(chalk.bgRed.black).toHaveBeenCalledOnceWith(' 2 ESLint Errors ')
      expect(chalk.bgYellow.black).toHaveBeenCalledOnceWith(' 3 ESLint Warnings ')
      expect(mockedConsoleLog).toHaveBeenCalledTimes(2)
      expect(mockedConsoleLog).toHaveBeenNthCalledWith(1, '\n🚨  2 ESLint Errors ')
      expect(mockedConsoleLog).toHaveBeenNthCalledWith(2, '\n🚧  3 ESLint Warnings ')
    })

    it('logs a success message if there are no errors or warnings', () => {
      colourLog.resultBlock(commonResult)

      expect(chalk.bgGreen.black).toHaveBeenCalledOnceWith(' ESLint Success! ')
      expect(mockedConsoleLog).toHaveBeenCalledOnceWith('\n✅  ESLint Success! ')
    })

  })

  describe('title', () => {

    it('logs the title in cyan', () => {
      colourLog.title('✈️ Lint Pilot ✈️')

      expect(chalk.cyan).toHaveBeenCalledOnceWith('✈️ Lint Pilot ✈️')
      expect(mockedConsoleLog).toHaveBeenCalledOnceWith('✈️ Lint Pilot ✈️')
    })

  })

})
