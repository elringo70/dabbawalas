import { Request, Response } from 'express'
import Product from '../models/product'
import Order from '../models/orders'
import { IOrder, IOrderDetail, IPostingOrder } from '../interfaces/IOrder'
import { validationResult } from 'express-validator'
import Customer from '../models/customer'

class OrderController {
    getNewOrdersPage(req: Request, res: Response) {
        const profile = res.locals.profile
        profile.title = 'Nueva orden'

        res.render('orders/new-order', profile)
    }

    getAllTodayOrdersPage(req: Request, res: Response) {
        const profile = res.locals.profile
        profile.title = 'Ordenes del día'

        res.render('orders/get-all-orders', profile)
    }

    getAllTodayOrdersCookerPage(req: Request, res: Response) {
        const profile = res.locals.profile
        profile.title = 'Ordenes del día'

        res.render('orders/cooking-dashboard', profile)
    }

    getAllRestaurantsOrdersPage(req: Request, res: Response) {
        const profile = res.locals.profile
        profile.title = 'Live orders'

        res.render('orders/restaurants-orders', profile)
    }

    async getAllRestaurantsOrders(req: Request, res: Response) {
        const user = res.locals.token

        try {
            const query = `
                SELECT orders.*, restaurants.name
                FROM orders
                JOIN restaurants
                ON orders.id_restaurant = restaurants.id_restaurant
                WHERE orderstatus='opened'
            `
            const orders = await Order.fetchAllAny(query)
            res.status(200).json(orders)
        } catch (error) {
            if (error) console.log(error)

            res.json({
                status: 304,
                errorMessage: 'Error while loading all restaurant orders'
            })
        }
    }

