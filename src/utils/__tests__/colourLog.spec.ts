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
  red: jest.fn().mockImplementation(text => text),
  yellow: jest.fn().mockImplementation(text => text),
}))

jest.useFakeTimers().setSystemTime(1718971200)

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

  describe('result', () => {

    const commonResult = {
      deprecatedRules: [],
      errorCount: 0,
      fileCount: 1,
      fixableErrorCount: 0,
      fixableWarningCount: 0,
      linter: Linter.ESLint,
      warningCount: 0,
    }

    const now = new Date().getTime()

    const expectResult = () => {
      expect(chalk.cyan).toHaveBeenCalledWith('Finished eslint')
      expect(chalk.yellow).toHaveBeenCalledWith(`[1 file, 1000ms]`)
      expect(mockedConsoleLog).toHaveBeenCalledTimes(3)
      expect(mockedConsoleLog).toHaveBeenNthCalledWith(1)
      expect(mockedConsoleLog).toHaveBeenNthCalledWith(2, 'Finished eslint', `[1 file, 1000ms]`)
    }

    it('logs the finished lint message along with the file count and duration (single file)', () => {
      jest.advanceTimersByTime(1000)
      colourLog.result(commonResult, now)

      expect(chalk.cyan).toHaveBeenCalledTimes(1)
      expect(chalk.cyan).toHaveBeenCalledWith('Finished eslint')
      expect(chalk.yellow).toHaveBeenCalledTimes(1)
      expect(chalk.yellow).toHaveBeenCalledWith('[1 file, 1000ms]')
      expect(mockedConsoleLog).toHaveBeenCalledTimes(2)
      expect(mockedConsoleLog).toHaveBeenNthCalledWith(1)
      expect(mockedConsoleLog).toHaveBeenNthCalledWith(2, 'Finished eslint', '[1 file, 1000ms]')
    })

    it('logs the finished lint message along with the file count and duration (multiple files)', () => {
      colourLog.result({
        ...commonResult,
        fileCount: 7,
      }, now)

      expect(chalk.cyan).toHaveBeenCalledTimes(1)
      expect(chalk.cyan).toHaveBeenCalledWith('Finished eslint')
      expect(chalk.yellow).toHaveBeenCalledTimes(1)
      expect(chalk.yellow).toHaveBeenCalledWith('[7 files, 1000ms]')
      expect(mockedConsoleLog).toHaveBeenCalledTimes(2)
      expect(mockedConsoleLog).toHaveBeenNthCalledWith(1)
      expect(mockedConsoleLog).toHaveBeenNthCalledWith(2, 'Finished eslint', '[7 files, 1000ms]')
    })

    it('logs the error count in red (single error)', () => {
      colourLog.result({
        ...commonResult,
        errorCount: 1,
      }, now)

      expectResult()
      expect(chalk.red).toHaveBeenCalledWith('  1 error')
      expect(mockedConsoleLog).toHaveBeenNthCalledWith(3, '  1 error')
    })

    it('logs the error count in red (multiple errors)', () => {
      colourLog.result({
        ...commonResult,
        errorCount: 2,
      }, now)

      expectResult()
      expect(chalk.red).toHaveBeenCalledWith('  2 errors')
      expect(mockedConsoleLog).toHaveBeenNthCalledWith(3, '  2 errors')
    })

    it('logs the error count in red with the fixable error count in dim', () => {
      colourLog.result({
        ...commonResult,
        errorCount: 3,
        fixableErrorCount: 2,
      }, now)

      expectResult()
      expect(chalk.red).toHaveBeenCalledWith('  3 errors')
      expect(chalk.dim).toHaveBeenCalledWith(' (2 fixable)')
      expect(mockedConsoleLog).toHaveBeenNthCalledWith(3, '  3 errors (2 fixable)')
    })

    it('logs the warning count in yellow (single warning)', () => {
      colourLog.result({
        ...commonResult,
        warningCount: 1,
      }, now)

      expectResult()
      expect(chalk.yellow).toHaveBeenCalledWith('  1 warning')
      expect(mockedConsoleLog).toHaveBeenNthCalledWith(3, '  1 warning')
    })

    it('logs the warning count in yellow (multiple warnings)', () => {
      colourLog.result({
        ...commonResult,
        warningCount: 5,
      }, now)

      expectResult()
      expect(chalk.yellow).toHaveBeenCalledWith('  5 warnings')
      expect(mockedConsoleLog).toHaveBeenNthCalledWith(3, '  5 warnings')
    })

    it('logs the warning count in yellow with the fixable warning count in dim', () => {
      colourLog.result({
        ...commonResult,
        warningCount: 6,
        fixableWarningCount: 3,
      }, now)

      expectResult()
      expect(chalk.yellow).toHaveBeenCalledWith('  6 warnings')
      expect(chalk.dim).toHaveBeenCalledWith(' (3 fixable)')
      expect(mockedConsoleLog).toHaveBeenNthCalledWith(3, '  6 warnings (3 fixable)')
    })

    it('logs the deprecated rules which are being used', () => {
      colourLog.result({
        ...commonResult,
        deprecatedRules: ['foo', 'bar', 'baz'],
      }, now)

      expectResult()
      expect(chalk.magenta).toHaveBeenCalledWith('  3 deprecations')
      expect(chalk.dim).toHaveBeenCalledWith(' [bar, baz, foo]')
      expect(mockedConsoleLog).toHaveBeenNthCalledWith(3, '  3 deprecations [bar, baz, foo]')
    })

    it('logs everything together', () => {
      colourLog.result({
        ...commonResult,
        deprecatedRules: ['foo', 'bar', 'baz'],
        errorCount: 2,
        fixableErrorCount: 1,
        warningCount: 3,
        fixableWarningCount: 2,
      }, now)

      expectResult()
      expect(chalk.red).toHaveBeenCalledWith('  2 errors')
      expect(chalk.dim).toHaveBeenCalledWith(' (1 fixable)')
      expect(chalk.yellow).toHaveBeenCalledWith('  3 warnings')
      expect(chalk.dim).toHaveBeenCalledWith(' (2 fixable)')
      expect(chalk.magenta).toHaveBeenCalledWith('  3 deprecations')
      expect(chalk.dim).toHaveBeenCalledWith(' [bar, baz, foo]')
      expect(mockedConsoleLog).toHaveBeenNthCalledWith(3, '  2 errors (1 fixable)\n  3 warnings (2 fixable)\n  3 deprecations [bar, baz, foo]')
    })
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
