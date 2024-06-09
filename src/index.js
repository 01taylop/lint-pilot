#!/usr/bin/env node
import { Command } from 'commander'
import notifier from 'node-notifier'

import { colourLog } from './colour-log.mjs'
import eslint from './eslint.mjs'
import markdownlint from './markdownlint.mjs'
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

  await eslint.lintFiles(['./src/**/*.js'])

  colourLog.timer('Finished eslint', startTime)
}

/*
 * MARKDOWN LINT
 */

const runMarkdownLint = async () => {
  const startTime = new Date().getTime()
  colourLog.info('Running markdownlint...')

  await markdownlint.lintFiles(['./README.md'])

  colourLog.timer('Finished markdownlint', startTime)
}

/*
 * STYLELINT
 */

const runStylelint = async () => {
  const startTime = new Date().getTime()
  colourLog.info('Running stylelint...')

  await stylelint.lintFiles(['**/*.css', '**/*.scss'])

  colourLog.timer('Finished stylelint', startTime)
}

program
  .option('-t, --title <string>', 'customise the title displayed when running lint-pilot')
  .action(options => {
    console.clear()
    colourLog.title(options.title ? options.title : '🛫 Lint Pilot 🛬')
    console.log()

    Promise.all([
      runESLint(),
      runMarkdownLint(),
      runStylelint(),
    ]).then(() => {
      notifier.notify({
        message: 'All lint checks have passed. Your code is clean!',
        sound: 'Purr',
        title: '✅ Lint Success',
      })

      console.log()
      process.exit(0)
    })
  })

program.parse(process.argv)
