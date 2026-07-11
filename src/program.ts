import chalk from 'chalk'
import { Command } from 'commander'
import { ProcessSupervisor } from 'process-supervisor'

import { description, name, version } from '../package.json'

import { lintCommand } from './commands'

interface CreateProgramOptions {
  supervisor: ProcessSupervisor
}

const helpText = `
Examples:
  Run all linters (default command):
    ${chalk.gray('$ zedlint')}
  Run all linters (explicitly):
    ${chalk.gray('$ zedlint lint')}
  Automatically fix problems and watch for changes:
    ${chalk.gray('$ zedlint --fix --watch')}
  Enable caching for faster linting:
    ${chalk.gray('$ zedlint --cache --fix --watch')}`

const createProgram = ({ supervisor }: CreateProgramOptions): Command => {
  const program = new Command()

  program
    .name(name)
    .description(description)
    .version(version)

    .addHelpText('beforeAll', '\n🏂 Zedlint\n')
    .addHelpText('after', helpText)
    .configureOutput({
      outputError: (str, write) => write(chalk.red(`\n× ${str.replace(/^error: /i, '')}`)),
    })

  lintCommand(program, supervisor)

  return program
}

export {
  createProgram,
}
