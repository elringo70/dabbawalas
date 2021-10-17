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

            const length = orderObject.quantity.length
            let orderDetailArray = []

            for (let i = 0; i < length; i++) {
                const productPrice = await Product.findById(orderObject.id_product[i], user.id_restaurant)
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
                AND usertype='C'
            `
            const customerPhone = await Customer.findBy(customerPhoneQuery)

            console.log(customerPhone)
            if (!customerPhone) {
                return res.json({
                    status: 304,
                    message: 'El número enviado no fue encontrado'
                })
            }
            const newOrder = {
                total,
                orderstatus: 'opened',
                id_restaurant: user.id_restaurant,
                id_user: customerPhone.id_user
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

        let dashboard: any = {
            ordersByStatus: null,
            daysCount: null,
            monthSales: null,
            lastSales: null
        }

        try {
            //Orders query
            const ordersQuery = todayOrdersRoleQuery(user)

            //Load orders from database
            const orders = await Order.fetchAllAny(ordersQuery)

            if (orders) {
                //Load variables for cards
                const ordersByStatus = loadStatusCards(orders)
                dashboard.ordersByStatus = ordersByStatus
            }

            //Query for the 7 day chart
            const sevenDayQuery = `
                SELECT DAYNAME(orders.createdAt) AS day_name, COUNT(*) AS day_count
                FROM orders
                WHERE YEARWEEK(createdAt) = YEARWEEK(NOW())
                AND id_restaurant=${user.id_restaurant}
                GROUP BY day_name
            `

            //Load 7 day chart from database
            const sevenDayChart = await Order.fetchAllAny(sevenDayQuery)

            if (sevenDayChart) {
                //Load days variables for 7 day chart
                const daysCount = load7DayChart(sevenDayChart)
                dashboard.daysCount = daysCount
            }

            //Query for month sales
            const query = `
                SELECT DATE_FORMAT(orders.createdAt, '%Y-%m-%d') AS day, COUNT(*) AS day_count
                FROM orders 
                WHERE YEAR(createdAt) = YEAR(CURRENT_DATE())
                AND MONTH(createdAt) = MONTH(CURRENT_DATE())
                AND id_restaurant=${user.id_restaurant}
                GROUP BY day
            `

            //Load data from database for month sales
            const monthSales = await Order.fetchAllAny(query)
            dashboard.monthSales = monthSales

            const last3OrdersQuery = `
                SELECT orders.*, users.name, users.lastname, users.phone
                FROM orders
                LEFT JOIN users
                    ON orders.id_user = users.id_user
                WHERE orders.id_restaurant=${user.id_restaurant}
                    AND orderstatus='opened'
                    AND CURDATE()
                ORDER BY orders.createdAt ASC
                LIMIT 3
            `
            const last3Orders = await Order.fetchAllAny(last3OrdersQuery)
            dashboard.lastSales = last3Orders

            //Dashboard Object
            res.status(200).json(dashboard)
        } catch (error) {
            if (error) console.log(error)

            res.json({
                status: 304,
                errorMessage: 'Error al cargar el dashboard'
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
                const product = await Product.findById(orderDetail[i].id_product, user.id_restaurant)

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


//Select query if admin, manager
function todayOrdersRoleQuery(user: any) {

    let query = ``

    switch (user.usertype) {
        case 'A':
            query = `
                SELECT * FROM orders
                WHERE DATE_FORMAT(orders.createdAt, '%Y-%m-%d') = CURDATE()
                AND id_restaurant=6
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
    return query
}

//Load variables for 
function loadStatusCards(orders: IOrder[]) {
    let processing = 0
    let completed = 0
    let canceled = 0
    let delayed = 0

    for (let i = 0; i < orders?.length; i++) {
        switch (orders[i].orderstatus) {
            case 'opened':
                processing++
                delayed++
                break
            case 'canceled':
                canceled++
                delayed++
                break
            case 'completed':
                completed++
                delayed++
                break
        }
    }

    return {
        processing,
        completed,
        canceled,
        delayed
    }
}

function load7DayChart(sevenDayChart: IOrder[]) {
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
    return daysCount
}