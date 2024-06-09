import chalk from 'chalk'

const colourLog = {
  config: (key, configArray) => {
    const configString = configArray.length >= 2 ? `[${configArray.join(', ')}]` : configArray[0]
    console.log(chalk.magenta(`${key}:`), chalk.dim(configString))
  },

  error: text => console.log(`💔 ${chalk.bgRed.black(text)}`),

  info: text => console.log(chalk.blue(text)),

  result: ({ linter, result, startTime }) => {
    const { deprecatedRules, errorCount, files, fixableErrorCount, fixableWarningCount, warningCount } = result.processedResult

    const log = []

    if (errorCount > 0) {
      let errorMessage = chalk.red(`  ${errorCount} error${errorCount > 1 ? 's' : ''}`)
      if (fixableErrorCount) {
        errorMessage += chalk.dim(` (${fixableErrorCount} fixable)`)
      }
      log.push(errorMessage)
    }

    if (warningCount > 0) {
      let warningMessage = chalk.yellow(`  ${warningCount} warning${warningCount > 1 ? 's' : ''}`)
      if (fixableWarningCount) {
        warningMessage += chalk.dim(` (${fixableWarningCount} fixable)`)
      }
      log.push(warningMessage)
    }

    const deprecationCount = deprecatedRules?.length
    if (deprecationCount) {
      let deprecationMessage = chalk.magenta(`  ${deprecationCount} deprecation${deprecationCount > 1 ? 's' : ''}`)
      deprecationMessage += chalk.dim(` [${deprecatedRules.sort((a, b) => a.localeCompare(b)).join(', ')}]`)
      log.push(deprecationMessage)
    }

    console.log(chalk.blue(`Finished ${linter}`), chalk.yellow(`[${new Date().getTime() - startTime}ms]`))
    console.log(log.join('\n'))
    console.log()
  },

  success: text => console.log(`🎉 ${chalk.bgGreen.black(text)}`),

  title: title => console.log(chalk.cyan(title)),

  warning: text => console.log(`🚧 ${chalk.bgYellow.black(text)}`),
}

export {
  colourLog,
}
