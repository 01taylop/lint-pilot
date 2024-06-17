import notifier from 'node-notifier'

import { type LinterResult } from '@Types'
import { pluralise } from '@Utils/transform'

const notifyResults = (results: Array<LinterResult>) => {
  let totalErrorCount = results.reduce((total, { processedResult: { errorCount } }) => total + errorCount, 0)
  if (totalErrorCount > 0) {
    notifier.notify({
      message: `${totalErrorCount} ${pluralise('error', totalErrorCount)} found. Please fix ${totalErrorCount > 1 ? 'them ' : 'it '}before continuing.`,
      sound: 'Frog',
      title: '🚨 Lint Pilot 🚨',
    })
    return 1
  }

  let totalWarningCount = results.reduce((total, { processedResult: { warningCount } }) => total + warningCount, 0)
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
