import notifier from 'node-notifier'

import { pluralise } from '@Utils/transform'

import type { Notification } from 'node-notifier/notifiers/notificationcenter'
import type { LintReport } from '@Types/lint'

type ExitCode = 0 | 1

const notifyFailSafe = (options: Notification) => {
  try {
    notifier.notify(options)
  } catch {
    // Intentionally empty - notifications are optional
  }
}

const notifyResults = (reports: Array<LintReport>, title: string): ExitCode => {
  // Errors
  const totalErrorCount = reports.reduce((total, { summary: { errorCount } }) => total + errorCount, 0)
  if (totalErrorCount > 0) {
    notifyFailSafe({
      message: `${totalErrorCount} ${pluralise('error', totalErrorCount)} found. Please fix ${totalErrorCount === 1 ? 'it ' : 'them '}before continuing.`,
      sound: 'Frog',
      title: `🚨 ${title}`,
    })
    return 1
  }

  // Warnings
  const totalWarningCount = reports.reduce((total, { summary: { warningCount } }) => total + warningCount, 0)
  if (totalWarningCount > 0) {
    notifyFailSafe({
      message: `${totalWarningCount} ${pluralise('warning', totalWarningCount)} found. Please review ${totalWarningCount === 1 ? '' : 'them '}before continuing.`,
      sound: 'Frog',
      title: `⚠️ ${title}`,
    })
    return 0
  }

  // Success
  notifyFailSafe({
    message: 'All lint checks have passed. Your code is clean!',
    sound: 'Purr',
    title: `✅ ${title}`,
  })
  return 0
}

export {
  notifyResults,
}
