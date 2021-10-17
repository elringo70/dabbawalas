import { Request, Response, NextFunction } from 'express'
import { verify, sign } from 'jsonwebtoken'

class JWT {
    async checkJWT(req: Request, res: Response, next: NextFunction) {
        const cookies = req.headers.cookie
        
        try {
            const token = await <any>cookies?.split('=')
            
            if (token[0] === 'token') {
                const user = await <any>verify(token[1], 'SECRET')

                if (user.user.usertype !== null) {
                    const newToken = sign({ user: user.user }, 'SECRET', { expiresIn: '1h' })
                    const newUser = await <any>verify(newToken, 'SECRET')

                    res.locals.token = newUser.user

                    let profile: any = {
                        user: newUser.user,
                        active: true,
                        loggedIn: true
                    }

                    switch(newUser.user.usertype) {
                        case 'A':
                            profile.admin = true
                            break
                        case 'M':
                            profile.manager = true
                            break
                        case 'CO':
                            profile.cooker = true
                            break
                        case 'CA':
                            profile.cashier = true
                            break
                    }

                    res.locals.profile = profile                    

                    res.clearCookie('token')
                    res.cookie('token', newToken, {
                        httpOnly: false
                    })

                    next()
                } else {
                    res.clearCookie('token')
                    res.redirect('/login')
                }
            } else {
                res.clearCookie('token')
                res.redirect('/login')
            }
        } catch (error) {
            res.clearCookie('token')
            res.redirect('/login')
        }
    }
}

const jwt = new JWT()
export default jwt