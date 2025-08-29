import chalk from 'chalk'

import colourLog from '../colour-log'

jest.mock('chalk', () => ({
  gray: jest.fn().mockImplementation(text => text),
  red: jest.fn().mockImplementation(text => text),
}))

describe('colourLog', () => {

  const mockedConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {})

  describe('error', () => {

    const error = new Error('Oops')

    it('logs the text in red', () => {
      colourLog.error('An error occurred')

      expect(chalk.red).toHaveBeenCalledOnceWith('\n× An error occurred.')
      expect(mockedConsoleError).toHaveBeenCalledOnceWith('\n× An error occurred.')
    })

    it('logs the text with debug instructions if there is an error and global.debug is false', () => {
      colourLog.error('An error occurred', error)

      expect(chalk.red).toHaveBeenCalledOnceWith('\n× An error occurred. Run with --debug for more information.')
      expect(mockedConsoleError).toHaveBeenCalledOnceWith('\n× An error occurred. Run with --debug for more information.')
    })

    it('logs the error if global.debug is true', () => {
      global.debug = true

      colourLog.error('An error occurred', error)

      expect(mockedConsoleError).toHaveBeenCalledTimes(2)
      expect(mockedConsoleError).toHaveBeenNthCalledWith(1, '\n× An error occurred.')
      expect(mockedConsoleError).toHaveBeenNthCalledWith(2, `\n${error.stack}`)
    })

    it('logs the error message if error is an Error without a stack', () => {
      global.debug = true

      const noStackError = new Error('No stack')
      noStackError.stack = undefined

      colourLog.error('An error occurred', noStackError)

      expect(mockedConsoleError).toHaveBeenCalledTimes(2)
      expect(mockedConsoleError).toHaveBeenNthCalledWith(1, '\n× An error occurred.')
      expect(mockedConsoleError).toHaveBeenNthCalledWith(2, `\n${noStackError.message}`)
    })

    it('logs the error if error is a string', () => {
      global.debug = true

      colourLog.error('An error occurred', 'String error')

      expect(mockedConsoleError).toHaveBeenCalledTimes(2)
      expect(mockedConsoleError).toHaveBeenNthCalledWith(1, '\n× An error occurred.')
      expect(mockedConsoleError).toHaveBeenNthCalledWith(2, '\nString error')
    })

    it('logs the error if error is a plain object', () => {
      global.debug = true

      colourLog.error('An error occurred', { foo: 'bar' })

      expect(mockedConsoleError).toHaveBeenCalledTimes(2)
      expect(mockedConsoleError).toHaveBeenNthCalledWith(1, '\n× An error occurred.')
      expect(mockedConsoleError).toHaveBeenNthCalledWith(2, `\n${JSON.stringify({ foo: 'bar' }, null, 2)}`)
    })

    it('logs a fallback message if error cannot be stringified', () => {
      global.debug = true

      const circular: any = {}
      circular.self = circular

      colourLog.error('An error occurred', circular)

      expect(mockedConsoleError).toHaveBeenCalledTimes(2)
      expect(mockedConsoleError).toHaveBeenNthCalledWith(1, '\n× An error occurred.')
      expect(mockedConsoleError).toHaveBeenNthCalledWith(2, '\nUnable to stringify error')
    })

  })

})
