#!/usr/bin/env node
import { Command } from 'commander'

import lintAction from './lint-action'

const program = new Command()

program
  .name('lint-pilot')
  .description('Lint Pilot: Your co-pilot for maintaining high code quality with seamless ESLint, Stylelint, and MarkdownLint integration.')
  .version('0.0.1')
  .addHelpText('beforeAll', '\n✈️ Lint Pilot ✈️\n')
  .showHelpAfterError('\n💡 Run `lint-pilot --help` for more information.\n')

lintAction(program)

process.on('exit', () => {
  console.log()
})

program.parseAsync(process.argv)
