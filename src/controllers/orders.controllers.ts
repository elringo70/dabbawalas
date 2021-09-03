import { Request, Response } from 'express'
import Product from '../models/product'
import Order from '../models/orders'
import { IOrder } from '../interfaces/IOrder'
import { validationResult } from 'express-validator'

class OrderController {
    getOrdersPage(req: Request, res: Response) {
        res.render('orders/new-order', {
            title: 'Nueva orden',
            user: res.locals.token,
            active: true,
            loggedIn: true
        })
    }

    getAllTodayOrdersPage(req: Request, res: Response) {
        res.render('orders/get-all-orders', {
            title: 'Ordenes del día',
            user: res.locals.token,
            active: true,
            loggedIn: true
        })
    }

    async postNewOrder(req: Request, res: Response) {
        const errors = validationResult(req)
        const user = res.locals.token

        const body = req.body
        const productQuantity = body.quantity
        let productsPrice = []

        try {

            if (!errors.array()) {
                return res.status(422).json({
                    status: 422,
                    errors: errors.array()
                })
            }

            if (body.length <= 0) {
                return res.json({
                    status: 400,
                    errorMessage: 'La orden se encuentra vacia'
                })
            }

            if (body.quantity.length === 1) {
                const productObj = {
                    id_product: body.product,
                    id_restaurant: user.id_restaurant
                }
                const productPrice = await Product.findById(productObj)
                if (!productPrice) {
                    return res.json({
                        status: 304,
                        errorMessage: 'El id del platillo no existe'
                    })
                }
                productsPrice[0] = productPrice.price
            } else {
                for (let i = 0; i < body.quantity.length; i++) {
                    const productObj = {
                        id_product: body.product[i],
                        id_restaurant: user.id_restaurant
                    }

                    const productPrice = await Product.findById(productObj)
                    if (!productPrice) {
                        return res.json({
                            status: 304,
                            errorMessage: 'El id del platillo no existe'
                        })
                    }
                    productsPrice[i] = productPrice.price
                }
            }

            let total = 0
            for (let i = 0; i < productsPrice.length; i++) {
                total += productQuantity[i] * productsPrice[i]
            }

            const orderObj = {
                total,
                orderstatus: 'opened',
                id_restaurant: user.id_restaurant,
                id_user: body.id_user
            }

            const orderDetailObj = {
                id_product: body.product,
                quantity: body.quantity,
                id_restaurant: user.id_restaurant
            }

            const order = new Order()
            await order.save(orderObj, orderDetailObj)

            res.json({
                status: 201,
                message: 'Orden procesada con éxito'
            })
        } catch (error) {
            if (error) console.log(error)

            res.json({
                status: 304,
                errorMessage: 'Error al procesar la orden'
            })
        }
    }

    async getAllTodayOrders(req: Request, res: Response) {
        const user = res.locals.token

        const orderOBJ = {
            id_restaurant: user.id_restaurant
        }

        try {
            const orders = await Order.fetchAll(orderOBJ)
            res.status(200).json(orders)
        } catch (error) {
            if (error) console.log(error)

            res.json({
                status: 304,
                errorMessage: 'Error al traer las ordenes del día'
            })
        }
    }

    async postCompleteOrder(req: Request, res: Response) {
        const user = res.locals.token
        const body = req.body

        try {
            const completeOrder = await Order.updateCompleteOrder(body.id_order)
            res.status(200).json(completeOrder)
        } catch (error) {
            if (error) console.log(error)

            res.json({
                status: 304,
                errorMessage: 'Error al completar la orden'
            })
        }
    }

    async cancelOrderById(req: Request, res: Response) {
        const user = res.locals.token
        const { id } = req.params

        const order = {
            id_order: id,
            id_restaurant: user.id_restaurant
        }

        try {
            await Order.updateCancelById(order)

            res.json({
                status: 200,
                message: 'Orden cancelada'
            })
        } catch (error) {
            if (error) console.log(error)

            res.json({
                status: 304,
                errorMessage: 'Error al cancelar la orden'
            })
        }
    }

    async loadDashboard(req: Request, res: Response) {
        const user = res.locals.token

        try {
            const orders: IOrder[] | null = await Order.fetchAllByToday(user.id_restaurant)

            if (orders === null) {
                return res.status(200).json({
                    message: 'No hay ordenes del dia'
                })
            }

            let processing = 0
            let completed = 0
            let canceled = 0
            let todayOrders = 0

            for (let i = 0; i < orders?.length; i++) {
                switch (orders[i].orderstatus) {
                    case 'opened':
                        processing++
                        todayOrders++
                        break
                    case 'canceled':
                        canceled++
                        todayOrders++
                        break
                    case 'completed':
                        completed++
                        todayOrders++
                        break
                }
            }

            const dashboard = {
                ordersByStatus: {
                    processing,
                    completed,
                    canceled,
                    todayOrders
                }
            }

            res.status(200).json(dashboard)
        } catch (error) {
            if (error) console.log(error)

            res.json({
                status: 304,
                errorMessage: 'Error al cargar el dashboard'
            })
        }
    }
}

export const ordersController = new OrderController()