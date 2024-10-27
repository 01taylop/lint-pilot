import type { LintOptions } from '@Types/commands'
import { clearCacheDirectory } from '@Utils/cache'
import colourLog from '@Utils/colour-log'
import { clearTerminal } from '@Utils/terminal'

import { getFilePatterns } from './file-patterns'

const lint = ({ clearCache, debug, emoji, eslintInclude, ignoreDirs, ignorePatterns, title, ...options }: LintOptions) => {
  global.debug = debug

  clearTerminal()
  colourLog.title(`${emoji} ${title}\n`)

  if (clearCache) {
    clearCacheDirectory()
  }

  const filePatterns = getFilePatterns({
    eslintInclude,
    ignoreDirs,
    ignorePatterns,
  })

  console.log('Run Lint', options, filePatterns)
}

export default lint
