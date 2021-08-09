import { Request, Response } from 'express'
import { ICustomer } from '../interfaces/IUsers'
import User from '../models/user'
import { sign } from 'jsonwebtoken'
import { compareSync } from 'bcrypt'
import { validationResult } from 'express-validator'

class AuthController {
    async postLoginUser(req: Request, res: Response) {
        const errors = validationResult(req)
        const queryObj: ICustomer = req.body

        try {
            if (queryObj.email === undefined) {
                return res.json({
                    status: 304,
                    errorMessage: 'Envie el dato email'
                })
            }

            const user = await User.findBy('email', queryObj.email)
            
            if (!errors.isEmpty()) {
                return res.status(200).render('auth/login', {
                    title: 'Login',
                    errors: errors.array()
                })
            }

            if (!user) {
                return res.render('auth/login', {
                    title: 'Login',
                    status: 304,
                    errorMessage: 'Usuario no encontrado o contraseña incorrecta'
                })
            }

            if (!compareSync(`${queryObj.pass}`, `${user.pass}`)) {
                res.render('auth/login', {
                    title: 'Login',
                    status: 304,
                    errorMessage: 'Usuario no encontrado o contraseña incorrecta'
                })
            } else {
                const verifiedUser = await User.findByVerified(`${user.id_user}`)

                if (!verifiedUser) {
                    return res.render('auth/login', {
                        title: 'Login',
                        status: 304,
                        errorMessage: 'El correo electrónico aun no ha sido verificado'
                    })
                }

                delete user.pass

                const token = sign({ user }, 'SECRET', { expiresIn: '1h' })

                res.cookie('token', token, {
                    httpOnly: false
                })

                res.redirect('/api/restaurants/manager')
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