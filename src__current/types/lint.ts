/*
 * LINTING
 */

interface FilePatterns {

}

interface LintFilesOptions {
  cache: boolean
  eslintUseLegacyConfig?: boolean
  files: Array<string>
  fix: boolean
}

export type {
  FilePatterns,
  LintFilesOptions,
}
