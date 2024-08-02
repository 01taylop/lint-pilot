import chalk from 'chalk'
import logSymbols from 'log-symbols'

import { type FormattedResult, RuleSeverity } from '@Types'

interface Result {
  column?: number
  lineNumber: number
  message: string
  rule: string
  severity: RuleSeverity
}

const formatResult = ({ column, lineNumber, message, rule, severity }: Result): FormattedResult => ({
  message,
  messageTheme: chalk.white,
  position: column ? `${lineNumber}:${column}` : lineNumber.toString(),
  positionTheme: chalk.dim,
  rule: rule,
  ruleTheme: chalk.dim,
  severity: severity === RuleSeverity.WARNING ? logSymbols.warning : logSymbols.error,
})

const pluralise = (word: string, count: number) => count === 1 ? word : `${word}s`

export {
  formatResult,
  pluralise,
}
