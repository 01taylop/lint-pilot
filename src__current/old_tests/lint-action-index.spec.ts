import { Command } from 'commander'

import { clearCacheDirectory } from '@Utils/cache'
import colourLog from '@Utils/colourLog'

import lintAction from '../'

jest.mock('@Utils/cache', () => ({
  clearCacheDirectory: jest.fn(),
}))

describe('lintAction', () => {

  let clearTerminalSpy: jest.SpyInstance
  let program: Command

  beforeEach(() => {
    jest.spyOn(colourLog, 'config').mockImplementation(() => true)
    jest.spyOn(colourLog, 'title').mockImplementation(() => true)
    jest.spyOn(console, 'log').mockImplementation(() => true)
    clearTerminalSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => true)

    program = new Command()
    lintAction(program)
  })

  it('sets global.debug to false by default', async () => {
    expect.assertions(1)

    await program.parseAsync(['node', 'src/index.ts'])

    expect(global.debug).toBe(false)
  })

  it('sets global.debug to true', async () => {
    expect.assertions(1)

    await program.parseAsync(['node', 'src/index.ts', '--debug'])

    expect(global.debug).toBe(true)
  })

  it('clears the terminal', async () => {
    expect.assertions(1)

    await program.parseAsync(['node', 'src/index.ts'])

    expect(clearTerminalSpy).toHaveBeenCalledTimes(1)
  })

  it('logs the title', async () => {
    expect.assertions(1)

    await program.parseAsync(['node', 'src/index.ts'])

    expect(colourLog.title).toHaveBeenCalledOnceWith('✈️ Lint Pilot ✈️\n')
  })

  it('does not clear the cache by default', async () => {
    expect.assertions(1)

    await program.parseAsync(['node', 'src/index.ts'])

    expect(clearCacheDirectory).not.toHaveBeenCalled()
  })

  it('clears the cache', async () => {
    expect.assertions(1)

    await program.parseAsync(['node', 'src/index.ts', '--clearCache'])

    expect(clearCacheDirectory).toHaveBeenCalledTimes(1)
  })

  it.todo('runs the linters with the default options', () => {

  })

  it.todo('runs the linters with the specified options', () => {

  })

  it.todo('does not watch for changes by default', () => {

  })

  it.todo('watches for changes', () => {

  })

  it.todo('re-runs the linters when a file changes', () => {

  })

})
