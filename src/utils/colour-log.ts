import chalk from 'chalk'

const colourLog = {
  config: (key: string, config: Array<string>) => {
    const configString = config.length > 1
      ? `[${config.join(', ')}]`
      : config[0]

    console.log(chalk.magenta(`${key}: `), chalk.dim(configString))
  },

  info: (text: string) => console.log(chalk.blue(text)),

  title: (title: string) => console.log(chalk.cyan(title)),
}

export default colourLog
