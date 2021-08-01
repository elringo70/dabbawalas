import { query, Request, Response } from 'express'
import { ICustomer } from '../interfaces/IUsers'
import User from '../models/user'
import { genSaltSync, hashSync } from 'bcrypt'
import { validationResult } from 'express-validator'

class UserControllers {

    //Customer Controllers
    async postNewCustomer(req: Request, res: Response) {
        const queryObj: ICustomer = req.body
        queryObj.usertype = 'C'
        queryObj.active = 1
        queryObj.verified = 'UNVERIFIED'

        const customer = await User.findBy('email', queryObj.email)

        try {
            if (customer) {
                return res.json({
                    status: 304,
                    message: 'El email ya se encuentra registrado'
                })
            }

            const user = new User()
            await user.save(queryObj)

            res.status(201).json({
                message: 'Usuario almacenado exitosamente'
            })
        } catch (error) {
            if (error) console.log(error)

            res.json({
                errorMessage: 'Error al registrar al usuario'
            })
        }
    }

    async postNewManager(req: Request, res: Response) {
        const errors = validationResult(req)

        const queryObj: ICustomer = req.body
        queryObj.usertype = 'M'
        queryObj.active = 1
        queryObj.verified = 'UNVERIFIED'

        const salt = genSaltSync(10)
        const hashPass = hashSync(`${queryObj.pass}`, salt)
        queryObj.pass = hashPass

        const manager = await User.findBy('email', queryObj.email)

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
            await manager.save(queryObj)
            
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

    async getCustomerBy(req: Request, res: Response) {
        const { option, email } = req.body

        try {
            const customer = await User.findBy(option, email)

            if (!customer) {
                return res.json({
                    status: 400,
                    messages: 'Usuario no encontrado'
                })
            }

            res.json({
                status: 200,
                customer
            })
        } catch (error) {
            if (error) console.log(error)

            res.json({
                errorMessage: 'Error al buscar al cliente'
            })
        }
    }

    async getManagerExistsByEmail(req: Request, res: Response) {
        const { email } = req.body

        try {
            const manager = await User.findBy('email', email)

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

    async getCustomerByEmail(req: Request, res: Response) {
        const { email } = req.body

        try {
            const emailCustomer = await User.findBy('email', email)

            if (emailCustomer) {
                res.json(emailCustomer?.email)
            } else {
                res.status(304)
            }
        } catch (error) {
            if (error) console.log(error)

            res.json({
                errorMessage: 'Error al buscar el correo electrónico'
            })
        }
    }

    async getCustomerById(req: Request, res: Response) {
        const { id } = req.params

        try {
            const customer = await User.findById(id)

            if (!customer) {
                return res.status(400).json({
                    messages: 'Usuario no encontrado'
                })
            }

            res.status(200).json(customer)
        } catch (error) {
            if (error) console.log(error)

            res.json({
                errorMessage: 'Error al buscar al usuario'
            })
        }
    }

    async getAllCustomers(req: Request, res: Response) {
        try {
            const customers = await User.fetchAll()

            res.status(200).json(customers)
        } catch (error) {
            if (error) console.log(error)

            res.json({
                errorMessage: 'Error obtener todos los usuarios'
            })
        }
    }

    async updateCustomerById(req: Request, res: Response) {
        const queryObj: ICustomer = req.body
        queryObj.usertype = 'C'
        queryObj.active = 1

        const { id } = req.params

        try {
            const customer = await User.findById(id)

            if (!customer) {
                return res.status(400).json({
                    messages: 'Cliente no encontrado'
                })
            }

            const updatedCustomer = new User()
            await updatedCustomer.updateById(id, queryObj)

            res.status(200).json({
                message: 'Cliente actualizado'
            })
        } catch (error) {
            if (error) console.log(error)

            res.json({
                errorMessage: 'Error al actualizar al cliente'
            })
        }
    }

    //
}

export const userControllers = new UserControllers()