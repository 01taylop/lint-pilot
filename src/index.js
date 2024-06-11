#!/usr/bin/env node
import { Command } from 'commander'

import { colourLog } from './colour-log.mjs'
import eslint from './eslint.mjs'
import markdownlint from './markdownlint.mjs'
import { notifyResults } from './notifier.mjs'
import stylelint from './stylelint.mjs'

const program = new Command()

program
  .name('lint-pilot')
  .description('Lint Pilot: Your co-pilot for maintaining high code quality with seamless ESLint, Stylelint, and MarkdownLint integration.')
  .version('0.0.1')

/*
 * ESLINT
 */

const runESLint = async () => {
  const startTime = new Date().getTime()
  colourLog.info('Running eslint...')

  const result = await eslint.lintFiles(['./src/**/*.js'])

  colourLog.result({
    linter: 'eslint',
    result,
    startTime,
  })
  return result
}

/*
 * MARKDOWN LINT
 */

const runMarkdownLint = async () => {
  const startTime = new Date().getTime()
  colourLog.info('Running markdownlint...')

  const result = await markdownlint.lintFiles(['./README.md'])

  colourLog.result({
    linter: 'markdownlint',
    result,
    startTime,
  })
  return result
}

/*
 * STYLELINT
 */

const runStylelint = async () => {
  const startTime = new Date().getTime()
  colourLog.info('Running stylelint...')

  const result = await stylelint.lintFiles(['**/*.css', '**/*.scss'])

  colourLog.result({
    linter: 'stylelint',
    result,
    startTime,
  })
  return result
}

program
  .option('-t, --title <string>', 'customise the title displayed when running lint-pilot')
  .action(options => {
    console.clear()
    colourLog.title(options.title ? options.title : '✈️ Lint Pilot ✈️')
    console.log()

    Promise.all([
      runESLint(),
      runMarkdownLint(),
      runStylelint(),
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
