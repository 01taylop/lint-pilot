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
    persistent: true,
  })

  watcher.on('change', (path, _stats) => {
    readFile(path, 'utf8', (_error, data) => {
      const newHash = getHash(data)
      if (fileHashes.get(path) !== newHash) {
        fileHashes.set(path, newHash)
        fileChangeEvent.emit(Events.FILE_CHANGED, path)
      }
    })
  })
}

export {
  fileChangeEvent,
  watchFiles,
}
