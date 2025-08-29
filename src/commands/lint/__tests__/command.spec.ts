import { Command } from 'commander'

import lintCommand from '../command'

describe('lintCommand', () => {
  let program: Command

  beforeEach(() => {
    program = new Command()
    lintCommand(program)
  })

  it('registers the lint command', () => {
    const cmd = program.commands.find(cmd => cmd.name() === 'lint')

    expect(cmd).toBeDefined()
  })

  it('sets the description and summary', () => {
    const cmd = program.commands.find(cmd => cmd.name() === 'lint')

    expect(cmd?.description()).toBe('Run all linters: ESLint, Stylelint, and Markdownlint (default command).')
    expect(cmd?.summary()).toBe('run all linters (default command)')
  })

})
