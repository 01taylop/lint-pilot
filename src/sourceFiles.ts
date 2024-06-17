import { glob } from 'glob'

import { Linter } from '@Types'
import { pluralise } from '@Utils/transform'

interface SourceFiles {
  debug: boolean
  filePattern: string
  ignore: string
  linter: Linter
}

const sourceFiles = async ({ debug, filePattern, ignore, linter }: SourceFiles) => {
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

export default sourceFiles
