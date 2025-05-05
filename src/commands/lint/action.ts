import { clearCacheDirectory } from '@Utils/cache'
import colourLog from '@Utils/colour-log'
import { getFilePatterns } from '@Utils/file-patterns'
import { clearTerminal } from '@Utils/terminal'
import { EVENTS, fileChangeEvent, watchFiles } from '@Utils/watch-files'

import type { LintCommandOptions } from '@Types/commands'

const action = ({ cache, clearCache, debug, emoji, eslintInclude, eslintUseLegacyConfig, fix, ignoreDirs, ignorePatterns, title, watch }: LintCommandOptions) => {
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
    watchFiles(filePatterns)

    fileChangeEvent.on(EVENTS.FILE_CHANGED, ({ message }: { message: string }) => {
      clearTerminal()
      colourLog.info(`${message}\n`)
      console.log('Run Lint', lintOptions) // TODO: Run lint
    })
  }
}

export default action
