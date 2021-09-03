import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'

class JWT {
    async checkJWT(req: Request, res: Response, next: NextFunction) {
        const cookies = req.headers.cookie
        const token = await <any>cookies?.split('=')

        try {
            if (token[0] === 'token') {
                const user = await <any>verify(token[1], 'SECRET')

                if (user) {
                    res.locals.token = user.user

                    next()
                } else {
                    res.clearCookie('token')
                    res.redirect('/login')
                }
            }
        } catch (error) {
            res.clearCookie('token')
            res.redirect('/login')
        }
    }
}

const jwt = new JWT()
export default jwt