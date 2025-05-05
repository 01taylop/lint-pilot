import { createHash } from 'node:crypto'
import { EventEmitter } from 'node:events'
import { readFile } from 'node:fs'

import chokidar from 'chokidar'

import type { FilePatterns, Linter } from '@Types/lint'

enum EVENTS {
  FILE_CHANGED = 'FILE_CHANGED',
}

interface WatchFilesOptions extends FilePatterns {
  linters?: Array<Linter>
}

const fileChangeEvent = new EventEmitter()

const fileHashes = new Map<string, string>()

const watchFiles = ({ includePatterns, ignorePatterns, linters }: WatchFilesOptions) => {
  const filteredPatterns = linters
    ? linters.flatMap(linter => includePatterns[linter] || [])
    : Object.values(includePatterns).flat()

  const watcher = chokidar.watch(filteredPatterns, {
    ignored: ignorePatterns,
    ignoreInitial: true,
    persistent: true,
  })

  watcher.on('add', (path, _stats) => {
    fileChangeEvent.emit(EVENTS.FILE_CHANGED, {
      message: `File \`${path}\` has been added.`,
      path,
    })
  })

  watcher.on('change', (path, _stats) => {
    readFile(path, 'utf8', (_error, data) => {
      const newHash = createHash('md5').update(data).digest('hex')
      if (fileHashes.get(path) !== newHash) {
        fileHashes.set(path, newHash)
        fileChangeEvent.emit(EVENTS.FILE_CHANGED, {
          message: `File \`${path}\` has been changed.`,
          path,
        })
      }
    })
  })

  watcher.on('unlink', path => {
    fileChangeEvent.emit(EVENTS.FILE_CHANGED, {
      message: `File \`${path}\` has been removed.`,
      path,
    })
  })
}

export {
  EVENTS,
  fileChangeEvent,
  watchFiles,
}
