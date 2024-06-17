#!/usr/bin/env node
import { Command } from 'commander'

import { Events, Linter, type LinterResult } from '@Types'
import colourLog from '@Utils/colourLog'
import { notifyResults } from '@Utils/notifier'
import { clearTerminal } from '@Utils/terminal'

import linters from './linters/index'
import sourceFiles from './sourceFiles'
import { fileChangeEvent, watchFiles } from './watchFiles'

const program = new Command()

program
  .name('lint-pilot')
  .description('Lint Pilot: Your co-pilot for maintaining high code quality with seamless ESLint, Stylelint, and MarkdownLint integration.')
  .version('0.0.1')

interface RunLinter {
  debug: boolean
  filePattern: string
  linter: Linter
}

interface RunLintPilot {
  debug: boolean
  title: string
  watch: boolean
}

const runLinter = async ({ debug, filePattern, linter }: RunLinter) => {
  // TODO: Handle case where no files are sourced
  const startTime = new Date().getTime()
  colourLog.info(`Running ${linter.toLowerCase()}...`)

  const files = await sourceFiles({
    debug,
    filePattern,
    ignore: '**/+(coverage|node_modules)/**',
    linter,
  })

  const result: LinterResult = await linters[linter].lintFiles(files)

  colourLog.result(result.processedResult, startTime)

  return result
}

const runLintPilot = ({ debug, title, watch }: RunLintPilot) => {
  Promise.all([
    runLinter({
      debug,
      filePattern: '**/*.{cjs,js,jsx,mjs,ts,tsx}',
      linter: Linter.ESLint,
    }),
    runLinter({
      debug,
      filePattern: '**/*.{md,mdx}',
      linter: Linter.Markdownlint,
    }),
    runLinter({
      debug,
      filePattern: '**/*.{css,scss,less,sass,styl,stylus}',
      linter: Linter.Stylelint,
    }),
  ]).then((results) => {
    console.log()

    results.forEach(({ processedResult }) => {
      colourLog.resultBlock(processedResult)
    })

    const exitCode = notifyResults(results, title)

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
  .option('-w, --watch', 'watch for file changes and re-run the linters', false)
  .option('--debug', 'output additional debug information including the list of files being linted', false)
  .action(({ debug, emoji, title, watch }) => {
    clearTerminal()
    colourLog.title(`${emoji} ${title} ${emoji}`)
    console.log()

    runLintPilot({ debug, title, watch })

    if (watch) {
      watchFiles({
        filePatterns: [
          '**/*.{cjs,js,jsx,mjs,ts,tsx}',
          '**/*.{md,mdx}',
          '**/*.{css,scss,less,sass,styl,stylus}',
        ],
        ignorePatterns: ['**/+(coverage|node_modules)/**'],
      })

      fileChangeEvent.on(Events.FILE_CHANGED, path => {
        clearTerminal()
        colourLog.info(`File \`${path}\` has been changed.\n`)
        runLintPilot({ debug, title, watch })
      })
    }
  })

program.parse(process.argv)
