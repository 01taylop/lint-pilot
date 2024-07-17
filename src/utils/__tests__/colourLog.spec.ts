import chalk from 'chalk'
import spaceLog from 'space-log'

import { Linter, type ReportSummary } from '@Types'

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
  underline: jest.fn().mockImplementation(text => `_${text}_`),
  yellow: jest.fn().mockImplementation(text => text),
}))

jest.mock('space-log')

jest.useFakeTimers().setSystemTime(1718971200)

describe('colourLog', () => {

  const mockedConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {})

  const commonSummary: ReportSummary = {
    deprecatedRules: [],
    errorCount: 0,
    fileCount: 1,
    fixableErrorCount: 0,
    fixableWarningCount: 0,
    linter: Linter.ESLint,
    warningCount: 0,
  }

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

    it('logs additional debug information if there is an error', () => {
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

      expect(chalk.red).toHaveBeenCalledOnceWith('\nAn error occurred. Run with --debug for more information.')
      expect(mockedConsoleLog).toHaveBeenCalledTimes(3)
      expect(mockedConsoleLog).toHaveBeenNthCalledWith(1, '\nAn error occurred. Run with --debug for more information.')
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

  describe('results', () => {

    it('returns if there are no results', () => {
      colourLog.results({
        results: {},
        summary: commonSummary,
      })

      expect(mockedConsoleLog).not.toHaveBeenCalled()
    })

    it('logs the results', () => {
      const commonResult = {
        message: 'Foo',
        messageTheme: () => {},
        position: '1:1',
        positionTheme: () => {},
        rule: 'bar',
        ruleTheme: () => {},
        severity: 'X',
      }

      colourLog.results({
        results: {
          'CONTRIBUTING.md': [commonResult],
          'README.md': [commonResult, commonResult],
        },
        summary: commonSummary,
      })

      // Info
      expect(chalk.blue).toHaveBeenCalledOnceWith('\nLogging eslint results:')
      expect(mockedConsoleLog).toHaveBeenNthCalledWith(1, '\nLogging eslint results:')

      // File 1
      expect(mockedConsoleLog).toHaveBeenNthCalledWith(2)
      expect(chalk.underline).toHaveBeenNthCalledWith(1, `${process.cwd()}/CONTRIBUTING.md`)
      expect(mockedConsoleLog).toHaveBeenNthCalledWith(3, `_${process.cwd()}/CONTRIBUTING.md_`)
      expect(spaceLog).toHaveBeenNthCalledWith(1, {
        columnKeys: ['severity', 'position', 'message', 'rule'],
        spaceSize: 2,
      }, [commonResult])

      // File 2
      expect(mockedConsoleLog).toHaveBeenNthCalledWith(4)
      expect(chalk.underline).toHaveBeenNthCalledWith(2, `${process.cwd()}/README.md`)
      expect(mockedConsoleLog).toHaveBeenNthCalledWith(5, `_${process.cwd()}/README.md_`)
      expect(spaceLog).toHaveBeenNthCalledWith(2, {
        columnKeys: ['severity', 'position', 'message', 'rule'],
        spaceSize: 2,
      }, [commonResult, commonResult])

      // Log Count
      expect(mockedConsoleLog).toHaveBeenCalledTimes(5)
      expect(chalk.underline).toHaveBeenCalledTimes(2)
      expect(spaceLog).toHaveBeenCalledTimes(2)
    })

  })

  describe('summary', () => {

    const startTime = new Date().getTime()
    jest.advanceTimersByTime(1000)

    const expectResult = () => {
      expect(chalk.cyan).toHaveBeenCalledWith('Finished eslint')
      expect(chalk.yellow).toHaveBeenCalledWith('[1 file, 1000ms]')
      expect(mockedConsoleLog).toHaveBeenCalledTimes(2)
      expect(mockedConsoleLog).toHaveBeenNthCalledWith(1, '\nFinished eslint', '[1 file, 1000ms]')
    }

    it('logs the finished lint message along with the file count and duration (single file)', () => {
      colourLog.summary(commonSummary, startTime)

      expect(chalk.cyan).toHaveBeenCalledOnceWith('Finished eslint')
      expect(chalk.yellow).toHaveBeenCalledOnceWith('[1 file, 1000ms]')
      expect(mockedConsoleLog).toHaveBeenCalledOnceWith('\nFinished eslint', '[1 file, 1000ms]')
    })

    it('logs the finished lint message along with the file count and duration (multiple files)', () => {
      colourLog.summary({
        ...commonSummary,
        fileCount: 7,
      }, startTime)

      expect(chalk.cyan).toHaveBeenCalledOnceWith('Finished eslint')
      expect(chalk.yellow).toHaveBeenCalledOnceWith('[7 files, 1000ms]')
      expect(mockedConsoleLog).toHaveBeenCalledOnceWith('\nFinished eslint', '[7 files, 1000ms]')
    })

    it('logs the error count in red (single error)', () => {
      colourLog.summary({
        ...commonSummary,
        errorCount: 1,
      }, startTime)

      expectResult()
      expect(chalk.red).toHaveBeenCalledWith('  1 error')
      expect(mockedConsoleLog).toHaveBeenNthCalledWith(2, '  1 error')
    })

    it('logs the error count in red (multiple errors)', () => {
      colourLog.summary({
        ...commonSummary,
        errorCount: 2,
      }, startTime)

      expectResult()
      expect(chalk.red).toHaveBeenCalledWith('  2 errors')
      expect(mockedConsoleLog).toHaveBeenNthCalledWith(2, '  2 errors')
    })

    it('logs the error count in red with the fixable error count in dim', () => {
      colourLog.summary({
        ...commonSummary,
        errorCount: 3,
        fixableErrorCount: 2,
      }, startTime)

      expectResult()
      expect(chalk.red).toHaveBeenCalledWith('  3 errors')
      expect(chalk.dim).toHaveBeenCalledWith(' (2 fixable)')
      expect(mockedConsoleLog).toHaveBeenNthCalledWith(2, '  3 errors (2 fixable)')
    })

    it('logs the warning count in yellow (single warning)', () => {
      colourLog.summary({
        ...commonSummary,
        warningCount: 1,
      }, startTime)

      expectResult()
      expect(chalk.yellow).toHaveBeenCalledWith('  1 warning')
      expect(mockedConsoleLog).toHaveBeenNthCalledWith(2, '  1 warning')
    })

    it('logs the warning count in yellow (multiple warnings)', () => {
      colourLog.summary({
        ...commonSummary,
        warningCount: 5,
      }, startTime)

      expectResult()
      expect(chalk.yellow).toHaveBeenCalledWith('  5 warnings')
      expect(mockedConsoleLog).toHaveBeenNthCalledWith(2, '  5 warnings')
    })

    it('logs the warning count in yellow with the fixable warning count in dim', () => {
      colourLog.summary({
        ...commonSummary,
        warningCount: 6,
        fixableWarningCount: 3,
      }, startTime)

      expectResult()
      expect(chalk.yellow).toHaveBeenCalledWith('  6 warnings')
      expect(chalk.dim).toHaveBeenCalledWith(' (3 fixable)')
      expect(mockedConsoleLog).toHaveBeenNthCalledWith(2, '  6 warnings (3 fixable)')
    })

    it('logs the deprecated rule count in magenta and the list in dim (single deprecation)', () => {
      colourLog.summary({
        ...commonSummary,
        deprecatedRules: ['foo'],
      }, startTime)

      expectResult()
      expect(chalk.magenta).toHaveBeenCalledWith('  1 deprecation')
      expect(chalk.dim).toHaveBeenCalledWith(' [foo]')
      expect(mockedConsoleLog).toHaveBeenNthCalledWith(2, '  1 deprecation [foo]')
    })

    it('logs the deprecated rule count in magenta and the list alphabetised in dim (multiple deprecations)', () => {
      colourLog.summary({
        ...commonSummary,
        deprecatedRules: ['foo', 'bar', 'baz'],
      }, startTime)

      expectResult()
      expect(chalk.magenta).toHaveBeenCalledWith('  3 deprecations')
      expect(chalk.dim).toHaveBeenCalledWith(' [bar, baz, foo]')
      expect(mockedConsoleLog).toHaveBeenNthCalledWith(2, '  3 deprecations [bar, baz, foo]')
    })

    it('logs everything together', () => {
      colourLog.summary({
        ...commonSummary,
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

  describe('summaryBlock', () => {

    it('logs the error count in a red background', () => {
      colourLog.summaryBlock({
        ...commonSummary,
        errorCount: 1,
      })

      expect(chalk.bgRed.black).toHaveBeenCalledOnceWith(' 1 ESLint Error ')
      expect(mockedConsoleLog).toHaveBeenCalledOnceWith('\n🚨  1 ESLint Error ')
    })

    it('logs the warning count in a yellow background', () => {
      colourLog.summaryBlock({
        ...commonSummary,
        warningCount: 1,
      })

      expect(chalk.bgYellow.black).toHaveBeenCalledOnceWith(' 1 ESLint Warning ')
      expect(mockedConsoleLog).toHaveBeenCalledOnceWith('\n🚧  1 ESLint Warning ')
    })

    it('logs the both the error and warning counts if both are present', () => {
      colourLog.summaryBlock({
        ...commonSummary,
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
      colourLog.summaryBlock(commonSummary)

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
