import chalk from 'chalk'

import { RuleSeverity } from '@Types/lint'

import type { FormattedResult } from '@Types/lint'

interface Result {
  column?: number
  lineNumber: number
  message: string
  rule: string
  severity: RuleSeverity
}

const formatResult = ({ column, lineNumber, message, rule, severity }: Result): FormattedResult => ({
  message: message.trim(),
  messageTheme: chalk.white,
  position: column ? `${lineNumber}:${column}` : lineNumber.toString(),
  positionTheme: chalk.dim,
  rule,
  ruleTheme: chalk.dim,
  severity: severity === RuleSeverity.WARNING
    ? chalk.yellow('  ⚠')
    : chalk.red('  ×'),
})

export {
  formatResult,
}
