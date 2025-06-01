import colourLog from '@Utils/colour-log'

const exitHandler = (exitCode: 0 | 1, reason: string, error?: Error | string | unknown) => {
  if (exitCode === 1 && error) {
    colourLog.error(reason, error)
  }

  process.exit(exitCode)
}

export {
  exitHandler,
}
