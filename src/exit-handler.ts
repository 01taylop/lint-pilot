import colourLog from '@Utils/colour-log'

import type { FSWatcher } from 'chokidar'

type ExitCode = 0 | 1

const exitHandler = async (
  exitCode: ExitCode,
  reason: string,
  watcher: FSWatcher | undefined,
  error?: Error | string | unknown
): Promise<never> => {
  if (exitCode === 1 && error) {
    colourLog.error(reason, error)
  }

  if (watcher) {
    await watcher.close()
  }

  process.exit(exitCode)
}

export {
  exitHandler,
}
