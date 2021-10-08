import { Request, Response } from 'express'
import User from '../models/user'
import { sign } from 'jsonwebtoken'
import { compareSync } from 'bcrypt'
import { validationResult } from 'express-validator'
import Restaurant from '../models/restaurant'

class AuthController {
    async postLoginUser(req: Request, res: Response) {
        const errors = validationResult(req)
        const body = req.body
        let user

        try {
            if (!errors.isEmpty()) {
                return res.status(200).render('auth/login', {
                    title: 'Login',
                    errors: errors.array()
                })
            }

            const query = `
                SELECT users.*
                FROM users
                WHERE email='${body.email}'
            `

            const emailUser = await User.findBy(query)

            if (!emailUser) {
                return res.render('auth/login', {
                    title: 'Login',
                    status: 304,
                    errorMessage: 'Usuario no encontrado o contraseña incorrecta'
                })
            }

            if (!compareSync(`${body.pass}`, `${emailUser.pass}`)) {
                return res.render('auth/login', {
                    title: 'Login',
                    status: 304,
                    errorMessage: 'Usuario no encontrado o contraseña incorrecta'
                })
            }

            switch (emailUser?.usertype) {
                case 'M':

                    const verifiedManager = await User.findByVerified(`${emailUser.id_user}`)

                    if (!verifiedManager) {
                        return res.render('auth/login', {
                            title: 'Login',
                            status: 304,
                            errorMessage: 'Cuenta esperando para ser aprobada'
                        })
                    }

                    const restaurant = await Restaurant.findWithUser(emailUser.id_user)

                    if (restaurant) {
                        user = {
                            id_user: emailUser.id_user,
                            email: emailUser.email,
                            name: emailUser.name + " " + emailUser.lastname,
                            usertype: emailUser.usertype,
                            image: emailUser.image,
                            lastpurchase: emailUser.lastpurchase,
                            id_restaurant: restaurant?.id_restaurant,
                            resturantName: restaurant?.name
                        }

                        const token = sign({ user }, 'SECRET', { expiresIn: '1h' })

                        res.cookie('token', token, {
                            httpOnly: false
                        })

                        return res.redirect('/api/restaurants/getManagerPage')
                    }

                    if (!restaurant) {

                        user = {
                            user: emailUser.id_user,
                            email: emailUser.email,
                            name: emailUser.name + " " + emailUser.lastname,
                            usertype: emailUser.usertype,
                            image: emailUser.image,
                            lastpurchase: emailUser.lastpurchase
                        }

                        const token = sign({ user }, 'SECRET', { expiresIn: '1h' })

                        res.cookie('token', token, {
                            httpOnly: false
                        })

                        res.redirect('/api/restaurants/postNewRestaurant')
                    }

                    break
                case 'CA':
                case 'CO':
                    const verifiedCooker = await User.findById(`${emailUser.id_user}`)

                    if (!verifiedCooker) {
                        return res.render('auth/login', {
                            title: 'Login',
                            status: 304,
                            errorMessage: 'Usuario no existe o contraseña incorrecta'
                        })
                    }

                    const restaurantCooker = await User.findById(emailUser.id_user)

                    if (restaurantCooker) {
                        user = {
                            id_user: emailUser.id_user,
                            email: emailUser.email,
                            name: emailUser.name + " " + emailUser.lastname,
                            usertype: emailUser.usertype,
                            id_restaurant: restaurantCooker?.id_restaurant
                        }

                        const token = sign({ user }, 'SECRET', { expiresIn: '1h' })

                        res.cookie('token', token, {
                            httpOnly: false
                        })
                        
                        if (emailUser?.usertype === 'CO') {
                            res.redirect('/api/orders/getAllTodayOrdersCookerPage')
                        }

                        if (emailUser?.usertype === 'CA') {
                            res.redirect('/api/orders/getNewOrderPage')
                        }
                    } else {
                        return res.render('auth/login', {
                            title: 'Login',
                            status: 304,
                            errorMessage: 'Error al cargar la información del restaurante'
                        })
                    }
                    break
                case 'A':
                    const admin = await User.findById(emailUser.id_user)

                    if (!admin) {
                        return res.render('auth/login', {
                            title: 'Login',
                            status: 304,
                            errorMessage: 'Usuario no existe o contraseña incorrecta'
                        })
                    }

                    if (admin) {
                        user = {
                            id_user: emailUser.id_user,
                            email: emailUser.email,
                            name: emailUser.name + " " + emailUser.lastname,
                            usertype: emailUser.usertype,
                            image: emailUser.image,
                        }

                        const token = sign({ user }, 'SECRET', { expiresIn: '1h' })

                        res.cookie('token', token, {
                            httpOnly: false
                        })

                        return res.redirect('/api/admin/getAdminDashboardPage')
                    }
                    break
            }
        } catch (error) {
            if (error) console.log(error)

            res.render('auth/login', {
                title: 'Login',
                status: 304,
                errorMessage: 'Error al loguearse'
            })
        }
    }

    async getLogoutUser(req: Request, res: Response) {
        res.clearCookie('token')
        res.redirect('/')
    }

    getNotPermissionsPage(req: Request, res: Response) {
        const profile = res.locals.profile
        profile.title = 'No authorization'

        res.render('permission', profile)
    }
}

export const authController = new AuthController()