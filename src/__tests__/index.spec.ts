import chalk from 'chalk'

import { description, name, version } from '../../package.json'

import program from '../index'

jest.mock('chalk', () => ({
  red: jest.fn(text => text),
}))

describe('lint-pilot', () => {

  it('displays the help text', () => {
    const helpInformation = program
      .configureHelp({
        helpWidth: -1,
      })
      .helpInformation()

    expect(helpInformation).toStrictEqual(`Usage: ${name} [options] [command]

${description}

Options:
  -V, --version   output the version number
  -h, --help      display help for command

Commands:
  lint            run all linters: ESLint, Stylelint, and MarkdownLint (default)
  lint:es         run ESLint only
  lint:markdown   run MarkdownLint only
  lint:style      run Stylelint only
  help [command]  display help for command
`)
  })

  it('displays the version', () => {
    program
      .configureOutput({ writeOut: jest.fn() })
      .exitOverride()

    expect(() => {
      program.parse(['node', './index.ts', '--version']);
    }).toThrow(version)
  })

  it('handles unknown options', () => {
    expect.assertions(4)

    const writeErrMock = jest.fn()

    program
      .configureOutput({
        writeErr: writeErrMock,
      })

    try {
      program.parse(['node', './index.ts', '--unknown']);
    } catch (e: any) {
      expect(e.message).toMatch('process.exit(1)')
    }

    expect(chalk.red).toHaveBeenCalledOnceWith(expect.stringContaining('✗ unknown option \'--unknown\''))
    expect(writeErrMock).toHaveBeenNthCalledWith(1, expect.stringContaining('✗ unknown option \'--unknown\''))
    expect(writeErrMock).toHaveBeenNthCalledWith(2, expect.stringContaining('💡 Run `lint-pilot --help` for more information.'))
  })

})
