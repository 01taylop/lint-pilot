import { defaults } from 'jest-config'

import type { JestConfigWithTsJest } from 'ts-jest'

const config: JestConfigWithTsJest = {
  clearMocks: true,
  collectCoverageFrom: [
    'src/**/*',
    '!src/(index|program).ts',
    '!src/linters/**/index.ts',
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
  moduleFileExtensions: ['ts', ...defaults.moduleFileExtensions],
  moduleNameMapper: {
    '^@Jest(.*)$': '<rootDir>/jest-config$1',
    '^@Types(.*)$': '<rootDir>/src/types$1',
    '^@Utils(.*)$': '<rootDir>/src/utils$1',
  },
  modulePathIgnorePatterns: [
    '<rootDir>/lib/',
  ],
  setupFilesAfterEnv: [
    '<rootDir>/jest-config/setup.ts',
  ],
  transform: {
    '^.+\\.(js|ts)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    './node_modules/(?!(chalk)/)',
  ],
}

export default config
