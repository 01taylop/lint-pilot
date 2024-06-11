import { glob } from 'glob'

const sourceFiles = async (pattern, ignore) => {
  try {
    const files = await glob(pattern, { ignore })
    return files
  } catch (error) {
    console.error(`Error occurred while trying to source files matching ${pattern}`, error)
    process.exit(1)
  }
}

export {
  sourceFiles,
}
