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
    const isCalledOnce = received.mock.calls.length === 1
    let isCalledWithExpected = false

    if (isCalledOnce) {
      isCalledWithExpected = expected.every((arg, index) => this.equals(received.mock.calls[0][index], arg))
    }

    const printExpected = this.utils.printExpected(expected)
    const printReceived = this.utils.printReceived(received.mock.calls[0])

    return {
      message: () => `expected ${received.getMockName()} to have been called exactly once with arguments. Expected:\n\n${printExpected}\n\nReceived:\n\n${printReceived}\n`,
      pass: isCalledOnce && isCalledWithExpected,
    }
  },
})
