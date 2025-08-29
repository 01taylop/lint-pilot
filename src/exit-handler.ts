import colourLog from '@Utils/colour-log'

import type { FSWatcher } from 'chokidar'

type ExitCode = 0 | 1

const exitHandler = async (
  exitCode: ExitCode,
  reason: string,
  watcher: FSWatcher | undefined,
  error?: Error | string | unknown
): Promise<never> => {
  if (error) {
    colourLog.error(reason, error)
  }

  if (watcher) {
    let watcherTimeout: NodeJS.Timeout

    try {
      await Promise.race([
        watcher.close(),
        new Promise((_, reject) => {
          watcherTimeout = setTimeout(() => reject(new Error('Watcher close timeout')), 5000)
        })
      ])
    } catch (watcherError) {
      colourLog.error('Failed to close file watcher', watcherError)
    }

    clearTimeout(watcherTimeout!)
  }

  process.exit(exitCode)
}

export {
  exitHandler,
}
