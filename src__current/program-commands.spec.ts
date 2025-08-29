import { lintCommand } from '../commands'
import { createProgram } from '../program'

import type { LintCommandOptions } from '@Types/commands'

jest.mock('../commands', () => ({
  lintCommand: jest.fn(),
}))

describe('program - commands', () => {

  it('calls the lint command by default', () => {
    const program = createProgram()
    program.parse(['node', './index.ts'])

    expect(lintCommand).toHaveBeenCalledTimes(1)
  })

  it('calls the lint command with default options', () => {
    const program = createProgram()
    program.parse(['node', './index.ts', 'lint'])

    const expectedOptions: LintCommandOptions = {
      cache: false,
      clearCache: false,
      debug: false,
      emoji: '✈️',
      eslintUseLegacyConfig: false,
      fix: false,
      title: 'Lint Pilot',
      watch: false,
    }

    expect(lintCommand).toHaveBeenCalledOnceWith(expectedOptions)
  })

  it('calls the lint command with configured options', () => {
    const program = createProgram()
    program.parse(['node', './index.ts', 'lint', '--emoji', '🚀', '--title', 'Rocket Lint', '--fix', '--watch', '--cache', '--clearCache', '--ignore-dirs', 'node_modules', '--ignore-patterns', 'dist', '--eslint-include', '*.mdx', '--debug', '--eslint-use-legacy-config'])

    const expectedOptions: LintCommandOptions = {
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
    }

    expect(lintCommand).toHaveBeenCalledOnceWith(expectedOptions)
  })

})
