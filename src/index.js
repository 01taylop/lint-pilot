#!/usr/bin/env node
import { Command } from 'commander'
import notifier from 'node-notifier'

import { colourLog } from './colour-log.mjs'

const program = new Command()

program
  .name('lint-pilot')
  .description('Lint Pilot: Your co-pilot for maintaining high code quality with seamless ESLint and Stylelint integration.')
  .version('0.0.1')

program
  .command('greet')
  .description('Log a greeting message')
  .action(() => {
    console.log('Hello, welcome to LintPilot!')
  })

program
  .option('-t, --title <string>', 'customise the title displayed when running lint-pilot')
  .action(options => {
    console.clear()
    colourLog.title(options.title ? options.title : '🛫 Lint Pilot 🛬')
    console.log()

    notifier.notify({
      message: 'All lint checks have passed. Your code is clean!',
      sound: 'Purr',
      title: '✅ Lint Success',
    })

    process.exit(0)
  })

program.parse(process.argv)
