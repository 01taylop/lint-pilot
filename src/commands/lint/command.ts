import { Command } from 'commander'

import action from './action'

const command = (program: Command) => {
  program
    .command('lint')
    .action(action)
}

export default command
