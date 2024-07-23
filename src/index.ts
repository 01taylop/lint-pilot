#!/usr/bin/env node
import { Command } from 'commander'

import { Events, Linter } from '@Types'
import colourLog from '@Utils/colourLog'
import { notifyResults } from '@Utils/notifier'
import { clearTerminal } from '@Utils/terminal'

import type { LintReport, RunLinter, RunLintPilot } from '@Types'

import getFilePatterns from './filePatterns'
import linters from './linters/index'
import sourceFiles from './sourceFiles'
import { fileChangeEvent, watchFiles } from './watchFiles'

const program = new Command()

program
  .name('lint-pilot')
  .description('Lint Pilot: Your co-pilot for maintaining high code quality with seamless ESLint, Stylelint, and MarkdownLint integration.')
  .version('0.0.1')
  .addHelpText('beforeAll', '\n✈️ Lint Pilot ✈️\n')
  .showHelpAfterError('\n💡 Run `lint-pilot --help` for more information.\n')

const runLinter = async ({ filePattern, fix, linter, ignore }: RunLinter) => {
  const startTime = new Date().getTime()
  colourLog.info(`Running ${linter.toLowerCase()}...`)

  const files = await sourceFiles({
    filePattern,
    ignore,
    linter,
  })

  const report: LintReport = await linters[linter].lintFiles({
    files,
    fix,
  })

  colourLog.summary(report.summary, startTime)

  return report
}

const runLintPilot = ({ filePatterns, fix, title, watch }: RunLintPilot) => {
  Promise.all([
    runLinter({
      filePattern: filePatterns.includePatterns[Linter.ESLint],
      fix,
      ignore: filePatterns.ignorePatterns,
      linter: Linter.ESLint,
    }),
    runLinter({
      filePattern: filePatterns.includePatterns[Linter.Markdownlint],
      fix,
      ignore: filePatterns.ignorePatterns,
      linter: Linter.Markdownlint,
    }),
    runLinter({
      filePattern: filePatterns.includePatterns[Linter.Stylelint],
      fix,
      ignore: filePatterns.ignorePatterns,
      linter: Linter.Stylelint,
    }),
  ]).then((reports) => {
    reports.forEach(report => {
      colourLog.results(report)
    })

    reports.forEach(({ summary }) => {
      colourLog.summaryBlock(summary)
    })

    const exitCode = notifyResults(reports, title)

    if (watch) {
      colourLog.info('Watching for changes...')
    } else {
      process.exit(exitCode)
    }
  })
}

program
  .option('-e, --emoji <string>', 'customise the emoji displayed when running lint-pilot', '✈️')
  .option('-t, --title <string>', 'customise the title displayed when running lint-pilot', 'Lint Pilot')

  .option('--fix', 'automatically fix problems', false)
  .option('-w, --watch', 'watch for file changes and re-run the linters', false)

  .option('--ignore-dirs <directories...>', 'Directories to ignore globally')
  .option('--ignore-patterns <patterns...>', 'File patterns to ignore globally')
  .option('--eslint-include <patterns...>', 'File patterns to include for ESLint')

  .option('--debug', 'output additional debug information including the list of files being linted', false)
  .action(({ debug, emoji, eslintInclude, fix, ignoreDirs, ignorePatterns, title, watch }) => {
    clearTerminal()
    colourLog.title(`${emoji} ${title} ${emoji}`)
    console.log()

    global.debug = debug

    const filePatterns = getFilePatterns({
      eslintInclude,
      ignoreDirs,
      ignorePatterns,
    })
    runLintPilot({ filePatterns, fix, title, watch })

    if (watch) {
      watchFiles({
        filePatterns: Object.values(filePatterns.includePatterns).flat(),
        ignorePatterns: filePatterns.ignorePatterns,
      })

      fileChangeEvent.on(Events.FILE_CHANGED, ({ message }) => {
        clearTerminal()
        colourLog.info(message)
        console.log()
        runLintPilot({ filePatterns, fix, title, watch })
      })
    }
  })

process.on('exit', () => {
  console.log()
})

program.parse(process.argv)
