import chalk from 'chalk'
import { spaceLog } from 'space-log'

import { pluralise } from '@Utils/transform'

import type { LintReport, ReportSummary } from '@Types'

const colourLog = {
  config: (key: string, configArray: Array<string>) => {
    const configString = configArray.length > 1
      ? `[${configArray.join(', ')}]`
      : configArray[0]

    console.log(chalk.magenta(`${key}: `), chalk.dim(configString))
  },

  configDebug: (message: string, config: any) => {
    if (global.debug) {
      console.log(`\n${chalk.blue(message)}`)
      console.log(config)
    }
  },

  error: (text: string, error?: Error | unknown) => {
    let errorMessage = `\n${text}.`
    if (error && global.debug === false) {
      errorMessage += ' Run with --debug for more information.'
    }

    console.log(chalk.red(errorMessage))
    if (error && global.debug === true) {
      console.log()
      console.log(error)
    }
  },

  info: (text: string) => console.log(chalk.blue(text)),

  results: ({ results, summary }: LintReport) => {
    if (Object.keys(results).length === 0) {
      return
    }

    console.log(chalk.blue(`\nLogging ${summary.linter.toLowerCase()} results:`))

    Object.entries(results).forEach(([file, formattedResults]) => {
      console.log()
      console.log(chalk.underline(file))
      spaceLog({
        columnKeys: ['severity', 'position', 'message', 'rule'],
        spaceSize: 2,
      }, formattedResults)
    })
  },

  summary: (summary: ReportSummary, startTime: number) => {
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
  },

  summaryBlock: ({ errorCount, linter, warningCount }: ReportSummary) => {
    // Errors
    if (errorCount > 0) {
      const message = chalk.bgRed.black(` ${errorCount} ${linter} ${pluralise('Error', errorCount)} `)
      console.log(`\n🚨 ${message}`)
    }

    // Warnings
    if (warningCount > 0) {
      const message = chalk.bgYellow.black(` ${warningCount} ${linter} ${pluralise('Warning', warningCount)} `)
      console.log(`\n🚧 ${message}`)
    }

    // Success
    if (errorCount === 0 && warningCount === 0) {
      const message = chalk.bgGreen.black(` ${linter} Success! `)
      console.log(`\n✅ ${message}`)
    }
  },

  title: (title: string) => console.log(chalk.cyan(title)),
}

export default colourLog
