import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { ICustomer } from '../interfaces/IUsers'
import Restaurant from '../models/restaurant'
import Customer from '../models/customer'

class CustomerController {
    getCustomerPage(req: Request, res: Response) {
        const user = res.locals.token

        res.render('customers/customer-registration', {
            title: 'Agregar un cliente al restaurant',
            user: res.locals.token,
            active: true,
            loggedIn: true
        })
    }

    async getAllCustomersPage(req: Request, res: Response) {
        const user = res.locals.token

        try {
            const restaurant = await Restaurant.findWithUser(user.id_user)

            if (restaurant?.id_restaurant === undefined) {
                return res.json({
                    status: 304,
                    errorMessage: 'Indique el dato id_restaurant'
                })
            }
            const customers = await Customer.fetchAll(restaurant?.id_restaurant)

            res.render('customers/get-customers', {
                title: 'Clientes del restaurante',
                customers,
                user: res.locals.token,
                active: true,
                loggedIn: true
            })
        } catch (error) {
            if (error) console.log(error)

            res.json({
                status: 304,
                errorMessage: 'Error al traer a los clientes'
            })
        }
    }

    async getAllCustomersByRestaurant(req: Request, res: Response) {
        const user = res.locals.token

        try {
            const restaurant = await Restaurant.findWithUser(user.id_user)

            if (restaurant?.id_restaurant === undefined) {
                return res.json({
                    status: 304,
                    errorMessage: 'Inserte el dato id_restaurant'
                })
            }
            const customers = await Customer.fetchAll(restaurant?.id_restaurant)

            console.log(customers)

            res.json({
                status: 200,
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

        try {
            const customerObj: ICustomer = req.body
            customerObj.usertype = 'C'
            customerObj.active = 1
            customerObj.id_restaurant = user.id_restaurant

            const customer = new Customer()
            await customer.save(customerObj)

            res.status(201).json({
                status: 201,
                customerObj
            })
        } catch (error) {
            if (error) console.log(error)

            res.json({
                status: 304,
                errorMessage: 'Error al ingresar al cliente'
            })
        }
    }

    async getCustomerByPhone(req: Request, res: Response) {
        const user = res.locals.token

        try {
            const phone = {
                column: 'phone',
                value: req.body.phone,
                id_restaurant: user.id_restaurant
            }

            const customer = await Customer.findBy(phone)

            if (customer !== null) {
                return res.json({
                    status: 200,
                    customer
                })
            }

            res.json({
                status: 304,
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

        console.log(customerOBJ)

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

    async getCustomerBy(req: Request, res: Response) {
        const user = res.locals.token

        const customerObj = {
            column: 'phone',
            value: req.body.phone,
            id_restaurant: user.id_restaurant
        }

        try {
            const customer = await Customer.findBy(customerObj)

            res.status(200).json(customer)
        } catch (error) {
            if (error) console.log(error)

            res.json({
                status: 304,
                errorMessage: 'Error al buscar al cliente'
            })
        }
    }

    async deleteCustomerByRestaurant(req: Request, res: Response) {
        const user = res.locals.token
        const { id } = req.params

        try {
            const restaurant = await Restaurant.findWithUser(user.id_user)

            const customerObj = {
                id_user: id,
                id_restaurant: restaurant?.id_restaurant
            }

            const customer = new Customer()
            await customer.deleteCustomerByRestaurant(customerObj)

            res.json({
                status: 200,
                message: 'Usuario borrado'
            })
        } catch (error) {
            if (error) console.log(error)

            res.json({
                status: 304,
                errorMessage: 'Error al borrar al cliente'
            })
        }
    }

    async editCustomerByRestaurantPage(req: Request, res: Response) {
        const user = res.locals.token
        const { id } = req.params

        try {
            const restaurant = await Restaurant.findWithUser(user.id_user)

            if (restaurant?.id_restaurant === undefined) {
                return res.json({
                    status: 304,
                    errorMessage: 'Ingrese el dato id_restaurant'
                })
            }

            const findCustomer = {
                id_user: id,
                id_restaurant: restaurant?.id_restaurant
            }

            const customer = await Customer.findById(findCustomer)

            res.render('customers/edit-customer', {
                title: 'Editar información del cliente',
                customer,
                active: true,
                loggedIn: true
            })
        } catch (error) {
            if (error) console.log(error)

            res.render('customers/edit-customer', {
                title: 'Editar información del cliente',
                errorMessage: 'Error al cargar la pagina de edición',
                active: true,
                loggedIn: true
            })
        }
    }

    async editCustomerByRestaurant(req: Request, res: Response) {
        const errors = validationResult(req)
        const user = res.locals.token
        const { id } = req.params

        try {
            const customerObj: ICustomer = req.body

            const editCustomer = new Customer()
            await editCustomer.editCustomerByRestaurant(customerObj, user.id_user)

            if (!errors.isEmpty()) {
                return res.status(200).render('customers/edit-customer', {
                    title: 'Editar información del cliente',
                    errors: errors.array(),
                    customer: customerObj,
                    loginIn: true
                })
            }

            res.redirect(`/api/customers/editCustomerByRestaurantPage/${id}`)
        } catch (error) {
            if (error) console.log(error)

            res.render('customers/edit-customer', {
                title: 'Editar información del cliente',
                errorMessage: 'Error al actualizar al cliente de edición',
                active: true,
                loggedIn: true
            })
        }
    }
}

export const customerController = new CustomerController()