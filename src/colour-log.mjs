import chalk from 'chalk'

const pluralise = (message, count) => count === 1 ? message : `${message}s`

const colourLog = {
  config: (key, configArray) => {
    const configString = configArray.length >= 2 ? `[${configArray.join(', ')}]` : configArray[0]
    console.log(chalk.magenta(`${key}:`), chalk.dim(configString))
  },

  info: text => console.log(chalk.blue(text)),

  result: ({ linter, result, startTime }) => {
    const { deprecatedRules, errorCount, fixableErrorCount, fixableWarningCount, warningCount } = result.processedResult

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
    console.log()
    console.log(chalk.cyan(`Finished ${linter}`), chalk.yellow(`[${new Date().getTime() - startTime}ms]`))
    log.length && console.log(log.join('\n'))
  },

  resultBlock: ({ linter, result }) => {
    const { errorCount, warningCount } = result.processedResult

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

  title: title => console.log(chalk.cyan(title)),
}

export {
  colourLog,
}
