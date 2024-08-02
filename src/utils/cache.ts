import fs from 'node:fs'
import path from 'node:path'

import colourLog from './colourLog'

const CACHE_FOLDER = '.lintpilotcache'

const clearCacheDirectory = () => {
  const cacheDirectory = path.resolve(process.cwd(), CACHE_FOLDER)

  if (fs.existsSync(cacheDirectory)) {
    fs.rmSync(cacheDirectory, {
      force: true,
      recursive: true,
    })
    colourLog.info('Cache cleared.\n')
  } else {
    colourLog.info('No cache to clear.\n')
  }
}

const getCacheDirectory = (file: string) => path.resolve(process.cwd(), CACHE_FOLDER, file)

export {
  clearCacheDirectory,
  getCacheDirectory,
}
