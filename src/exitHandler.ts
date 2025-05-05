import colourLog from '@Utils/colour-log'

const exitHandler = (code: 0 | 1, text: string, error?: Error | string | unknown) => {
  colourLog.error(text, error)
  process.exit(code)
}

export {
  exitHandler,
}
