import { Request, Response } from 'express'
import { ICustomer } from '../interfaces/IUsers'
import User from '../models/user'
import { sign } from 'jsonwebtoken'
import { compareSync } from 'bcrypt'
import { validationResult } from 'express-validator'
import Restaurant from '../models/restaurant'

class AuthController {
    async postLoginUser(req: Request, res: Response) {
        const errors = validationResult(req)
        const queryObj: ICustomer = req.body

        let user

        try {
            if (queryObj.email === undefined) {
                return res.render('auth/login', {
                    title: 'Login',
                    status: 304,
                    errorMessage: 'Envie el dato email'
                })
            }

            const emailUser = await User.findBy('email', queryObj.email)

            if (!errors.isEmpty()) {
                return res.status(200).render('auth/login', {
                    title: 'Login',
                    errors: errors.array()
                })
            }

            if (!emailUser) {
                return res.render('auth/login', {
                    title: 'Login',
                    status: 304,
                    errorMessage: 'Usuario no encontrado o contraseña incorrecta'
                })
            }

            if (!compareSync(`${queryObj.pass}`, `${emailUser.pass}`)) {
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
                            errorMessage: 'El supervisor no ha sido aun no ha sido verificado'
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

                        return res.redirect('/api/restaurants/manager')
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

                        res.redirect('/api/restaurants/manager')
                    }
                    
                    break
            }
        } catch (error) {
            if (error) console.log(error)

            res.json({
                errorMessage: 'Error al loguearse en el sistema'
            })
        }
    }

    async getLogoutUser(req: Request, res: Response) {
        res.clearCookie('token')
        res.redirect('/')
    }

    async postEmailConfirmation(req: Request, res: Response) {

    }
}

export const authController = new AuthController()