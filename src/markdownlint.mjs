import markdownlint from 'markdownlint'

const lintFiles = async filePaths => {
  await markdownlint({
    config: {
      default: true,
    },
    files: filePaths,
  }, (error, result) => {
    if (error) {
      console.error(error.stack)
      return
    }

    console.log(result.toString())
  })

  return
}

const markdownLib = {
  lintFiles,
}

export default markdownLib
