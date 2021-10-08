import { Request, Response } from 'express'
import { IManager } from '../interfaces/IUsers'
import User from '../models/user'
import { genSaltSync, hashSync } from 'bcrypt'
import { validationResult } from 'express-validator'

class UserControllers {
    //Manager controllers
    async postNewManager(req: Request, res: Response) {
        const errors = validationResult(req)

        const queryObj: IManager = req.body
        queryObj.usertype = 'M'
        queryObj.active = 1
        queryObj.verified = 'UNVERIFIED'

        const salt = genSaltSync(10)
        const hashPass = hashSync(`${queryObj.pass}`, salt)
        queryObj.pass = hashPass

        if (queryObj.email === undefined) {
            return res.json({
                status: 304,
                errorMessage: 'Envie el dato email'
            })
        }

        const query = `
            SELECT users.*
            FROM users
            WHERE email='${queryObj.email}'
        `

        const manager = await User.findBy(query)

        if (manager) {
            return res.json({
                status: 304,
                message: 'El email ya se encuentra registrado'
            })
        }

        if (queryObj.pass === req.body.confpass) {
            return res.json({
                status: 304,
                message: 'Las contraseñas no coinciden'
            })
        }

        try {
            if (!errors.isEmpty()) {
                delete queryObj.pass

                return res.status(200).render('restaurants/registration', {
                    title: 'Pagina de registro de restaurant',
                    errors: errors.array(),
                    user: queryObj,
                    loginIn: false
                })
            }
            delete queryObj.confpass

            const manager = new User()
            //await manager.save(queryObj)

            setTimeout(function () {
                res.redirect('/login')
            }, 4000)
        } catch (error) {
            if (error) console.log(error)

            res.json({
                errorMessage: 'Error al registrar al encargado'
            })
        }
    }

    async getManagerExistsByEmail(req: Request, res: Response) {
        const { email } = req.body

        try {
            const query = `
                SELECT users.*
                FROM users
                WHERE email='${email}'
            `

            const manager = await User.findBy(query)

            if (manager) {
                res.json({
                    status: 200,
                    message: 'El el correo electrónico ya se encuentra registrado'
                })
            } else {
                res.json({
                    status: 304,
                    message: 'Email not found'
                })
            }
        } catch (error) {
            if (error) console.log(error)

            res.json({
                errorMessage: 'Error al buscar el correo electrónico'
            })
        }
    }

    async getUserByEmail(req: Request, res: Response) {
        const user = res.locals.token
        const { email } = req.params

        try {
            if (email === null || email === '' || email === undefined) {
                return res.json({
                    status: 304,
                    message: 'Debe enviar un correo electrónico valido'
                })
            }
            const stringEmail = email.toString()
            const emailQuery = `
                SELECT email
                FROM users
                WHERE email='${stringEmail}'
            `
            const searchEmail = await User.findBy(emailQuery)
            
            if (searchEmail) {
                return res.json({
                    status: 304,
                    message: 'Correo electrónico ya se encuentra registrado'
                })
            }

            res.json({
                status: 200,
                message: 'Correo electrónico disponible'
            })
        } catch (error) {
            if (error) console.log(error)

            res.json({
                status: 304,
                message: 'Error al buscar el correo electrónico'
            })
        }
    }
}

export const userControllers = new UserControllers()