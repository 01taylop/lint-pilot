import notifier from 'node-notifier'

import { pluralise } from '@Utils/transform'

import type { LintReport } from '@Types'

const notifyResults = (results: Array<LintReport>, title: string) => {
  // Errors
  let totalErrorCount = results.reduce((total, { summary: { errorCount } }) => total + errorCount, 0)
  if (totalErrorCount > 0) {
    notifier.notify({
      message: `${totalErrorCount} ${pluralise('error', totalErrorCount)} found. Please fix ${totalErrorCount > 1 ? 'them ' : 'it '}before continuing.`,
      sound: 'Frog',
      title: `🚨 ${title} 🚨`,
    })
    return 1
  }

  // Warnings
  let totalWarningCount = results.reduce((total, { summary: { warningCount } }) => total + warningCount, 0)
  if (totalWarningCount > 0) {
    notifier.notify({
      message: `${totalWarningCount} ${pluralise('warning', totalWarningCount)} found. Please review ${totalWarningCount > 1 ? 'them ' : ''}before continuing.`,
      sound: 'Frog',
      title: `🚧 ${title} 🚧`,
    })
    return 0
  }

  // Success
  notifier.notify({
    message: 'All lint checks have passed. Your code is clean!',
    sound: 'Purr',
    title: `✅ ${title} ✅`,
  })
  return 0
}

export {
  notifyResults,
}
