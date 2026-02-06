import chalk from 'chalk'

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

  title: (title: string) => console.log(chalk.cyan(title)),

  warning: (text: string) => console.warn(chalk.yellow(text)),
}

export default colourLog
