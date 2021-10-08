import { Request, Response, NextFunction } from 'express'

export const checkRole = (roles: Array<string>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const user = res.locals.token
        const profile = res.locals.profile

        if (roles.includes(user.usertype)) {
            next()
        } else {
            res.json({
                status: 304,
                message: 'Acceso no autorizado'
            })
        }
    }
}