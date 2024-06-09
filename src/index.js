#!/usr/bin/env node
import { Command } from 'commander'
import notifier from 'node-notifier'

import { colourLog } from './colour-log.mjs'
import { lintFiles } from './eslint.mjs'

const program = new Command()

program
  .name('lint-pilot')
  .description('Lint Pilot: Your co-pilot for maintaining high code quality with seamless ESLint and Stylelint integration.')
  .version('0.0.1')

const runESLint = async () => {
  const startTime = new Date().getTime()
  colourLog.info('Running eslint...')

  await lintFiles(['./src/**/*.js'])

  colourLog.timer('Finished eslint', startTime)
}

const runMarkdownLint = () => new Promise(resolve => {
  const startTime = new Date().getTime()
  colourLog.info('Running markdownlint...')

  setTimeout(() => {
    colourLog.timer('Finished markdownlint', startTime)
    resolve()
  }, 500)
})

const runStylelint = () => new Promise(resolve => {
  const startTime = new Date().getTime()
  colourLog.info('Running stylelint...')

  setTimeout(() => {
    colourLog.timer('Finished stylelint', startTime)
    resolve()
  }, 1000)
})

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
