import notifier from 'node-notifier'

import { pluralise } from '@Utils'

const notifyResults = (results: Array<LinterResult>) => {
  let totalErrorCount = results.reduce((total, { processedResult: { errorCount = 0 } }) => total + errorCount, 0)
  let totalWarningCount = results.reduce((total, { processedResult: { warningCount = 0 } }) => total + warningCount, 0)

  if (totalErrorCount > 0) {
    notifier.notify({
      message: `${totalErrorCount} ${pluralise('error', totalErrorCount)} found. Please fix ${totalErrorCount > 1 ? 'them ' : 'it '}before continuing.`,
      sound: 'Frog',
      title: '🚨 Lint Pilot 🚨',
    })
    return 1
  }

  if (totalWarningCount > 0) {
    notifier.notify({
      message: `${totalWarningCount} ${pluralise('warning', totalWarningCount)} found. Please review ${totalWarningCount > 1 ? 'them ' : ''}before continuing.`,
      sound: 'Frog',
      title: '🚧 Lint Pilot 🚧',
    })
    return 0
  }

  notifier.notify({
    message: 'All lint checks have passed. Your code is clean!',
    sound: 'Purr',
    title: '✅ Lint Pilot ✅',
  })
  return 0
}

export {
  notifyResults,
}
