import winston from 'winston'

export enum LOG_LEVEL {
  ERROR = 3,
  WARNING = 2,
  INFO = 1,
  DEBUG = 0,
}

export type Meta = Record<string, unknown>

export const stdoutLogger = winston.createLogger({
  format: winston.format.json(),
  level: 'info',
  transports: [new winston.transports.Console()],
})

export const logDebug = (message: string, meta: Meta = {}) => {
  stdoutLogger.debug(message, meta)
}

export const logInfo = (message: string, meta: Meta = {}) => {
  stdoutLogger.info(message, meta)
}

export const logWarn = (message: string, meta: Meta = {}) => {
  stdoutLogger.warn(message, meta)
}

export const logError = (message: string, err?: Error, meta: Meta = {}) => {
  stdoutLogger.error(message, { ...meta, ...(err && { message: `: ${err?.message || err}` }) })
}
