#!/usr/bin/env node
import chalk from 'chalk'
import { Command } from 'commander'

import { description, version } from '../package.json'
import { exitHandler } from './exitHandler'

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

process.on('exit', () => console.log())
process.on('SIGINT', () => exitHandler(0, 'SIGINT'))
process.on('SIGTERM', () => exitHandler(0, 'SIGTERM'))
process.on('uncaughtException', reason => exitHandler(1, 'Unexpected Error', reason))
process.on('unhandledRejection', reason => exitHandler(1, 'Unhandled Promise', reason))

export {
  createProgram
}
