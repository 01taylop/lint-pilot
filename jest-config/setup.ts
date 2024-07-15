beforeEach(() => {
  global.debug = false
})

expect.extend({
  toHaveBeenCalledOnceWith(received, ...expected) {
    const pass = received.mock.calls.length === 1 && received.mock.calls[0].every((arg, index) => {
      if (typeof arg === 'object' && typeof expected[index] === 'object') {
        return JSON.stringify(arg) === JSON.stringify(expected[index])
      }
      return arg === expected[index]
    })

    return {
      message: () => `expected ${received.getMockName()} to have been called exactly once with "${expected}" but received "${received.mock.calls[0]}"`,
      pass,
    }
  },
})
