jest.mock('log-symbols', () => ({
  warning: '!',
  error: 'X',
}))

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

    const pass = isCalledOnce && isCalledWithExpected

    return {
      message: () => `expected ${received.getMockName()} to have been called exactly once with "${expected}" but received "${received.mock.calls[0]}"`,
      pass,
    }
  },
})
