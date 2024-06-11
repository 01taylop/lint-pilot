#!/usr/bin/env node
import { Command } from 'commander'

import colourLog from './colour-log.mjs'
import { eslint, stylelint, markdownlint } from './linters/index.mjs'
import { notifyResults } from './notifier.mjs'
import { sourceFiles } from './source-files.mjs'

const program = new Command()

program
  .name('lint-pilot')
  .description('Lint Pilot: Your co-pilot for maintaining high code quality with seamless ESLint, Stylelint, and MarkdownLint integration.')
  .version('0.0.1')

/*
 * ESLINT
 */

const runESLint = async debug => {
  const startTime = new Date().getTime()
  colourLog.info('Running eslint...')

  const files = await sourceFiles('**/*.{cjs,js,jsx,mjs,ts,tsx}', {
    debug,
    ignore: '**/+(coverage|node_modules)/**',
    linter: 'eslint',
  })
  const result = await eslint.lintFiles(files)

  colourLog.result({
    fileCount: files.length,
    linter: 'eslint',
    result,
    startTime,
  })
  return result
}

/*
 * MARKDOWN LINT
 */

const runMarkdownLint = async debug => {
  const startTime = new Date().getTime()
  colourLog.info('Running markdownlint...')

  const files = await sourceFiles('**/*.{md,mdx}', {
    debug,
    ignore: '**/+(coverage|node_modules)/**',
    linter: 'markdownlint',
  })
  const result = await markdownlint.lintFiles(files)

  colourLog.result({
    fileCount: files.length,
    linter: 'markdownlint',
    result,
    startTime,
  })
  return result
}

/*
 * STYLELINT
 */

const runStylelint = async debug => {
  const startTime = new Date().getTime()
  colourLog.info('Running stylelint...')

  const files = await sourceFiles('**/*.{css,scss,less,sass,styl,stylus}', {
    debug,
    ignore: '**/+(coverage|node_modules)/**',
    linter: 'stylelint',
  })
  const result = await stylelint.lintFiles(files)

  colourLog.result({
    fileCount: files.length,
    linter: 'stylelint',
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
      runESLint(debug),
      runMarkdownLint(debug),
      runStylelint(debug),
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
