import { glob } from 'glob'

import { Linter } from '@Types'
import colourLog from '@Utils/colourLog'
import { pluralise } from '@Utils/transform'

interface SourceFiles {
  filePattern: string
  ignore: string
  linter: Linter
}

const sourceFiles = async ({ filePattern, ignore, linter }: SourceFiles) => {
  try {
    const files = await glob(filePattern, { ignore })
    colourLog.configDebug(`Sourced ${files.length} ${pluralise('file', files.length)} matching "${filePattern}" for ${linter}:`, files)
    return files
  } catch (error) {
    colourLog.error(`An error occurred while trying to source files matching ${filePattern}`, error)
    process.exit(1)
  }
}

export default sourceFiles
