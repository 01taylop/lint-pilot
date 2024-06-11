import { glob } from 'glob'

import colourLog from './colour-log.mjs'

const sourceFiles = async (pattern, { debug, ignore, linter }) => {
  try {
    const files = await glob(pattern, { ignore })
    if (debug) {
      colourLog.files(linter, pattern, files)
    }
    return files
  } catch (error) {
    console.error(`Error occurred while trying to source files matching ${pattern}`, error)
    process.exit(1)
  }
}

export {
  sourceFiles,
}
