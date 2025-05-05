import fs from 'node:fs'
import path from 'node:path'

import colourLog from './colour-log'

type CacheSubDirectory = 'eslint' | 'stylelint'

const CACHE_DIRECTORY = '.lintpilotcache'

const clearCacheDirectory = (subDir?: CacheSubDirectory) => {
  const cacheDirectory = path.resolve(process.cwd(), CACHE_DIRECTORY, subDir || '')

  if (fs.existsSync(cacheDirectory)) {
    fs.rmSync(cacheDirectory, {
      force: true,
      recursive: true,
    })
    colourLog.info(`Cache cleared${subDir ? ` for ${subDir}` : ''}.\n`)
  } else {
    colourLog.info(`No cache to clear${subDir ? ` for ${subDir}` : ''}.\n`)
  }
}

const getCacheDirectory = (subDir: CacheSubDirectory) => path.resolve(process.cwd(), CACHE_DIRECTORY, subDir)

export {
  clearCacheDirectory,
  getCacheDirectory,
}
