import fs from 'node:fs'
import path from 'node:path'

import { Linter } from '@Types/lint'
import colourLog from '@Utils/colour-log'

const CACHE_DIRECTORY = '.cache/lint'

const clearCacheDirectory = (linter?: Linter) => {
  const cacheDirectory = path.resolve(process.cwd(), CACHE_DIRECTORY, linter?.toLowerCase() || '')

  if (fs.existsSync(cacheDirectory)) {
    fs.rmSync(cacheDirectory, {
      force: true,
      recursive: true,
    })
    colourLog.info(`Cache cleared${linter ? ` for ${linter}` : ''}.\n`)
  } else {
    colourLog.info(`No cache to clear${linter ? ` for ${linter}` : ''}.\n`)
  }
}

const getCacheDirectory = (linter: Linter) => path.resolve(process.cwd(), CACHE_DIRECTORY, linter?.toLowerCase())

export {
  clearCacheDirectory,
  getCacheDirectory,
}
