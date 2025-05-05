import { glob } from 'glob'

import colourLog from '@Utils/colour-log'
import { pluralise } from '@Utils/transform'

import type { Linter } from '@Types/lint'

interface SourceFiles {
  filePattern: Array<string>
  ignore: Array<string>
  linter: Linter
}

const sourceFiles = async ({ filePattern, ignore, linter }: SourceFiles) => {
  try {
    if (!filePattern.length) {
      colourLog.error(`No file patterns provided for ${linter}.`)
      process.exit(1)
    }

    const files = await glob(filePattern, { ignore })

    if (!files.length) {
      colourLog.info(`\nNo files found matching "${filePattern}" for ${linter}.`)
      return []
    }

    colourLog.configDebug(`Sourced ${files.length} ${pluralise('file', files.length)} matching "${filePattern}" for ${linter}:`, files)
    return files
  } catch (error) {
    colourLog.error(`An error occurred while sourcing files for ${linter} matching ${filePattern}`, error)
    process.exit(1)
  }
}

export default sourceFiles
