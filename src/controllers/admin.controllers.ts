import { Request, Response } from 'express'
import Order from '../models/orders'
import Product from '../models/product'
import User from '../models/user'
import { IManager } from '../interfaces/IUsers'

class AdminController {
    getAdminDashboardPage(req: Request, res: Response) {
        const user = res.locals.token

        res.render('admin/dashboard', {
            title: 'Dashboard',
            user,
            active: true,
            admin: true,
            loggedIn: true
        })
    }

    adminCharts(req: Request, res: Response) {
        const user = res.locals.token

        res.render('admin/charts', {
            title: 'Status charts',
            user,
            active: true,
            admin: true,
            loggedIn: true
        })
    }

    getAllManagersPage(req: Request, res: Response) {
        const user = res.locals.token

        res.render('admin/managers', {
            title: 'Get all managers',
            user,
            active: true,
            admin: true,
            loggedIn: true
        })
    }

    async getManagerPageInfoPage(req: Request, res: Response) {
        const user = res.locals.token
        const { id } = req.params

        try {
            const manager: IManager = await User.findById(id)
            delete manager.pass

            res.render('admin/managers-info', {
                title: 'Manager information',
                user,
                manager,
                active: true,
                admin: true,
                loggedIn: true
            })
        } catch (error) {
            if (error) console.log(error)

            res.render('admin/managers-info', {
                title: 'Manager information',
                user,
                active: true,
                admin: true,
                loggedIn: true,
                errorMessage: 'Error while loading manager information'
            })
        }
    }

