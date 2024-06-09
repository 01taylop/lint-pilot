// import formatter from 'stylelint-formatter-pretty'
import stylelint from 'stylelint'

const lintFiles = async filePaths => {
  try {
    const { results, ruleMetadata } = await stylelint.lint({
      allowEmptyInput: true,
      config: {
        rules: {
          'declaration-block-no-duplicate-properties': true,
        },
      },
      files: filePaths,
    })

    const processedResult = {
      deprecatedRules: [],
      errorCount: 0,
      files: results.length,
      fixableErrorCount: 0,
    }

    results.forEach(({ deprecations, warnings }) => {
      processedResult.deprecatedRules = [...new Set([...processedResult.deprecatedRules, ...deprecations])]
      processedResult.errorCount += warnings.length
      warnings.forEach(({ rule }) => {
        if (ruleMetadata[rule]?.fixable) {
          processedResult.fixableErrorCount += 1
        }
      })
    })

    // const formattedResults = formatter(results)
    // console.log(formattedResults)

    return {
      processedResult,
    }
  } catch (error) {
    console.error(error.stack)
  }
}

const stylelintLib = {
  lintFiles,
}

export default stylelintLib
