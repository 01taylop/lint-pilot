import chalk from 'chalk'

import { description, name, version } from '../../package.json'
import { createProgram } from '../program'

jest.mock('chalk', () => ({
  gray: jest.fn().mockImplementation(text => text),
  red: jest.fn().mockImplementation(text => text),
}))

const EXPECTED_HELP_TEXT = `Usage: ${name} [options] [command]

${description}

Options:
  -V, --version   output the version number
  -h, --help      display help for command

Commands:
  lint [options]  run all linters (default command)
  help [command]  display help for command
`

describe('createProgram', () => {

  it('sets the program name', () => {
    const program = createProgram()

    expect(program.name()).toBe(name)
  })

  it('sets the program description', () => {
    const program = createProgram()

    expect(program.description()).toBe(description)
  })

  it('sets the program version', () => {
    const program = createProgram()

    expect(program.version()).toBe(version)
  })

  it('displays the help text', () => {
    const helpInformation = createProgram()
      .configureHelp({ helpWidth: -1 })
      .helpInformation()

    expect(helpInformation).toStrictEqual(EXPECTED_HELP_TEXT)
  })

  it('displays the version', () => {
    const program = createProgram()
      .configureOutput({ writeOut: jest.fn() })
      .exitOverride()

    expect(() => {
      program.parse(['node', './index.ts', '--version'])
    }).toThrow(version)
  })

  it('handles unknown options', () => {
    expect.assertions(4)

    const writeErrMock = jest.fn()

    const program = createProgram()
      .configureOutput({ writeErr: writeErrMock })

    try {
      program.parse(['node', './index.ts', '--unknown'])
    } catch (e: any) {
      expect(e.message).toMatch('process.exit(1)')
    }

    expect(chalk.red).toHaveBeenCalledOnceWith(expect.stringContaining('× unknown option \'--unknown\''))
    expect(writeErrMock).toHaveBeenNthCalledWith(1, expect.stringContaining('× unknown option \'--unknown\''))
    expect(writeErrMock).toHaveBeenNthCalledWith(2, expect.stringContaining('💡 Run `lint-pilot --help` for more information.'))
  })

})
