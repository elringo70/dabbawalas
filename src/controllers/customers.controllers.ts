import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { ICustomer } from '../interfaces/IUsers'
import Customer from '../models/customer'
import { IAddress } from '../interfaces/IAddresses'

class CustomerController {
    getCustomerPage(req: Request, res: Response) {
        const profile = res.locals.profile
        profile.title = 'Agregar un cliente al restaurant'

        res.render('customers/customer-registration', profile)
    }

    async getAllCustomersPage(req: Request, res: Response) {
        const profile = res.locals.profile
        profile.title = 'Clientes del restaurante'

        res.render('customers/get-customers', profile)
    }

    async getAllCustomersByRestaurant(req: Request, res: Response) {
        const user = res.locals.token

        try {
            const customerQuery = `
                SELECT
                    users.id_user, users.name, users.lastname, users.maternalsurname, users.phone, users.usertype,
                    users.gender, users.image, users.lastpurchase, users.active, users.id_restaurant, users.id_address,
                    users.email,
                    estados.nombre AS state,
                    municipios.nombre AS city,
                    colonias.nombre AS municipality,
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
                AND usertype='C'
            `

            const customers = await Customer.fetchAll(customerQuery)

            res.status(200).json({
                customers
            })
        } catch (error) {
            if (error) console.log(error)

            res.json({
                status: 304,
                errorMessage: 'Error al traer a los clientes'
            })
        }
    }

    async postNewCustomer(req: Request, res: Response) {
        const user = res.locals.token
        const body = req.body

        const customer: ICustomer = {
            phone: req.body.phone,
            name: body.name.toUpperCase(),
            lastname: body.lastname.toUpperCase(),
            maternalsurname: body.maternalsurname.toUpperCase(),
            gender: body.gender,
            usertype: 'C',
            active: 1,
            id_restaurant: user.id_restaurant
        }

        const address: IAddress = {
            id_municipality: body.municipality,
            id_city: body.city,
            id_state: body.state,
            number: body.number,
            street: body.street.toUpperCase()
        }

        try {
            const newCustomer = new Customer()
            await newCustomer.save(customer, address)

            res.status(201).json({
                status: 201,
                message: 'Cliente guardado exitosamente'
            })

        } catch (error) {
            if (error) console.log(error)

            res.json({
                status: 304,
                errorMessage: 'Error al guardar al cliente'
            })
        }

    }

    async getCustomerByPhone(req: Request, res: Response) {
        const errors = validationResult(req)
        const error = errors.array()
        const user = res.locals.token
        const body = req.body

        if (!errors.isEmpty()) {
            return res.json({
                status: 304,
                message: error[0].msg
            })
        }

        const query = `
            SELECT
                users.name,
                users.lastname,
                users.maternalsurname,
                users.phone,
                users.gender,
                users.usertype,
                colonias.nombre AS municipality,
                municipios.nombre AS city,
                estados.nombre AS state,
                addresses.street,
                addresses.number
            FROM users
            JOIN addresses
                ON users.id_address = addresses.id_address
            JOIN colonias
                ON addresses.id_municipality=colonias.id
            JOIN municipios
                ON addresses.id_city=municipios.id
            JOIN estados
                ON addresses.id_state=estados.id
            WHERE users.usertype='C'
                AND users.phone=${body.phone}
                AND users.id_restaurant=${user.id_restaurant}
                AND users.active=1
        `

        try {
            const customer = await Customer.findBy(query)

            if (customer !== null) {
                return res.json({
                    status: 304,
                    customer
                })
            }

            res.json({
                status: 200,
                message: 'Número disponible'
            })
        } catch (error) {
            if (error) console.log(error)

            res.json({
                status: 304,
                errorMessage: 'Error al obtener el cliente'
            })
        }
    }

