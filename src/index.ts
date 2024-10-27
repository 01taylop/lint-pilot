#!/usr/bin/env node
import chalk from 'chalk'
import { Command } from 'commander'

import { description, name, version } from '../package.json'

import { lint } from './commands'

const createProgram = () => {
  const program = new Command()

  program
    .name(name)
    .description(description)
    .version(version)

    .addHelpText('beforeAll', '\n✈️ Lint Pilot\n')
    .configureOutput({
      outputError: (str, write) => write(chalk.red(`\n✗ ${str.replace(/^error: /iu, '')}`)),
    })
    .showHelpAfterError('\n💡 Run `lint-pilot --help` for more information.')

  /*
   * Lint Command
   */

  program
    .command('lint', { isDefault: true })
    .description('run all linters: ESLint, Stylelint, and MarkdownLint (default)')

    .option('-e, --emoji <string>', 'customise the emoji displayed when running lint-pilot', '✈️')
    .option('-t, --title <string>', 'customise the title displayed when running lint-pilot', 'Lint Pilot')

    .option('--fix', 'automatically fix problems', false)
    .option('-w, --watch', 'watch for file changes and re-run the linters', false)

    .option('--cache', 'cache linting results', false)
    .option('--clearCache', 'clear the cache', false)

    .option('--ignore-dirs <directories...>', 'directories to ignore globally')
    .option('--ignore-patterns <patterns...>', 'file patterns to ignore globally')
    .option('--eslint-include <patterns...>', 'file patterns to include for ESLint')

    .option('--debug', 'output additional debug information including the list of files being linted', false)
    .option('--eslint-use-legacy-config', 'set to true to use the legacy ESLint configuration', false)

    .action(options => lint(options))

  return program
}

/* istanbul ignore next */
process.on('exit', () => {
  console.log()
})

/* istanbul ignore next */
if (process.env.NODE_ENV !== 'test') {
  const program = createProgram()
  program.parseAsync(process.argv)
}

export default createProgram
