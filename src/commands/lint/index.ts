import type { LintOptions } from '@Types/commands'
import { clearCacheDirectory } from '@Utils/cache'
import colourLog from '@Utils/colour-log'
import { clearTerminal } from '@Utils/terminal'

import { getFilePatterns } from './file-patterns'
import { EVENTS, fileChangeEvent, watchFiles } from './watch-files'

const lint = ({ cache, clearCache, debug, emoji, eslintInclude, eslintUseLegacyConfig, fix, ignoreDirs, ignorePatterns, title, watch }: LintOptions) => {
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

  const lintOptions = {
    cache,
    eslintUseLegacyConfig,
    filePatterns,
    fix,
    title,
    watch,
  }

  console.log('Run Lint', lintOptions) // TODO: Run lint

  if (watch) {
    watchFiles({
      filePatterns: Object.values(filePatterns.includePatterns).flat(),
      ignorePatterns: filePatterns.ignorePatterns,
    })

    fileChangeEvent.on(EVENTS.FILE_CHANGED, ({ message }) => {
      clearTerminal()
      colourLog.info(`${message}\n`)
      console.log('Run Lint', lintOptions) // TODO: Run lint
    })
  }
}

export default lint
