jest.mock('log-symbols', () => ({
  warning: '!',
  error: 'X',
}))

jest.spyOn(process, 'exit').mockImplementation(code => {
  throw new Error(`process.exit(${code})`)
})

beforeEach(() => {
  global.debug = false
})

expect.extend({
  toHaveBeenCalledOnceWith(received, ...expected) {
    const isCalledOnce = received.mock.calls.length === 1
    let isCalledWithExpected = false

    if (isCalledOnce) {
      isCalledWithExpected = expected.every((arg, index) => this.equals(received.mock.calls[0][index], arg))
    }

    return {
      message: () => `expected ${received.getMockName()} to have been called exactly once with "${expected}" but received "${received.mock.calls[0]}"`,
      pass: isCalledOnce && isCalledWithExpected,
    }
  },
})
