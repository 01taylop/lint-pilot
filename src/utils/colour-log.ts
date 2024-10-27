import chalk from 'chalk'

const colourLog = {
  info: (text: string) => console.log(chalk.blue(text)),
  title: (title: string) => console.log(chalk.cyan(title)),
}

export default colourLog
