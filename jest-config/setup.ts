/*
 * MOCKS AND SPIES
 */

jest.spyOn(process, 'exit').mockImplementation(code => {
  throw new Error(`process.exit(${code})`)
})

/*
 * HOOKS
 */

beforeEach(() => {
  global.debug = false
})

/*
 * EXTEND EXPECT
 */

expect.extend({
  toHaveBeenCalledOnceWith(received, ...expected) {
    const calls = received.mock.calls
    const pass = calls.length === 1 && expected.every((arg, index) => this.equals(calls[0][index], arg))

    const printExpected = this.utils.printExpected(expected)
    const printReceived = this.utils.printReceived(calls)

    return {
      message: () => `expected ${received.getMockName()} to have been called once with arguments. Expected:\n\n${printExpected}\n\nReceived:\n\n${printReceived}\n`,
      pass,
    }
  },
})
