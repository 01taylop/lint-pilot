import markdownlint from 'markdownlint'

const lintFiles = filePaths => new Promise((resolve, reject) => {
  markdownlint({
    config: {
      default: true,
    },
    files: filePaths,
  }, (error, results) => {
    if (error) {
      console.error(error.stack)
      reject(error)
    }

    const processedResult = {
      errorCount: 0,
      files: Object.keys(results).length,
      fixableErrorCount: 0,
    }

    Object.entries(results).forEach(([_file, errors]) => {
      processedResult.errorCount += errors.length
      errors.forEach(({ fixInfo }) => {
        if (fixInfo) {
          processedResult.fixableErrorCount += 1
        }
      })
    })

    resolve({
      processedResult,
    })
  })
})

const markdownLib = {
  lintFiles,
}

export default markdownLib
