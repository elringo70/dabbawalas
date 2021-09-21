import { Request, Response, NextFunction } from 'express'

export const checkRole = (roles: Array<string>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const user = res.locals.token

        if (roles.includes(user.usertype)) {
            next()
        } else {
            switch (user.usertype) {
                case 'CO':
                    res.render('permission', {
                        title: 'Sin permisos',
                        errorMessage: 'El usuario no tiene permisos para esta página',
                        user,
                        active: true,
                        loggedIn: true,
                        cooker: true
                    })

                    break
                case 'M':
                    res.render('permission', {
                        title: 'Sin permisos',
                        errorMessage: 'El usuario no tiene permisos para esta página',
                        user,
                        active: true,
                        loggedIn: true,
                        manager: true
                    })

                    break
            }
        }
    }
}