import { Request, Response } from 'express'
import { verify } from 'jsonwebtoken'

class IndexControllers {
    getIndexPage(req: Request, res: Response) {
        const cookies = <string>req.headers.cookie
        const token = <string[]>cookies?.split('=')

        if (token != null || token != undefined) {
            let jwtPayLoad

            try {
                jwtPayLoad = <any>verify(token[1], 'SECRET')
                if (jwtPayLoad) {
                    res.redirect('/api/restaurants/manager')
                }
            } catch (error) {
                console.log(error)
            }
        }

        res.render('index', {
            title: 'Pagina principal',
            loggedIn: false
        })
    }

    getRestaurantIndexPage(req: Request, res: Response) {
        res.render('restaurants/index', {
            title: 'Dabbawalas Restaurant',
            loginIn: false
        })
    }

    getRestaurantRegistration(req: Request, res: Response) {
        res.status(200).render('restaurants/registration', {
            title: 'Pagina de registro de restaurant',
            loginIn: false
        })
    }

    async getLoginPage(req: Request, res: Response) {
        const cookies = req.headers.cookie

        try {
            if (cookies) {
                const token = await <any>cookies?.split('=')
                const user = await <any>verify(token[1], 'SECRET')

                if (user) {
                    res.redirect('/api/restaurants/manager')
                } else {
                    res.clearCookie('token')
                    res.redirect('/login')
                }
            }

            res.status(200).render('auth/login', {
                title: 'Login',
                loginIn: false
            })
        } catch (error) {
            if (error) console.log(error)

            res.json({
                errorMessage: 'Error al cargar la pagina de login'
            })
        }
    }
}

export const indexControllers = new IndexControllers()