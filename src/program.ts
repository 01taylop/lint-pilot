import { Command } from 'commander'
import { ProcessSupervisor } from 'process-supervisor'

import { Linter } from '@Types/lint'
import { clearCacheDirectory } from '@Utils/cache'
import colourLog from '@Utils/colour-log'
import { logResults, logSummary, logSummaryBlock } from '@Utils/reporting'
import { notifyResults } from '@Utils/notifier'
import { clearTerminal } from '@Utils/terminal'

import type { RunLinter, RunLintPilot } from '@Types'
import type { LintReport } from '@Types/lint'
import { getFilePatterns } from '@Utils/file-patterns'
import { sourceFiles } from '@Utils/source-files'
import { EVENTS, fileWatcherEvents, watchFiles } from '@Utils/watch-files'

import { description, name, version } from '../package.json'
import linters from './linters/index'

import type { FileChangedEventPayload } from '@Utils/watch-files'

interface CreateProgramOptions {
  supervisor: ProcessSupervisor
}

const runLinter = async ({ cache, eslintUseLegacyConfig, filePatterns, fix, linter }: RunLinter) => {
  const startTime = new Date().getTime()
  colourLog.info(`Running ${linter.toLowerCase()}...`)

  const files = await sourceFiles(filePatterns, linter)

  const report: LintReport = await linters[linter].lintFiles({
    cache,
    eslintUseLegacyConfig,
    files,
    fix,
  })

  logSummary(report.summary, startTime)

  return report
}

const runLintPilot = ({ cache, eslintUseLegacyConfig, filePatterns, fix, title, watch }: RunLintPilot) => {
  const commonArgs = {
    cache,
    fix,
    filePatterns,
  }

  Promise.all([
    runLinter({
      ...commonArgs,
      eslintUseLegacyConfig,
      linter: Linter.ESLint,
    }),
    runLinter({
      ...commonArgs,
      linter: Linter.Markdownlint,
    }),
    runLinter({
      ...commonArgs,
      linter: Linter.Stylelint,
    }),
  ]).then((reports) => {
    reports.forEach(report => {
      logResults(report)
    })

    reports.forEach(({ summary }) => {
      logSummaryBlock(summary)
    })

    const exitCode = notifyResults(reports, title)

    if (watch) {
      colourLog.info('Watching for changes...')
    } else {
      process.exit(exitCode)
    }
  })
}

const createProgram = ({ supervisor }: CreateProgramOptions): Command => {
  const program = new Command()

  program
    .name(name)
    .description(description)
    .version(version)
    .addHelpText('beforeAll', '\n✈️ Lint Pilot ✈️\n')
    .showHelpAfterError('\n💡 Run `lint-pilot --help` for more information.\n')

    .option('-e, --emoji <string>', 'customise the emoji displayed when running lint-pilot', '✈️')
    .option('-t, --title <string>', 'customise the title displayed when running lint-pilot', 'Lint Pilot')

    .option('--fix', 'automatically fix problems', false)
    .option('-w, --watch', 'watch for file changes and re-run the linters', false)

    .option('--cache', 'cache linting results', false)
    .option('--clearCache', 'clear the cache', false)

    .option('--ignore-dirs <directories...>', 'directories to ignore globally')
    .option('--ignore-patterns <patterns...>', 'file patterns to ignore globally')
    .option('--eslint-include <patterns...>', 'file patterns to include for ESLint')

    .option('--debug', 'output additional debug information including the list of files being linted', false)
    .option('--eslint-use-legacy-config', 'set to true to use the legacy ESLint configuration', false)

    .action(({ cache, clearCache, debug, emoji, eslintInclude, eslintUseLegacyConfig, fix, ignoreDirs, ignorePatterns, title, watch }) => {
      clearTerminal()
      colourLog.title(`${emoji} ${title} ${emoji}`)
      console.log()

      if (clearCache) {
        clearCacheDirectory()
      }

      global.debug = debug

      const filePatterns = getFilePatterns({
        eslintInclude,
        ignoreDirs,
        ignorePatterns,
      })

      const lintPilotOptions = {
        cache,
        eslintUseLegacyConfig,
        filePatterns,
        fix,
        title,
        watch,
      }

      runLintPilot(lintPilotOptions)

      if (watch) {
        supervisor.register('file-watcher', {
          start: () => watchFiles(filePatterns),
          stop: async watcher => {
            await watcher.close()
          },
        })
        supervisor.start('file-watcher')

        fileWatcherEvents.on(EVENTS.FILE_CHANGED, ({ message }: FileChangedEventPayload) => {
          clearTerminal()
          colourLog.info(message)
          console.log()
          runLintPilot(lintPilotOptions)
        })
      }
    })

  return program
}

export {
  createProgram,
}
