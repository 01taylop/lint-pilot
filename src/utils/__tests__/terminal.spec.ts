import { clearTerminal } from '../terminal'

describe('clearTerminal', () => {

  it('calls process.stdout.write to clear the terminal', () => {
    const mockWrite = jest.spyOn(process.stdout, 'write').mockImplementation(() => true)

    clearTerminal()

    expect(mockWrite).toHaveBeenCalledWith('\x1Bc\x1B[3J\x1B[2J\x1B[H')
    mockWrite.mockRestore()
  })

})
