import { type Linter } from '@Constants'

declare global {

  interface ProcessedResult {
    deprecatedRules: Array<string>
    errorCount: number
    files: number
    fixableErrorCount: number
    fixableWarningCount: number
    linter: Linter
    warningCount: number
  }

  interface LinterResult {
    processedResult: ProcessedResult
  }

}

export {}
