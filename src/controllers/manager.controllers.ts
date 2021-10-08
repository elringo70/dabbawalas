import { Request, Response } from 'express'
import { ICashier, IManager } from '../interfaces/IUsers'
import User from '../models/user'
import { genSaltSync, hashSync } from 'bcrypt'
import { validationResult } from 'express-validator'
import { IAddress } from '../interfaces/IAddresses'
import Manager from '../models/manager'
import Customer from '../models/customer'

class ManagerControllers {
    //Manager controllers
    async postNewManager(req: Request, res: Response) {
        const errors = validationResult(req)
        const error = errors.array()
        const body = req.body

        try {
            if (!errors.isEmpty()) {
                return res.json({
                    status: 304,
                    message: error[0].msg
                })
            }

            const query = `
                SELECT email
                FROM users
                WHERE email='${body.email}'
                AND usertype='M'
            `
            const managerEmail = await User.findBy(query)

            if (managerEmail) {
                return res.json({
                    status: 200,
                    message: 'El correo electrónico ya se encuentra registrado'
                })
            }

            if (body.pass !== body.confpass) {
                return res.json({
                    status: 304,
                    message: 'Las constraseñas no coinciden'
                })
            }

            const salt = genSaltSync(10)
            const hashPass = hashSync(body.pass, salt)

            const managerObject: IManager = {
                name: body.name.toUpperCase(),
                lastname: body.lastname.toUpperCase(),
                maternalsurname: body.maternalsurname.toUpperCase(),
                dob: body.dob,
                phone: body.phone,
                usertype: 'M',
                active: 1,
                email: body.email,
                pass: hashPass,
                gender: body.gender,
                position: 'Supervisor',
                verified: 'UNVERIFIED',
            }

            const managerAddress: IAddress = {
                id_state: body.state,
                id_city: body.city,
                id_municipality: body.municipality,
                number: body.number,
                street: body.street.toUpperCase()
            }

            const manager = new Manager()
            await manager.save(managerObject, managerAddress)

            res.json({
                status: 201,
                message: 'Supervisor de tienda almacenado con éxito'
            })
        } catch (error) {
            if (error) console.log(error)

            res.json({
                status: 304,
                message: 'Error al registrar al supervisor'
            })
        }
    }

    async getManagerByEmail(req: Request, res: Response) {
        const { email } = req.params
        try {
            const query = `SELECT email FROM users WHERE email='${email}'`

            const managerEmail = await Manager.findBy(query)
            if (managerEmail) {
                return res.json({
                    status: 200,
                    message: 'El correo electrónico ya se encuentra registrado'
                })
            }

            res.json({
                status: 202,
                message: 'Correo electrónico disponible'
            })
        } catch (error) {
            if (error) console.log(error)

            res.json({
                status: 304,
                message: 'Error al buscar el correo electrónico del supervisor'
            })
        }
    }

    async postNewCashierPage(req: Request, res: Response) {
        const user = res.locals.token

        res.render('restaurants/new-cashier', {
            title: 'Registrar un cajero',
            user,
            active: true,
            manager: true,
            loggedIn: true
        })
    }

    async postNewCashier(req: Request, res: Response) {
        const errors = validationResult(req)
        const error = errors.array()
        const user = res.locals.token
        const body = req.body

        try {
            if (!errors.isEmpty()) {
                return res.json({
                    status: 304,
                    message: error[0].msg
                })
            }

            const query = `SELECT email FROM users WHERE email='${body.email}'`
            const findCashier = await User.findBy(query)

            if (findCashier) {
                return res.json({
                    status: 304,
                    message: 'El correo electrónico ya se encuentra en uso'
                })
            }

            const salt = genSaltSync(10)
            const hashPass = hashSync(body.pass, salt)

            const cashierObject: ICashier = {
                name: body.name.toUpperCase(),
                lastname: body.lastname.toUpperCase(),
                maternalsurname: body.maternalsurname.toUpperCase(),
                email: body.email,
                pass: hashPass,
                dob: body.dob,
                phone: body.phone,
                usertype: 'CA',
                active: 1,
                id_restaurant: user.id_restaurant
            }

            const address: IAddress = {
                id_state: body.state,
                id_city: body.city,
                id_municipality: body.municipality,
                number: body.number,
                street: body.street.toUpperCase()
            }

            const cashier = new User()
            await cashier.saveCashier(cashierObject, address)

            res.json({
                status: 200,
                message: 'Cajero guardado con éxito'
            })
        } catch (error) {
            if (error) console.log(error)

            res.json({
                status: 304,
                message: 'Error al guardar al cajero'
            })
        }
    }

    async getCashiersPage(req: Request, res: Response) {
        const user = res.locals.token

        res.render('restaurants/cashiers', {
            title: 'Lista de cajeros',
            user,
            active: true,
            manager: true,
            loggedIn: true
        })
    }

    async getCashiers(req: Request, res: Response) {
        const user = res.locals.token

        try {
            const query = `
                SELECT
                    users.id_user, users.email, users.name, users.lastname, users.maternalsurname,
                    users.dob, users.phone, users.usertype, users.active, 
                    users.id_restaurant, users.id_address,
                    estados.nombre AS state,
                    estados.id AS id_state,
                    municipios.nombre AS city,
                    municipios.id AS id_city,
                    colonias.nombre AS municipality,
                    colonias.id AS id_municipality,
                    addresses.number, 
                    addresses.street
                FROM users
                LEFT JOIN addresses
                    ON users.id_address = addresses.id_address
                JOIN estados
                    ON addresses.id_state = estados.id
                JOIN municipios
                    ON addresses.id_city = municipios.id
                JOIN colonias
                    ON addresses.id_municipality = colonias.id
                WHERE id_restaurant=${user.id_restaurant}
                AND usertype='CA'
                AND active=1
            `

            const cashiers = await User.fetchAllCashiers(query)

            res.json(cashiers)
        } catch (error) {
            if (error) console.log(error)

            res.json({
                status: 304,
                message: 'Error al cargar a los cajeros'
            })
        }
    }
}

export const managerControllers = new ManagerControllers()