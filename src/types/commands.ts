interface LintCommandOptions {
  cache: boolean
  clearCache: boolean
  debug: boolean
  emoji: string
  eslintInclude?: string | Array<string>
  eslintUseLegacyConfig: boolean
  fix: boolean
  ignoreDirs?: string | Array<string>
  ignorePatterns?: string | Array<string>
  title: string
  watch: boolean
}

export type {
  LintCommandOptions,
}
