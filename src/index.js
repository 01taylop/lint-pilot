#!/usr/bin/env node
import { Command } from 'commander'

const program = new Command()

program
  .version('0.0.1')
  .description('Lint Pilot')

program
  .command('greet')
  .description('Log a greeting message')
  .action(() => {
    console.log('Hello, welcome to LintPilot!')
  })

program
  .action(() => {
    console.log('Running LintPilot with default settings.')
  })

program.parse(process.argv)
