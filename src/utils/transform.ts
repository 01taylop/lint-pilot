import chalk from 'chalk'
import logSymbols from 'log-symbols'

import { type FileLog, LogType } from '@Types'

interface ProcessLog {
  column?: number
  lineNumber: number
  message: string
  rule: string
  type: LogType
}

const formatFileLog = ({ column, lineNumber, message, rule, type }: ProcessLog): FileLog => ({
  message: message.length > 72 ? `${message.substring(0, 69)}...` : message,
  messageTheme: chalk.white,
  position: column ? `${lineNumber}:${column}` : lineNumber.toString(),
  positionTheme: chalk.dim,
  rule: rule,
  ruleTheme: chalk.dim,
  type: type === LogType.WARNING ? logSymbols.warning : logSymbols.error,
})

const pluralise = (word: string, count: number) => count === 1 ? word : `${word}s`

export {
  formatFileLog,
  pluralise,
}