    async getCustomerById(req: Request, res: Response) {
        const user = res.locals.token
        const id = req.params.id

        const customerOBJ = {
            id_user: id,
            id_restaurant: user.id_restaurant
        }

        try {
            const customer = await Customer.findById(customerOBJ)

            res.status(200).json(customer)
        } catch (error) {
            if (error) console.log(error)

            res.json({
                status: 304,
                errorMessage: 'Error al buscar al cliente por ID'
            })
        }
    }


    async deleteCustomerByRestaurant(req: Request, res: Response) {
        const user = res.locals.token
        const { id } = req.params

        try {
            const customerObject = {
                id_user: id,
                id_restaurant: user.id_restaurant
            }

            const customer = await Customer.findById(customerObject)

            if (!customer) {
                return res.status(200).json({
                    status: 200,
                    message: 'El usuario no existe'
                })
            }

            if (customer.id_user && customer.id_address) {
                await Customer.deleteById(customer.id_user, customer.id_address)
                res.status(200).json({
                    status: 200,
                    message: 'Cliente borrado'
                })
            } else {
                res.json({
                    status: 304,
                    message: 'Error al borrar al cliente'
                })
            }
        } catch (error) {
            if (error) console.log(error)

            res.json({
                status: 304,
                errorMessage: 'Error al borrar al cliente'
            })
        }
    }

    async editCustomerByRestaurantPage(req: Request, res: Response) {
        const errors = validationResult(req)
        const error = errors.array()
        const profile = res.locals.profile
        profile.title = 'Editar información del cliente'
        const user = res.locals.token
        const { id } = req.params

        try {
            if (!errors.isEmpty()) {
                profile.error = error[0].msg
                return res.status(200).render('customers/edit-customer', profile)
            }

            const customerObject = {
                id_user: id,
                id_restaurant: user.id_restaurant
            }

            const customer = await Customer.findById(customerObject)

            if (!customer) {
                profile.errorMessage = 'No se encuentra el cliente'
                return res.status(200).render('customers/edit-customer', profile)
            }

            profile.customer = customer
            res.status(200).render('customers/edit-customer', profile)
        } catch (error) {
            if (error) console.log(error)

            profile.errorMessage = 'Error al cargar la pagina de edición'
            res.render('customers/edit-customer', profile)
        }
    }

    async editCustomerByRestaurant(req: Request, res: Response) {
        const errors = validationResult(req)
        const error = errors.array()
        const user = res.locals.token
        const { phone } = req.params
        const body = req.body

        try {
            if (!errors.isEmpty()) {
                return res.json({
                    status: 304,
                    message: error[0].msg
                })
            }
            
            const query = `
                SELECT users.*
                FROM users
                WHERE phone='${phone}'
                AND usertype='C'
                AND id_restaurant=${user.id_restaurant}
            `
            const customer = await Customer.findBy(query)

            if (!customer) {
                return res.json({
                    status: 304,
                    message: 'Cliente no encontrado o información no valida'
                })
            }

            const customerInfo: ICustomer = {
                id_user: customer.id_user,
                name: body.name.toUpperCase(),
                lastname: body.lastname.toUpperCase(),
                maternalsurname: body.toUpperCase(),
                phone: req.body.phone,
                gender: req.body.gender,
                usertype: 'C',
                active: 1,
                id_restaurant: user.id_restaurant
            }

            const customerAddress: IAddress = {
                id_address: customer.id_address,
                id_state: body.state,
                id_city: req.body.city,
                id_municipality: req.body.municipality,
                street: body.street.toUpperCase(),
                number: body.number.toUpperCase(),
            }

            const updateCustomer = new Customer()
            await updateCustomer.editById(customerInfo, customerAddress)

            res.status(201).json({
                status: 201,
                message: 'Cliente actualizado con éxito'
            })
        } catch (error) {
            if (error) console.log(error)

            res.json({
                status: 304,
                message: 'Error al actualizar al cliente'
            })
        }
    }
}

export const customerController = new CustomerController()