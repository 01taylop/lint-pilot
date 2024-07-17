import { jest } from '@jest/globals'
import notifier from 'node-notifier'

import { Linter, type LintReport } from '@Types'

import { notifyResults } from '../notifier'

jest.mock('node-notifier', () => ({
  notify: jest.fn(),
}))

describe('notifyResults', () => {

  const generateReport = (errorCount = 0, warningCount = 0): LintReport => ({
    results: {},
    summary: {
      deprecatedRules: [],
      errorCount,
      fileCount: 0,
      fixableErrorCount: 0,
      fixableWarningCount: 0,
      linter: Linter.ESLint,
      warningCount,
    },
  })

  it('returns an exit code of 1 if there are errors', () => {
    const exitCode = notifyResults([
      generateReport(0, 0),
      generateReport(1, 0),
      generateReport(0, 1),
    ], 'Lint Pilot')

    expect(exitCode).toBe(1)
  })

  it('returns an exit code of 0 if there are no errors, but there are warnings', () => {
    const exitCode = notifyResults([
      generateReport(0, 0),
      generateReport(0, 0),
      generateReport(0, 1),
    ], 'Lint Pilot')

    expect(exitCode).toBe(0)
  })

  it('returns an exit code of 0 if there are no errors or warnings', () => {
    const exitCode = notifyResults([
      generateReport(0, 0),
      generateReport(0, 0),
    ], 'Lint Pilot')

    expect(exitCode).toBe(0)
  })

  it('notifies when there is a single error', () => {
    notifyResults([
      generateReport(0, 0),
      generateReport(1, 1),
      generateReport(0, 1),
    ], 'Lint Pilot')

    expect(notifier.notify).toHaveBeenCalledOnceWith({
      message: '1 error found. Please fix it before continuing.',
      sound: 'Frog',
      title: '🚨 Lint Pilot 🚨',
    })
  })

  it('notifies when there are multiple errors', () => {
    notifyResults([
      generateReport(0, 0),
      generateReport(5, 0),
      generateReport(2, 1),
    ], 'Lint Pilot')

    expect(notifier.notify).toHaveBeenCalledOnceWith({
      message: '7 errors found. Please fix them before continuing.',
      sound: 'Frog',
      title: '🚨 Lint Pilot 🚨',
    })
  })

  it('notifies when there is a single warning', () => {
    notifyResults([
      generateReport(0, 0),
      generateReport(0, 0),
      generateReport(0, 1),
    ], 'Lint Pilot')

    expect(notifier.notify).toHaveBeenCalledOnceWith({
      message: '1 warning found. Please review before continuing.',
      sound: 'Frog',
      title: '🚧 Lint Pilot 🚧',
    })
  })

  it('notifies when there are multiple warnings', () => {
    notifyResults([
      generateReport(0, 0),
      generateReport(0, 7),
      generateReport(0, 2),
    ], 'Lint Pilot')

    expect(notifier.notify).toHaveBeenCalledOnceWith({
      message: '9 warnings found. Please review them before continuing.',
      sound: 'Frog',
      title: '🚧 Lint Pilot 🚧',
    })
  })

  it('notifies when there are no errors or warnings', () => {
    notifyResults([
      generateReport(0, 0),
      generateReport(0, 0),
    ], 'Lint Pilot')

    expect(notifier.notify).toHaveBeenCalledOnceWith({
      message: 'All lint checks have passed. Your code is clean!',
      sound: 'Purr',
      title: '✅ Lint Pilot ✅',
    })
  })

})
