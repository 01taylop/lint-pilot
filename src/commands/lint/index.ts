import type { LintOptions } from '@Types/commands'
import { clearCacheDirectory } from '@Utils/cache'
import colourLog from '@Utils/colour-log'
import { clearTerminal } from '@Utils/terminal'

const lint = ({ clearCache, debug, emoji, title, ...options }: LintOptions) => {
  global.debug = debug

  clearTerminal()
  colourLog.title(`${emoji} ${title}\n`)

  if (clearCache) {
    clearCacheDirectory()
  }

  console.log('Run Lint', options)
}

export default lint