    async postLoadRestaurantData(req: Request, res: Response) {
        const user = res.locals.token
        const body = req.body

        //Period time orders
        let compressQuery = ``
        let ordersSummary

        //Best selling product
        let bestSellingProductQuery = ``
        let bestSellingProductObject: any

        //Chart sales per day
        let chartQuery = ``
        let chartObject: any

        try {

            switch (body.option) {
                case '1':
                    //Search by today queries
                    compressQuery = `
                        SELECT
                        SUM(orders.orderstatus = 'opened') AS opened,
                        SUM(orders.orderstatus = 'completed') AS completed,
                        SUM(orders.orderstatus = 'canceled') AS canceled
                        FROM orders 
                        WHERE id_restaurant=${body.id}
                        AND createdAt = CURDATE()
                    `

                    bestSellingProductQuery = `
                        SELECT id_product, COUNT( id_product ) AS totalproduct
                        FROM  order_detail
                        WHERE id_restaurant=${body.id}
                        AND createdAt = CURDATE()
                        GROUP BY id_product
                        ORDER BY totalproduct DESC
                    `

                    chartQuery = `
                        SELECT DATE_FORMAT(orders.createdAt, '%Y-%m-%d') AS day_number, COUNT(*) AS day_count
                        FROM orders 
                        WHERE id_restaurant=${body.id}
                        AND createdAt = CURDATE()
                        GROUP BY day_number
                    `
                    break
                case '2':
                    //Search by present week queries
                    compressQuery = `
                        SELECT
                        SUM(orders.orderstatus = 'opened') AS opened,
                        SUM(orders.orderstatus = 'completed') AS completed,
                        SUM(orders.orderstatus = 'canceled') AS canceled
                        FROM orders 
                        WHERE id_restaurant=${body.id}
                        AND YEARWEEK(createdAt) = YEARWEEK(NOW())
                    `

                    bestSellingProductQuery = `
                        SELECT id_product, COUNT( id_product ) AS totalproduct
                        FROM  order_detail
                        WHERE YEARWEEK(createdAt) = YEARWEEK(NOW())
                        AND id_restaurant=${body.id}
                        GROUP BY id_product
                        ORDER BY totalproduct DESC
                    `

                    chartQuery = `
                        SELECT DATE_FORMAT(orders.createdAt, '%Y-%m-%d') AS day_number, COUNT(*) AS day_count
                        FROM orders 
                        WHERE id_restaurant=${body.id}
                        AND YEARWEEK(createdAt) = YEARWEEK(NOW())
                        GROUP BY day_number
                    `
                    break
                case '3':
                    //Search by present month queries
                    compressQuery = `
                        SELECT
                        SUM(orders.orderstatus = 'opened') AS opened,
                        SUM(orders.orderstatus = 'completed') AS completed,
                        SUM(orders.orderstatus = 'canceled') AS canceled
                        FROM orders 
                        WHERE id_restaurant=${body.id}
                        AND MONTH(createdAt) = MONTH(CURRENT_DATE())
                    `

                    bestSellingProductQuery = `
                        SELECT id_product, COUNT( id_product ) AS totalproduct
                        FROM  order_detail
                        WHERE id_restaurant=${body.id}
                        AND MONTH(createdAt) = MONTH(CURRENT_DATE())
                        GROUP BY id_product
                        ORDER BY totalproduct DESC
                    `

                    chartQuery = `
                        SELECT DATE_FORMAT(orders.createdAt, '%Y-%m-%d') AS day_number, COUNT(*) AS day_count
                        FROM orders 
                        WHERE id_restaurant=${body.id}
                        AND MONTH(createdAt) = MONTH(CURRENT_DATE())
                        GROUP BY day_number
                    `
                    break
            }

            ordersSummary = await Order.fetchAllAny(compressQuery)
            bestSellingProductObject = await Order.fetchAllAny(bestSellingProductQuery)
            chartObject = await Order.fetchAllAny(chartQuery)

            if (
                ordersSummary &&
                bestSellingProductObject &&
                chartObject
            ) {
                const query = `
                    SELECT products.name, products.image
                    FROM products
                    WHERE id_product=${bestSellingProductObject[0].id_product}
                `

                const findProduct: any = await Product.findById(query)

                let dataLabels = []
                let data = []
                for (let i = 0; i < chartObject.length; i++) {
                    dataLabels.push(chartObject[i].day_number)
                    data.push(chartObject[i].day_count)
                }

                const RestaurantSalesObject = {
                    ordersSummary: ordersSummary[0],
                    product: {
                        productName: findProduct.name,
                        productImage: findProduct.image,
                        quantity: bestSellingProductObject[0].totalproduct
                    },
                    chartObject: {
                        dataLabels,
                        data
                    }
                }

                res.status(200).json(RestaurantSalesObject)
            } else {
                res.json({
                    status: 304,
                    message: 'No hay información en el periodo'
                })
            }
        } catch (error) {
            if (error) console.log(error)

            res.json({
                status: 304,
                errorMessage: 'Error while loading restaurant information'
            })
        }
    }

    async getAllManagers(req: Request, res: Response) {
        const user = res.locals.token

        try {
            const managersQuery = `
                SELECT users.*, manager_restaurant.id_restaurant
                FROM users
                LEFT JOIN manager_restaurant
                    ON users.id_user=manager_restaurant.id_user
                WHERE users.usertype='M';
            `

            const managers = await User.fetchAllAny(managersQuery)

            if (managers) {
                for (let i = 0; i < managers.length; i++) {
                    delete managers[i].pass
                }
            }

            res.status(200).json(managers)
        } catch (error) {
            if (error) console.log(error)

            res.json({
                status: 304,
                errorMessage: 'Error while loading managers information'
            })
        }
    }

    async approveManager(req: Request, res: Response) {
        const user = res.locals.token
        const { id } = req.params

        try {
            const manager = await User.findById(id)

            if (manager.verified === 'VERIFIED') {
                return res.status(200).json({
                    message: 'Manager is already verified'
                })
            }

            const query = `
                UPDATE users
                SET verified='VERIFIED'
                WHERE id_user=${id}
            `

            const verifiedManager = await User.updateById(query)

            console.log(verifiedManager)
            res.status(200).json(verifiedManager)
        } catch (error) {
            if (error) console.log(error)

            res.json({
                status: 304,
                errorMessage: 'Error while updating manager status'
            })
        }
    }
}

export const adminController = new AdminController()