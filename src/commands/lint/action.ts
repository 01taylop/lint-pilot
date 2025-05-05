import type { LintCommandOptions } from '@Types/commands'
import { clearCacheDirectory } from '@Utils/cache'
import colourLog from '@Utils/colour-log'
import { clearTerminal } from '@Utils/terminal'

const action = ({ cache, clearCache, debug, emoji, eslintInclude, eslintUseLegacyConfig, fix, ignoreDirs, ignorePatterns, title, watch }: LintCommandOptions) => {
  global.debug = debug

  clearTerminal()
  colourLog.title(`${emoji} ${title}\n`)

  if (clearCache) {
    clearCacheDirectory()
  }
}

export default action
