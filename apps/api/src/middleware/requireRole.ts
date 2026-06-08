import { Request, Response, NextFunction } from 'express'
import { UserRole } from '@hesperedia/shared-types'

const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.SUBSCRIBER]: 0,
  [UserRole.EDITOR]: 1,
  [UserRole.ADMIN]: 2,
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: { message: 'Authentication required' } })
      return
    }

    const userLevel = ROLE_HIERARCHY[req.user.role as UserRole] ?? -1
    const minRequired = Math.min(...roles.map((r) => ROLE_HIERARCHY[r]))

    if (userLevel >= minRequired) {
      next()
    } else {
      res.status(403).json({ error: { message: 'Insufficient permissions' } })
    }
  }
}
