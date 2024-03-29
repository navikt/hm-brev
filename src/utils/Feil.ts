import { logError } from './logging'

export class Feil extends Error {
  public code: number
  public error?: Error
  constructor(message: string, code: number, error?: Error) {
    super(message)
    this.code = code
    this.error = error

    logError(message)
  }
}
