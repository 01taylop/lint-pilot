import type { LintOptions } from '@Types/commands'
import { clearTerminal } from '@Utils/terminal'

const lint = (options: LintOptions) => {
  clearTerminal()

  console.log('Run Lint', options)
}

export default lint
