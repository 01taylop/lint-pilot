#!/usr/bin/env node
import chalk from 'chalk'
import { Command } from 'commander'
import logSymbols from 'log-symbols'

import lintAction from './lint-action'

const program = new Command()

program
  .name('lint-pilot')
  .description('Lint Pilot: Your co-pilot for maintaining high code quality with seamless ESLint, Stylelint, and MarkdownLint integration.')
  .version('0.0.1')

  .addHelpText('beforeAll', '\n✈️ Lint Pilot ✈️\n')
  .configureOutput({
    outputError: (str, write) => write(`\n${logSymbols.error} ${chalk.red(str)}`),
  })
  .showHelpAfterError('\n💡 Run `lint-pilot --help` for more information')

lintAction(program)

process.on('exit', () => {
  console.log()
})

program.parseAsync(process.argv)
