import chalk from 'chalk'

import { RuleSeverity } from '@Types/lint'

import type { FormattedResult } from '@Types/lint'

interface Result {
  column?: number
  line?: number
  message: string
  rule: string
  severity: RuleSeverity
}

const formatResult = ({ column, line = 0, message, rule, severity }: Result): FormattedResult => ({
  message: message.trim(),
  messageTheme: chalk.white,
  position: column ? `${line}:${column}` : line.toString(),
  positionTheme: chalk.dim,
  rule,
  ruleTheme: chalk.dim,
  severity: severity === RuleSeverity.WARNING ? '  ⚠' : '  ×',
  severityTheme: severity === RuleSeverity.WARNING ? chalk.yellow : chalk.red,
})

export {
  formatResult,
}
