#!/usr/bin/env node
import { exitHandler } from './exit-handler'
import { createProgram } from './program'

import type { FSWatcher } from 'chokidar'

let watcher: FSWatcher | undefined

process.on('SIGINT', () => exitHandler(0, 'SIGINT', watcher))
process.on('SIGTERM', () => exitHandler(0, 'SIGTERM', watcher))
process.on('uncaughtException', error => exitHandler(1, 'Unexpected Error', watcher, error))
process.on('unhandledRejection', error => exitHandler(1, 'Unhandled Promise', watcher, error))

const program = createProgram({
  setWatcher: (w: FSWatcher) => { watcher = w },
})

program.parseAsync(process.argv)
