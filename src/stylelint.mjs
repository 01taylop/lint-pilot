import formatter from 'stylelint-formatter-pretty'
import stylelint from 'stylelint'

const lintFiles = async filePaths => {
  try {
    const { results } = await stylelint.lint({
      allowEmptyInput: true,
      config: {
        rules: {
          'declaration-block-no-duplicate-properties': true,
        },
      },
      files: filePaths,
    })

    const formattedResults = formatter(results)
    console.log(formattedResults)
  }
  catch (error) {
    console.error(error.stack)
  }
}

const stylelintLib = {
  lintFiles,
}

export default stylelintLib
