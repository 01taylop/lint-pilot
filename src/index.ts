#!/usr/bin/env node
import chalk from 'chalk'
import { Command } from 'commander'
import { spaceLog } from 'space-log'

import { Events, Linter, type LinterResult, type RunLinter, type RunLintPilot } from '@Types'
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
  .addHelpText('beforeAll', '\n✈️ Lint Pilot ✈️\n')
  .showHelpAfterError('\n💡 Run `lint-pilot --help` for more information.\n')

const runLinter = async ({ filePattern, linter }: RunLinter) => {
  const startTime = new Date().getTime()
  colourLog.info(`Running ${linter.toLowerCase()}...`)

  const files = await sourceFiles({
    filePattern,
    ignore: '**/+(coverage|node_modules)/**',
    linter,
  })

  const result: LinterResult = await linters[linter].lintFiles(files)

  colourLog.result(result.summary, startTime)

  return result
}

const runLintPilot = ({ title, watch }: RunLintPilot) => {
  Promise.all([
    runLinter({
      filePattern: '**/*.{cjs,js,jsx,mjs,ts,tsx}',
      linter: Linter.ESLint,
    }),
    runLinter({
      filePattern: '**/*.{md,mdx}',
      linter: Linter.Markdownlint,
    }),
    runLinter({
      filePattern: '**/*.{css,scss,less,sass,styl,stylus}',
      linter: Linter.Stylelint,
    }),
  ]).then((results) => {
    results.forEach(({ logs, summary }) => {
      if (Object.keys(logs).length === 0) {
        return
      }

      colourLog.info(`\nLogging ${summary.linter.toLowerCase()} results:`)

      Object.entries(logs).forEach(([file, log]) => {
        console.log()
        console.log(chalk.underline(`${process.cwd()}/${file}`))
        spaceLog({
          columnKeys: ['type', 'position', 'message', 'rule'],
          spaceSize: 2,
        }, log)
      })
    })

    results.forEach(({ summary }) => {
      colourLog.resultBlock(summary)
    })

    const exitCode = notifyResults(results, title)

    if (watch) {
      colourLog.info('Watching for changes...')
    } else {
      console.log()
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

    global.debug = debug

    runLintPilot({ title, watch })

    if (watch) {
      watchFiles({
        filePatterns: [
          '**/*.{cjs,js,jsx,mjs,ts,tsx}',
          '**/*.{md,mdx}',
          '**/*.{css,scss,less,sass,styl,stylus}',
        ],
        ignorePatterns: ['**/+(coverage|node_modules)/**'],
      })

      fileChangeEvent.on(Events.FILE_CHANGED, ({ message }) => {
        clearTerminal()
        colourLog.info(message)
        console.log()
        runLintPilot({ title, watch })
      })
    }
  })

program.parse(process.argv)
