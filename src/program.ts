import { Command } from 'commander'
import { ProcessSupervisor } from 'process-supervisor'

import { Linter } from '@Types/lint'
import { clearCacheDirectory } from '@Utils/cache'
import colourLog from '@Utils/colour-log'
import { logResults, logSummaryBlock } from '@Utils/reporting'
import { notifyResults } from '@Utils/notifier'
import { clearTerminal } from '@Utils/terminal'

import type { RunLintPilot } from '@Types'
import { getFilePatterns } from '@Utils/file-patterns'
import { EVENTS, fileWatcherEvents, watchFiles } from '@Utils/watch-files'

import { description, name, version } from '../package.json'
import { executeLinter } from './linters'

import type { FileChangedEventPayload } from '@Utils/watch-files'

interface CreateProgramOptions {
  supervisor: ProcessSupervisor
}

const runLintPilot = ({ cache, eslintUseLegacyConfig, filePatterns, fix, title, watch }: RunLintPilot) => {
  const commonArgs = {
    cache,
    eslintUseLegacyConfig,
    fix,
    filePatterns,
  }

  Promise.all([
    executeLinter(Linter.ESLint, commonArgs),
    executeLinter(Linter.Markdownlint, commonArgs),
    executeLinter(Linter.Stylelint, commonArgs),
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

    // Core Behaviour Options
    .option('--fix', 'automatically fix problems', false)
    .option('-w, --watch', 'watch for file changes and re-run the linters', false)

    // Customisation Options
    .option('-e, --emoji <string>', 'customise the emoji displayed when running lint-pilot', '✈️')
    .option('-t, --title <string>', 'customise the title displayed when running lint-pilot', 'Lint Pilot')

    // Caching Options
    .option('--cache', 'cache linting results', false)
    .option('--clear-cache', 'clear the cache', false)

    // Ignore and Include Options
    .option('--ignore-dirs <directories...>', 'define directories to ignore')
    .option('--ignore-patterns <patterns...>', 'define file patterns to ignore')
    .option('--eslint-include <patterns...>', 'define additional file patterns for ESLint')

    // Debugging and Legacy Options
    .option('--debug', 'output additional debug information', false)
    .option('--eslint-use-legacy-config', 'use legacy ESLint config', false)

    .action(({ cache, clearCache, debug, emoji, eslintInclude, eslintUseLegacyConfig, fix, ignoreDirs, ignorePatterns, title, watch }) => {
      global.debug = debug

      clearTerminal()
      colourLog.title(`${emoji} ${title}\n`)

      if (clearCache) {
        clearCacheDirectory()
      }

      const filePatterns = getFilePatterns({
        eslintInclude,
        ignoreDirs,
        ignorePatterns,
      })

      const lintOptions = {
        cache,
        eslintUseLegacyConfig,
        filePatterns,
        fix,
        title,
        watch,
      }

      runLintPilot(lintOptions)

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
          runLintPilot(lintOptions)
        })
      }
    })

  return program
}

export {
  createProgram,
}
