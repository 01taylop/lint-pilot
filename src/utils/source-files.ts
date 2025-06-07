import { glob } from 'glob'

import colourLog from '@Utils/colour-log'
import { pluralise } from '@Utils/transform'

import type { FilePatterns, Linter } from '@Types/lint'

type FileList = Array<string>

const sourceFiles = async ({ includePatterns, ignorePatterns }: FilePatterns, linter: Linter): Promise<FileList> => {
  try {
    const include = includePatterns[linter]

    if (!include.length) {
      colourLog.warning(`\nNo file patterns provided for ${linter}. Skipping.`)
      return []
    }

    const files = [...new Set(await glob(include, {
      ignore: ignorePatterns,
    }))]

    if (!files.length) {
      colourLog.info(`\nNo files found for ${linter}.`)
      return []
    }

    colourLog.configDebug(`Sourced ${files.length} ${pluralise('file', files.length)} for ${linter}:`, files)
    return files
  } catch (error) {
    colourLog.error(`An error occurred while sourcing files for ${linter}`, error)
    process.exit(1)
  }
}

export default sourceFiles
