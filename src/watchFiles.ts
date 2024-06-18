import { createHash } from 'crypto'
import { EventEmitter } from 'events'
import { readFile } from 'fs'

import chokidar from 'chokidar'

import { Events } from '@Types'

interface WatchFiles {
  filePatterns: Array<string>
  ignorePatterns: Array<string>
}

const fileChangeEvent = new EventEmitter()

const fileHashes = new Map<string, string>()

const getHash = (data: string) => createHash('md5').update(data).digest('hex')

const watchFiles = ({ filePatterns, ignorePatterns }: WatchFiles) => {
  const watcher = chokidar.watch(filePatterns, {
    ignored: ignorePatterns,
    ignoreInitial: true,
    persistent: true,
  })

  watcher.on('add', (path, _stats) => {
    fileChangeEvent.emit(Events.FILE_CHANGED, {
      message: `File \`${path}\` has been added.`,
      path,
    })
  })

  watcher.on('change', (path, _stats) => {
    readFile(path, 'utf8', (_error, data) => {
      const newHash = getHash(data)
      if (fileHashes.get(path) !== newHash) {
        fileHashes.set(path, newHash)
        fileChangeEvent.emit(Events.FILE_CHANGED, {
          message: `File \`${path}\` has been changed.`,
          path,
        })
      }
    })
  })

  watcher.on('unlink', path => {
    fileChangeEvent.emit(Events.FILE_CHANGED, {
      message: `File \`${path}\` has been removed.`,
      path,
    })
  })
}

export {
  fileChangeEvent,
  watchFiles,
}
