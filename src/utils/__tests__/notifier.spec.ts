import { jest } from '@jest/globals'
import notifier from 'node-notifier'

import { Linter } from '@Types'

import { notifyResults } from '../notifier'

jest.mock('node-notifier', () => ({
  notify: jest.fn(),
}))

describe('notifier', () => {

  describe('notifyResults', () => {

    const generateResult = (errorCount = 0, warningCount = 0) => ({
      processedResult: {
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
        generateResult(0, 0),
        generateResult(1, 0),
        generateResult(0, 1),
      ])

      expect(exitCode).toBe(1)
    })

    it('returns an exit code of 0 if there are no errors, but there are warnings', () => {
      const exitCode = notifyResults([
        generateResult(0, 0),
        generateResult(0, 0),
        generateResult(0, 1),
      ])

      expect(exitCode).toBe(0)
    })

    it('returns an exit code of 0 if there are no errors or warnings', () => {
      const exitCode = notifyResults([
        generateResult(0, 0),
        generateResult(0, 0),
      ])

      expect(exitCode).toBe(0)
    })

    it('notifies the user when there is a single error', () => {
      notifyResults([
        generateResult(0, 0),
        generateResult(1, 1),
        generateResult(0, 1),
      ])

      expect(notifier.notify).toHaveBeenCalledTimes(1)
      expect(notifier.notify).toHaveBeenCalledWith({
        message: `1 error found. Please fix it before continuing.`,
        sound: 'Frog',
        title: '🚨 Lint Pilot 🚨',
      })
    })

    it('notifies the user when there is are multiple errors', () => {
      notifyResults([
        generateResult(0, 0),
        generateResult(5, 0),
        generateResult(2, 1),
      ])

      expect(notifier.notify).toHaveBeenCalledTimes(1)
      expect(notifier.notify).toHaveBeenCalledWith({
        message: `7 errors found. Please fix them before continuing.`,
        sound: 'Frog',
        title: '🚨 Lint Pilot 🚨',
      })
    })

    it('notifies the user when there is a single warning', () => {
      notifyResults([
        generateResult(0, 0),
        generateResult(0, 0),
        generateResult(0, 1),
      ])

      expect(notifier.notify).toHaveBeenCalledTimes(1)
      expect(notifier.notify).toHaveBeenCalledWith({
        message: `1 warning found. Please review before continuing.`,
        sound: 'Frog',
        title: '🚧 Lint Pilot 🚧',
      })
    })

    it('notifies the user when there is are multiple warnings', () => {
      notifyResults([
        generateResult(0, 0),
        generateResult(0, 7),
        generateResult(0, 2),
      ])

      expect(notifier.notify).toHaveBeenCalledTimes(1)
      expect(notifier.notify).toHaveBeenCalledWith({
        message: `9 warnings found. Please review them before continuing.`,
        sound: 'Frog',
        title: '🚧 Lint Pilot 🚧',
      })
    })

    it('notifies the user when there are no errors or warnings', () => {
      notifyResults([
        generateResult(0, 0),
        generateResult(0, 0),
      ])

      expect(notifier.notify).toHaveBeenCalledTimes(1)
      expect(notifier.notify).toHaveBeenCalledWith({
        message: 'All lint checks have passed. Your code is clean!',
        sound: 'Purr',
        title: '✅ Lint Pilot ✅',
      })
    })

  })

})
