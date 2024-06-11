#!/usr/bin/env node
import { Command } from 'commander'

import { Linter } from '@Constants'
import colourLog from '@Utils/colourLog'

import linters from './linters/index'
import { notifyResults } from './notifier'
import { sourceFiles } from './source-files'

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

const runLinter = async ({ debug, filePattern, linter }: RunLinter) => {
  const startTime = new Date().getTime()
  colourLog.info(`Running ${linter.toLowerCase()}...`)

  const files = await sourceFiles({
    debug,
    filePattern,
    ignore: '**/+(coverage|node_modules)/**',
    linter,
  })

  const result: LinterResult = await linters[linter].lintFiles(files)

  colourLog.result({
    fileCount: files.length,
    linter,
    result,
    startTime,
  })

  return result
}

program
  .option('-t, --title <string>', 'customise the title displayed when running lint-pilot')
  .option('--debug', 'output additional debug information including the list of files being linted')
  .action(({ debug, title }) => {
    console.clear()
    colourLog.title(title ? title : '✈️ Lint Pilot ✈️')
    console.log()

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

      results.forEach(({ processedResult: { errorCount, linter, warningCount} }) => {
        colourLog.resultBlock({
          errorCount,
          linter,
          warningCount,
        })
      })

      const exitCode = notifyResults(results)

      process.exit(exitCode)
    })
  })

program.parse(process.argv)
