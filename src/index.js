#!/usr/bin/env node
import { Command } from 'commander'

import colourLog from './colour-log.mjs'
import linters from './linters/index.mjs'
import { notifyResults } from './notifier.mjs'
import { sourceFiles } from './source-files.mjs'

const program = new Command()

program
  .name('lint-pilot')
  .description('Lint Pilot: Your co-pilot for maintaining high code quality with seamless ESLint, Stylelint, and MarkdownLint integration.')
  .version('0.0.1')

const runLinter = async ({ debug, filePattern, linter }) => {
  const startTime = new Date().getTime()
  colourLog.info(`Running ${linter}...`)

  const files = await sourceFiles({
    debug,
    filePattern,
    ignore: '**/+(coverage|node_modules)/**',
    linter,
  })

  const result = await linters[linter].lintFiles(files)

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
        linter: 'eslint',
      }),
      runLinter({
        debug,
        filePattern: '**/*.{md,mdx}',
        linter: 'markdownlint',
      }),
      runLinter({
        debug,
        filePattern: '**/*.{css,scss,less,sass,styl,stylus}',
        linter: 'stylelint',
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
