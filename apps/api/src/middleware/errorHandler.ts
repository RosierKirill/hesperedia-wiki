import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ZodError) {
    const details: Record<string, string[]> = {}
    err.errors.forEach((e) => {
      const key = e.path.join('.')
      details[key] = details[key] ?? []
      details[key].push(e.message)
    })
    res.status(400).json({ error: { message: 'Validation error', code: 'VALIDATION_ERROR', details } })
    return
  }

  if (err instanceof Error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(err)
    }
    const status = (err as Error & { status?: number }).status ?? 500
    res.status(status).json({ error: { message: err.message || 'Internal server error' } })
    return
  }

  res.status(500).json({ error: { message: 'Internal server error' } })
}
