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

const formatFileLog = ({ column, lineNumber, message, rule, type }: ProcessLog): FileLog => {
  const logMessage = message.length > 72 ? `${message.substring(0, 69)}...` : message
  const logPosition = column ? `${lineNumber}:${column}` : lineNumber
  const typeSymbol = type === LogType.WARNING ? logSymbols.warning : logSymbols.error

  return {
    message: ` ${logMessage} `,
    messageTheme: chalk.white,
    position: ` ${logPosition} `,
    positionTheme: chalk.dim,
    rule: ` ${rule}`,
    ruleTheme: chalk.dim,
    type: `${typeSymbol} `,
  }
}

const pluralise = (word: string, count: number) => count === 1 ? word : `${word}s`

export {
  formatFileLog,
  pluralise,
}
