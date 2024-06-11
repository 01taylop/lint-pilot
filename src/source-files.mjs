import { glob } from 'glob'

import { pluralise } from './utils.mjs'

const sourceFiles = async ({ debug, filePattern, ignore, linter }) => {
  try {
    const files = await glob(filePattern, { ignore })
    if (debug) {
      console.log(`\nSourced ${files.length} ${pluralise('file', files.length)} matching "${filePattern}" for ${linter}:`)
      console.log(files)
    }
    return files
  } catch (error) {
    console.error(`Error occurred while trying to source files matching ${filePattern}`, error)
    process.exit(1)
  }
}

export {
  sourceFiles,
}
