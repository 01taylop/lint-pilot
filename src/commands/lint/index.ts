import type { LintOptions } from '@Types/commands'
import colourLog from '@Utils/colour-log'
import { clearTerminal } from '@Utils/terminal'

const lint = ({ emoji, title, ...options }: LintOptions) => {
  clearTerminal()
  colourLog.title(`${emoji} ${title}\n`)

  console.log('Run Lint', options)
}

export default lint
