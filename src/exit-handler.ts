import colourLog from '@Utils/colour-log'

type ExitCode = 0 | 1

const exitHandler = (exitCode: ExitCode, reason: string, error?: Error | string | unknown) => {
  if (exitCode === 1 && error) {
    colourLog.error(reason, error)
  }

  process.exit(exitCode)
}

export {
  exitHandler,
}
