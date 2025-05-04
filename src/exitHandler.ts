import chalk from 'chalk'

const logReason = (reason: string) => console.error(`\n${chalk.white(reason)}`)

const exitHandler = (code: 0 | 1, error: string, reason?: Error | string | unknown) => {
  console.error(chalk.red(`\n× ${error}`))

  if (reason) {
    if (reason instanceof Error) {
      logReason(reason.message)
      if (reason.stack) {
        console.error(`\n${chalk.gray(reason.stack)}`)
      }
    } else if (typeof reason === 'string') {
      logReason(reason)
    } else {
      try {
        logReason(JSON.stringify(reason))
      } catch {
        logReason('Unable to stringify reason')
      }
    }
  }

  process.exit(code)
}

export {
  exitHandler,
}
