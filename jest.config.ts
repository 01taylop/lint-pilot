import { defaults } from 'jest-config'

import type { JestConfigWithTsJest } from 'ts-jest'

const config: JestConfigWithTsJest = {
  clearMocks: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/index.ts',
    '!src/linters/*.ts',
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
    '^@Constants(.*)$': '<rootDir>/src/constants$1',
    '^@Types(.*)$': '<rootDir>/src/types$1',
    '^@Utils(.*)$': '<rootDir>/src/utils$1',
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
}

export default config
