import type { Request, Response, NextFunction, RequestHandler } from 'express'

export const adminAuth: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization']

  if (authHeader === undefined || authHeader === '') {
    res.status(401).json({ error: 'Token requis' })
    return
  }

  const [scheme, token] = authHeader.split(' ')

  if (scheme !== 'Bearer' || token === undefined || token === '') {
    res.status(401).json({ error: 'Token requis' })
    return
  }

  if (token !== process.env['ADMIN_TOKEN']) {
    res.status(403).json({ error: 'Token invalide' })
    return
  }

  next()
}
