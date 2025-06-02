import colourLog from '@Utils/colour-log'

import type { FSWatcher } from 'chokidar'

type ExitCode = 0 | 1

const exitHandler = (
  exitCode: ExitCode,
  reason: string,
  watcher: FSWatcher | undefined,
  error?: Error | string | unknown
) => {
  if (exitCode === 1 && error) {
    colourLog.error(reason, error)
  }

  if (watcher) {
    watcher.close()
  }

  console.log()
  process.exit(exitCode)
}

export {
  exitHandler,
}
