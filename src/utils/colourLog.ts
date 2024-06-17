import chalk from 'chalk'

import { type ProcessedResult } from '@Types'
import { pluralise } from '@Utils/transform'

const colourLog = {
  config: (key: string, configArray: Array<string>) => {
    const configString = configArray.length >= 2 ? `[${configArray.join(', ')}]` : configArray[0]
    console.log(chalk.magenta(`${key}:`), chalk.dim(configString))
  },

  info: (text: string) => console.log(chalk.blue(text)),

  result: (processedResult: ProcessedResult, startTime: number) => {
    const { deprecatedRules, errorCount, fileCount, fixableErrorCount, fixableWarningCount, linter, warningCount } = processedResult

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
    const deprecationCount = deprecatedRules?.length
    if (deprecationCount) {
      let deprecationMessage = chalk.magenta(`  ${deprecationCount} ${pluralise('deprecation', deprecationCount)}`)
      deprecationMessage += chalk.dim(` [${deprecatedRules.sort((a, b) => a.localeCompare(b)).join(', ')}]`)
      log.push(deprecationMessage)
    }

    // Output
    const files = `${fileCount} ${pluralise('file', fileCount)}`
    const endTime = `${new Date().getTime() - startTime}ms`
    console.log()
    console.log(chalk.cyan(`Finished ${linter.toLowerCase()}`), chalk.yellow(`[${files}, ${endTime}]`))
    log.length && console.log(log.join('\n'))
  },

  resultBlock: ({ errorCount, linter, warningCount }: ProcessedResult) => {
    if (errorCount > 0) {
      const message = chalk.bgRed.black(` ${errorCount} ${linter} ${pluralise('Error', errorCount)} `)
      console.log(`💔 ${message}\n`)
    }
    if (warningCount > 0) {
      const message = chalk.bgYellow.black(` ${warningCount} ${linter} ${pluralise('Warning', warningCount)} `)
      console.log(`🚧 ${message}\n`)
    }
    if (errorCount > 0 || warningCount > 0) {
      return
    }

    const message = chalk.bgGreen.black(` ${linter} Success! `)
    console.log(`✅ ${message}\n`)
  },

  title: (title: string) => console.log(chalk.cyan(title)),
}

export default colourLog
