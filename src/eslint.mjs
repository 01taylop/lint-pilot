import formatter from 'eslint-formatter-pretty'
import { ESLint } from 'eslint'

const lintFiles = async filePaths => {
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: {
      rules: {
        'no-console': 2,
        'no-unused-vars': 2,
      },
    },
  })

  const results = await eslint.lintFiles(filePaths)

  const formattedResults = formatter(results)
  console.log(formattedResults)

  return
}

const eslintLib = {
  lintFiles,
}

export default eslintLib
