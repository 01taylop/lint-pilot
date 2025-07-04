import { createHash } from 'node:crypto'
import { EventEmitter } from 'node:events'
import { readFile } from 'node:fs'

import chokidar from 'chokidar'

import type { FilePatterns, Linter } from '@Types/lint'

enum EVENTS {
  FILE_CHANGED = 'FILE_CHANGED',
}

interface FileChangedEventPayload {
  message: string
  path: string
}

const fileWatcherEvents = new EventEmitter()

const fileHashes = new Map<string, string>()

const watchFiles = ({ includePatterns, ignorePatterns }: FilePatterns, linters?: Array<Linter>) => {
  const filteredPatterns = linters
    ? linters.flatMap(linter => includePatterns[linter])
    : Object.values(includePatterns).flat()

  const watcher = chokidar.watch(filteredPatterns, {
    ignored: ignorePatterns,
    ignoreInitial: true,
    persistent: true,
  })

  watcher.on('add', (path, _stats) => {
    fileWatcherEvents.emit(EVENTS.FILE_CHANGED, {
      message: `File \`${path}\` has been added.`,
      path,
    } satisfies FileChangedEventPayload)
  })

  watcher.on('change', (path, _stats) => {
    readFile(path, 'utf8', (error, data) => {
      /* istanbul ignore next */
      if (error) {
        return
      }
      const newHash = createHash('md5').update(data).digest('hex')
      if (fileHashes.get(path) !== newHash) {
        fileHashes.set(path, newHash)
        fileWatcherEvents.emit(EVENTS.FILE_CHANGED, {
          message: `File \`${path}\` has been changed.`,
          path,
        } satisfies FileChangedEventPayload)
      }
    })
  })

  watcher.on('unlink', path => {
    fileHashes.delete(path)
    fileWatcherEvents.emit(EVENTS.FILE_CHANGED, {
      message: `File \`${path}\` has been removed.`,
      path,
    } satisfies FileChangedEventPayload)
  })

  return watcher
}

export type {
  FileChangedEventPayload,
}

export {
  EVENTS,
  fileWatcherEvents,
  watchFiles,
}
