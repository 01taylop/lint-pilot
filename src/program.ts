import chalk from 'chalk'
import { Command } from 'commander'

import { description, version } from '../package.json'
import { lintCommand } from './commands'

const helpText = `
Examples:
  Run all linters (default command):
    ${chalk.gray('$ lint-pilot')}
  Run all linters (explicitly):
    ${chalk.gray('$ lint-pilot lint')}
  Automatically fix problems and watch for changes:
    ${chalk.gray('$ lint-pilot --fix --watch')}
  Enable caching for faster linting:
    ${chalk.gray('$ lint-pilot --cache --fix --watch')}`

const createProgram = () => {
  const program = new Command()

  program
    .name('lint-pilot')
    .description(description)
    .version(version)

    .addHelpText('beforeAll', '\n✈️ Lint Pilot\n')
    .addHelpText('after', helpText)
    .configureOutput({
      outputError: (str, write) => write(chalk.red(`\n× ${str.replace(/^error: /i, '')}`)),
    })
    .showHelpAfterError('\n💡 Run `lint-pilot --help` for more information.')

  lintCommand(program)

  return program
}

export {
  createProgram
}
