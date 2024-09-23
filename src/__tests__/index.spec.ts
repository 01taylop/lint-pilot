import { spawnSync } from 'child_process'
import path from 'path'

describe('lint-pilot', () => {

  const cliPath = path.resolve(__dirname, '../index.ts')

  it('displays the help text', () => {
    const result = spawnSync('yarn', ['run', 'tsx', cliPath, '--help'], { encoding: 'utf-8' })

    expect(result.stdout).toContain('✈️ Lint Pilot ✈️\n')
    expect(result.stdout).toContain('Lint Pilot: Your co-pilot for maintaining high code quality')
  })

  it('displays the version', () => {
    const result = spawnSync('yarn', ['run', 'tsx', cliPath, '--version'], { encoding: 'utf-8' })

    expect(result.stdout).toContain('0.0.1')
  })

  it('handles unknown options', () => {
    const result = spawnSync('yarn', ['run', 'tsx', cliPath, '--unknown'], { encoding: 'utf-8' })

    expect(result.stderr).toContain('error: unknown option')
    expect(result.stderr).toContain('💡 Run `lint-pilot --help` for more information')
  })

})
