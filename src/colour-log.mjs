import chalk from 'chalk'

const colourLog = {
  config: (key, configArray) => {
    const configString = configArray.length >= 2 ? `[${configArray.join(', ')}]` : configArray[0]
    console.log(chalk.magenta(`${key}:`), chalk.dim(configString))
  },
  error: text => console.log(`💔 ${chalk.bgRed.black(text)}`),
  info: text => console.log(chalk.blue(text)),
  success: text => console.log(`🎉 ${chalk.bgGreen.black(text)}`),
  timer: (title, startTime) => console.log(chalk.blue(title), chalk.yellow(`[${new Date().getTime() - startTime}ms]`)),
  title: title => console.log(chalk.cyan(title)),
  warning: text => console.log(`🚧 ${chalk.bgYellow.black(text)}`),
}

export {
  colourLog,
}