    async postNewOrder(req: Request, res: Response) {
        const errors = validationResult(req)
        const error = errors.array()
        const user = res.locals.token

        const body = req.body
        const productQuantity = body.quantity
        let productsPrice = []

        try {
            if (!errors.array()) {
                return res.json({
                    status: 304,
                    message: error[0].msg
                })
            }

            const orderObject: IPostingOrder = {
                quantity: body.quantity,
                id_product: body.product,
                price: body.price,
                phone: body.phone
            }

            const sameLength = confirmLength(orderObject)
            if (!sameLength) {
                return res.json({
                    status: 304,
                    errorMessage: 'Error al enviar la cantidad de productos'
                })
            }

            const length = orderObject.quantity.length
            let orderDetailArray = []

            for (let i = 0; i < length; i++) {
                const productQuery = `
                        SELECT *
                        FROM products
                        WHERE id_product=${orderObject.id_product[i]}
                        AND id_restaurant=${user.id_restaurant}
                        AND active=1
                    `

                const productPrice = await Product.findById(productQuery)
                if (!productPrice) {
                    return res.json({
                        status: 304,
                        message: 'El id del platillo no existe'
                    })
                }
                productsPrice[i] = productPrice.price

                const orderDetail: IOrderDetail = {
                    id_product: body.product[i],
                    id_restaurant: user.id_restaurant,
                    quantity: body.quantity[i]
                }
                orderDetailArray.push(orderDetail)
            }

            let total = 0
            for (let i = 0; i < productsPrice.length; i++) {
                total += productQuantity[i] * productsPrice[i]
            }

            const customerPhoneQuery = `
                SELECT id_user
                FROM users
                WHERE phone='${body.phone}'
            `
            const customerPhone = await Customer.findBy(customerPhoneQuery)
            let newOrder
            if (customerPhone) {
                newOrder = {
                    total,
                    orderstatus: 'opened',
                    id_restaurant: user.id_restaurant,
                    id_user: customerPhone.id_user
                }
            }

            const order = new Order()
            await order.save(newOrder, orderDetailArray)

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

        const query = `
            SELECT orders.*, users.name, users.lastname, users.phone
            FROM orders
            LEFT JOIN users
            ON orders.id_user = users.id_user
            WHERE orders.id_restaurant=${user.id_restaurant}
            AND orderstatus='opened'
            ORDER BY orders.createdAt ASC
        `

        try {
            const orders = await Order.fetchAllAny(query)
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

        try {
            const query = `
                UPDATE orders SET
                orderstatus='canceled'
                WHERE id_order=${id}
            `

            await Order.deleteById(query)

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

            let query = ``

            switch (user.usertype) {
                case 'A':
                    query = `
                        SELECT *
                        FROM orders 
                        WHERE DATE_FORMAT(orders.createdAt, '%Y-%m-%d') = CURDATE()
                    `
                    break
                case 'M':
                    query = `
                        SELECT *
                        FROM orders 
                        WHERE DATE_FORMAT(orders.createdAt, '%Y-%m-%d') = CURDATE()
                        AND id_restaurant=${user.id_restaurant}
                    `
                    break
            }

            const orders: IOrder[] | null = await Order.fetchAllAny(query)

            if (!orders) {
                return res.status(200).json({
                    orders: false,
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

    async loadData7DayChart(req: Request, res: Response) {
        const user = res.locals.token

        try {
            const query = `
                SELECT DAYNAME(orders.createdAt) AS day_name, COUNT(*) AS day_count
                FROM orders
                WHERE YEARWEEK(createdAt) = YEARWEEK(NOW())
                AND id_restaurant=${user.id_restaurant}
                GROUP BY day_name
            `

            const sevenDayChart = await Order.fetchAllAny(query)

            let Monday = 0,
                Tuesday = 0,
                Wednesday = 0,
                Thursday = 0,
                Friday = 0,
                Saturday = 0,
                Sunday = 0

            if (sevenDayChart) {
                for (let i = 0; i < sevenDayChart.length; i++) {
                    switch (sevenDayChart[i].day_name) {
                        case 'Monday':
                            Monday = sevenDayChart[i].day_count
                            break
                        case 'Tuesday':
                            Tuesday = sevenDayChart[i].day_count
                            break
                        case 'Wednesday':
                            Wednesday = sevenDayChart[i].day_count
                            break
                        case 'Thursday':
                            Thursday = sevenDayChart[i].day_count
                            break
                        case 'Friday':
                            Friday = sevenDayChart[i].day_count
                            break
                        case 'Saturday':
                            Saturday = sevenDayChart[i].day_count
                            break
                        case 'Sunday':
                            Sunday = sevenDayChart[i].day_count
                            break
                    }
                }
            }

            let daysCount = [Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday]

            res.status(200).json(daysCount)
        } catch (error) {
            if (error) console.log(error)

            res.json({
                status: 304,
                errorMessage: 'Error al cargar información de la gráfica'
            })
        }
    }

    async monthDataSales(req: Request, res: Response) {
        const user = res.locals.token

        try {
            const query = `
                SELECT DATE_FORMAT(orders.createdAt, '%Y-%m-%d') AS day, COUNT(*) AS day_count
                FROM orders 
                WHERE YEAR(createdAt) = YEAR(CURRENT_DATE())
                AND MONTH(createdAt) = MONTH(CURRENT_DATE())
                AND id_restaurant=${user.id_restaurant}
                GROUP BY day
            `

            const monthSales: any = await Order.fetchAllAny(query)

            res.status(200).json(monthSales)
        } catch (error) {
            if (error) console.log(error)

            res.json({
                status: 304,
                errorMessage: 'Error al traer las ventas del mes'
            })
        }
    }

    async getCookerOrderDetailPage(req: Request, res: Response) {
        const user = res.locals.token
        const { id } = req.params

        try {
            const query = `
                SELECT orders.id_order, orders.id_user, order_detail.*
                FROM orders
                RIGHT JOIN order_detail
                ON orders.id_order = order_detail.id_order
                WHERE orders.id_order=${id}
            `

            const orderDetail = await Order.fetchAllAny(query)

            if (!orderDetail) {
                return res.status(200).render('orders/order-detail', {
                    title: 'Detalle de la orden',
                    user: res.locals.token,
                    active: true,
                    cooker: true,
                    errorMessage: 'No exite informacion para esa orden',
                    loggedIn: true
                })
            }

            let products = []
            for (let i = 0; i < orderDetail.length; i++) {
                const productQuery = `
                    SELECT *
                    FROM products
                    WHERE id_product=${orderDetail[i].id_product}
                `
                const product = await Product.findById(productQuery)

                products.push({
                    quantity: orderDetail[i].quantity,
                    product
                })
            }

            switch (user.usertype) {
                case 'A':
                    res.status(200).render('orders/order-detail', {
                        title: 'Detalle de la orden',
                        user,
                        active: true,
                        admin: true,
                        loggedIn: true,
                        products
                    })
                    break
                case 'CO':
                    res.status(200).render('orders/order-detail', {
                        title: 'Detalle de la orden',
                        user,
                        active: true,
                        cooker: true,
                        loggedIn: true,
                        products
                    })
                    break
                case 'M':
                    res.status(200).render('orders/order-detail', {
                        title: 'Detalle de la orden',
                        user,
                        active: true,
                        manager: true,
                        loggedIn: true,
                        products
                    })
                    break
            }
        } catch (error) {
            if (error) console.log(error)

            res.status(200).render('orders/order-detail', {
                title: 'Detalle de la orden',
                user: res.locals.token,
                active: true,
                cooker: true,
                errorMessage: 'Error al traer el detalle de la orden',
                loggedIn: true
            })
        }
    }
}

export const ordersController = new OrderController()

function confirmLength(orderObject: IPostingOrder) {
    const orderArray = [orderObject.quantity.length, orderObject.price.length, orderObject.id_product.length]

    const attributesArray = orderArray.every(e => orderArray[0] == e)

    return attributesArray
}