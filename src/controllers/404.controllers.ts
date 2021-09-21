import { Request, Response } from 'express'
import { verify } from 'jsonwebtoken'

class Error404 {
    async get404Page(req: Request, res: Response) {
        const cookies = req.headers.cookie
        const token = await <any>cookies?.split('=')

        try {
            if (token[0] === 'token') {
                const user = await <any>verify(token[1], 'SECRET')

                if (user.user) {
                    switch (user.user.usertype) {
                        case 'M':
                            res.status(404).render('404', {
                                title: 'Error 404. Página no encontrada',
                                user: user.user,
                                manager: true,
                                loggedIn: true
                            })
                            break
                        case 'CO':
                            res.status(404).render('404', {
                                title: 'Error 404. Página no encontrada',
                                user: user.user,
                                cooker: true,
                                loggedIn: true
                            })
                            break
                        case 'A':
                            res.status(404).render('404', {
                                title: 'Error 404. Página no encontrada',
                                user: user.user,
                                admin: true,
                                loggedIn: true
                            })
                            break
                        default:
                            res.status(404).render('404', {
                                title: 'Error 404. Página no encontrada'
                            })
                            break
                    }
                }
            } else {
                res.status(404).render('404', {
                    title: 'Error 404. Página no encontrada'
                })
            }
        } catch (error) {
            res.status(404).render('404', {
                title: 'Error al cargar la página'
            })
        }
    }
}

export const error404 = new Error404()