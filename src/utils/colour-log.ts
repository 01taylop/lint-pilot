import chalk from 'chalk'

const formatError = (error: Error | string | unknown): string => {
  if (error instanceof Error) {
    return error.stack || error.message
  }
  if (typeof error === 'string') {
    return error
  }
  try {
    return JSON.stringify(error, null, 2)
  } catch {
    return 'Unable to stringify error'
  }
}

const colourLog = {

  error: (text: string, error?: Error | string | unknown) => {
    let errorMessage = `\n× ${text}.`
    if (error && global.debug === false) {
      errorMessage += ' Run with --debug for more information.'
    }

    console.error(chalk.red(errorMessage))
    if (error && global.debug === true) {
      console.error(`\n${chalk.gray(formatError(error))}`)
    }
  },

}

export default colourLog
