import chalk from 'chalk'

import { description, name, version } from '../../package.json'
import { lint } from '../commands'
import createProgram from '../index'

jest.mock('chalk', () => ({
  red: jest.fn(text => text),
}))

jest.mock('../commands', () => ({
  lint: jest.fn(),
}))

describe('lint-pilot', () => {

  it('displays the help text', () => {
    const program = createProgram()
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
  lint [options]  run all linters: ESLint, Stylelint, and MarkdownLint (default)
  help [command]  display help for command
`)
  })

  it('displays the version', () => {
    const program = createProgram()
    program
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
    program
      .configureOutput({
        writeErr: writeErrMock,
      })

    try {
      program.parse(['node', './index.ts', '--unknown'])
    } catch (e: any) {
      expect(e.message).toMatch('process.exit(1)')
    }

    expect(chalk.red).toHaveBeenCalledOnceWith(expect.stringContaining('✗ unknown option \'--unknown\''))
    expect(writeErrMock).toHaveBeenNthCalledWith(1, expect.stringContaining('✗ unknown option \'--unknown\''))
    expect(writeErrMock).toHaveBeenNthCalledWith(2, expect.stringContaining('💡 Run `lint-pilot --help` for more information.'))
  })

  it('calls the lint command by default', () => {
    const program = createProgram()
    program.parse(['node', './index.ts'])

    expect(lint).toHaveBeenCalledTimes(1)
  })

  it('calls the lint command with default options', () => {
    const program = createProgram()
    program.parse(['node', './index.ts', 'lint'])

    expect(lint).toHaveBeenCalledOnceWith({
      cache: false,
      clearCache: false,
      debug: false,
      emoji: '✈️',
      eslintUseLegacyConfig: false,
      fix: false,
      title: 'Lint Pilot',
      watch: false,
    })
  })

  it('calls the lint command with configured options', () => {
    const program = createProgram()
    program.parse(['node', './index.ts', 'lint', '--emoji', '🚀', '--title', 'Rocket Lint', '--fix', '--watch', '--cache', '--clearCache', '--ignore-dirs', 'node_modules', '--ignore-patterns', 'dist', '--eslint-include', '*.mdx', '--debug', '--eslint-use-legacy-config'])

    expect(lint).toHaveBeenCalledOnceWith({
      cache: true,
      clearCache: true,
      debug: true,
      emoji: '🚀',
      eslintInclude: ['*.mdx'],
      eslintUseLegacyConfig: true,
      fix: true,
      ignoreDirs: ['node_modules'],
      ignorePatterns: ['dist'],
      title: 'Rocket Lint',
      watch: true,
    })
  })
})
