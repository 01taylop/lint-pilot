import { createHash } from 'node:crypto'
import { EventEmitter } from 'node:events'
import { readFile } from 'node:fs'

import chokidar from 'chokidar'

import { Events } from '@Types'

interface WatchFiles {
  filePatterns: Array<string>
  ignorePatterns: Array<string>
}

const fileWatcherEvents = new EventEmitter()

const fileHashes = new Map<string, string>()

const watchFiles = ({ filePatterns, ignorePatterns }: WatchFiles) => {
  const watcher = chokidar.watch(filePatterns, {
    ignored: ignorePatterns,
    ignoreInitial: true,
    persistent: true,
  })

  watcher.on('add', (path, _stats) => {
    fileWatcherEvents.emit(Events.FILE_CHANGED, {
      message: `File \`${path}\` has been added.`,
      path,
    })
  })

  watcher.on('change', (path, _stats) => {
    readFile(path, 'utf8', (_error, data) => {
      const newHash = createHash('md5').update(data).digest('hex')
      if (fileHashes.get(path) !== newHash) {
        fileHashes.set(path, newHash)
        fileWatcherEvents.emit(Events.FILE_CHANGED, {
          message: `File \`${path}\` has been changed.`,
          path,
        })
      }
    })
  })

  watcher.on('unlink', path => {
    fileWatcherEvents.emit(Events.FILE_CHANGED, {
      message: `File \`${path}\` has been removed.`,
      path,
    })
  })
}

export {
  fileWatcherEvents,
  watchFiles,
}
