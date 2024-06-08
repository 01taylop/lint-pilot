#!/usr/bin/env node
import { Command } from 'commander'

import chalk from 'chalk'

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
    console.log(chalk.cyan(options.title ? options.title : '🛫 Lint Pilot 🛬'))
    console.log()
  })

program.parse(process.argv)
