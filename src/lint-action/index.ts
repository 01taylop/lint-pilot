import { Command } from 'commander'

const lintAction = (program: Command) => {
  program
    .option('-e, --emoji <string>', 'customise the emoji displayed when running lint-pilot', '✈️')
    .option('-t, --title <string>', 'customise the title displayed when running lint-pilot', 'Lint Pilot')

    .option('--fix', 'automatically fix problems', false)
    .option('-w, --watch', 'watch for file changes and re-run the linters', false)

    .option('--cache', 'cache linting results', false)
    .option('--clearCache', 'clear the cache', false)

    .option('--ignore-dirs <directories...>', 'define directories to ignore')
    .option('--ignore-patterns <patterns...>', 'define file patterns to ignore')
    .option('--eslint-include <patterns...>', 'define additional file patterns for ESLint')

    .option('--debug', 'output additional debug information', false)
    .option('--eslint-use-legacy-config', 'use legacy ESLint config', false)

    .action(({ cache, clearCache, debug, emoji, eslintInclude, eslintUseLegacyConfig, fix, ignoreDirs, ignorePatterns, title, watch }) => {
      console.log({ cache, clearCache, debug, emoji, eslintInclude, eslintUseLegacyConfig, fix, ignoreDirs, ignorePatterns, title, watch })
    })
}

export default lintAction
