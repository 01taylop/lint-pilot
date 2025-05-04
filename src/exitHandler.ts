import chalk from 'chalk'

const exitHandler = (code: number, error?: string, reason?: unknown) => {
  if (error) {
    console.error(chalk.red(`\n× ${error}`))
    if (reason) {
      console.error(chalk.white(reason))
    }
  }
  process.exit(code)
}

export {
  exitHandler,
}
