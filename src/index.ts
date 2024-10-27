#!/usr/bin/env node
import chalk from 'chalk'
import { Command } from 'commander'

import { description, name, version } from '../package.json'

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
 * Default
 */

program
  .command('lint', { isDefault: true })
  .description('run all linters: ESLint, Stylelint, and MarkdownLint (default)')
  .action(() => {
    // TODO: Run Linters
    console.log('Run Lint')
  })

/* istanbul ignore next */
process.on('exit', () => {
  console.log()
})

/* istanbul ignore next */
if (process.env.NODE_ENV !== 'test') {
  program.parseAsync(process.argv)
}

export default program
