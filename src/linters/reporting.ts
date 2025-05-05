import chalk from 'chalk'

import { pluralise } from '@Utils/transform'

import type { ReportSummary } from '@Types/lint'

const reportSummary = (summary: ReportSummary, startTime: number) => {
  const { deprecatedRules, errorCount, fileCount, fixableErrorCount, fixableWarningCount, linter, warningCount } = summary

  const log = []

  // Errors
  if (errorCount > 0) {
    let errorMessage = chalk.red(`  ${errorCount} ${pluralise('error', errorCount)}`)
    if (fixableErrorCount) {
      errorMessage += chalk.dim(` (${fixableErrorCount} fixable)`)
    }
    log.push(errorMessage)
  }

  // Warnings
  if (warningCount > 0) {
    let warningMessage = chalk.yellow(`  ${warningCount} ${pluralise('warning', warningCount)}`)
    if (fixableWarningCount) {
      warningMessage += chalk.dim(` (${fixableWarningCount} fixable)`)
    }
    log.push(warningMessage)
  }

  // Deprecations
  const deprecationCount = deprecatedRules.length
  if (deprecationCount) {
    let deprecationMessage = chalk.magenta(`  ${deprecationCount} ${pluralise('deprecation', deprecationCount)}`)
    deprecationMessage += chalk.dim(` [${deprecatedRules.sort((a, b) => a.localeCompare(b)).join(', ')}]`)
    log.push(deprecationMessage)
  }

  // Output
  const finishedLinter = chalk.cyan(`Finished ${linter.toLowerCase()}`)
  const files = `${fileCount} ${pluralise('file', fileCount)}`
  const endTime = `${new Date().getTime() - startTime}ms`

  console.log(`\n${finishedLinter}`, chalk.yellow(`[${files}, ${endTime}]`))
  if (log.length) {
    console.log(log.join('\n'))
  }
}

export {
  reportSummary,
}
