#!/usr/bin/env node
import chalk from 'chalk'
import { Command } from 'commander'

import { description, version } from '../package.json'

const createProgram = () => {
  const program = new Command()

  program
    .name('lint-pilot')
    .description(description)
    .version(version)

    .addHelpText('beforeAll', '\n✈️ Lint Pilot\n')
    .configureOutput({
      outputError: (str, write) => write(chalk.red(`\n× ${str.replace(/^error: /i, '')}`)),
    })
    .showHelpAfterError('\n💡 Run `lint-pilot --help` for more information.')

  .action(() => console.log('lint action called'))

  return program
}

export {
  createProgram
}
