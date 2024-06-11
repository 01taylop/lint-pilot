export default {
  clearMocks: true,
  collectCoverageFrom: [
    'src/**/*.(m)?js',
  ],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  testMatch: ['**/*.spec.js'],
  transform: {
    '\\.m?js$': 'babel-jest',
  },
}
