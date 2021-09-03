import { IOrder } from '../interfaces/IOrder'
import { conn, pool } from '../utils/database'

export default class Order {
    save(
        orderQueryObj: {
            total: number,
            orderstatus: string,
            id_restaurant: string | number,
            id_user: string | number
        },
        orderDetailQueryObj: {
            id_product: string[] | number[],
            id_restaurant: string | number,
            quantity: number[]
        }
    ) {
        return new Promise((resolve, reject) => {
            conn.beginTransaction(function (err) {
                if (err) {
                    console.log(err)
                    return reject(err)
                }

                const orderQuery = `INSERT INTO orders SET ?`
                conn.query(orderQuery, orderQueryObj, function (error, results) {
                    if (error) {
                        return conn.rollback(function () {
                            reject(error)
                            console.log(error)
                        })
                    }

                    resolve(results)

                    const orderId = results.insertId
                    const quantity = orderDetailQueryObj.quantity.length

                    if (quantity === 1) {
                        const orderDetailQuery = `
                            INSERT INTO order_detail
                            (id_order, id_product, id_restaurant, quantity)
                            VALUES
                            (${orderId}, ${orderDetailQueryObj.id_product}, ${orderDetailQueryObj.id_restaurant}, ${orderDetailQueryObj.quantity})
                        `

                        conn.query(orderDetailQuery, function (error, results) {
                            if (error) {
                                return conn.rollback(function () {
                                    console.log(error)
                                    return reject(error)
                                })
                            }

                            resolve(results)

                            conn.commit(function (err) {
                                if (err) {
                                    return conn.rollback(function () {
                                        console.log(err)
                                        return reject(err)
                                    })
                                }
                            })
                        })
                    } else {
                        for (let i = 0; i < quantity; i++) {
                            const orderDetailQuery = `
                                INSERT INTO order_detail
                                (id_order, id_product, id_restaurant, quantity)
                                VALUES
                                (${orderId}, ${orderDetailQueryObj.id_product[i]}, ${orderDetailQueryObj.id_restaurant}, ${orderDetailQueryObj.quantity[i]})
                            `

                            conn.query(orderDetailQuery, function (error, results) {
                                if (error) {
                                    return conn.rollback(function () {
                                        console.log(error)
                                        return reject(error)
                                    })
                                }

                                resolve(results)

                                conn.commit(function (err) {
                                    if (err) {
                                        return conn.rollback(function () {
                                            console.log(err)
                                            return reject(err)
                                        })
                                    }
                                })
                            })
                        }
                    }
                })
            })
        })
    }

    static fetchAll(
        order: {
            id_restaurant: string | number
        }
    ): Promise<IOrder[] | null> {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT orders.*, users.name, users.lastname, users.phone
                FROM orders
                LEFT JOIN users
                ON orders.id_user = users.id_user
                WHERE orders.id_restaurant=?
                AND orderstatus='opened'
                ORDER BY orders.createdAt DESC
            `

            pool.query(query, [order.id_restaurant], (error, results: IOrder[]) => {
                if (error) reject(error)

                resolve(results.length > 0 ? results : null)
            })
        })
    }

    static fetchAllByToday(id_restaurant: string | number): Promise<IOrder[] | null> {
        return new Promise((resolve, reject) => {
            const date = new Date()
            const query = `
                SELECT id_order, total, orderstatus, id_restaurant, id_user
                FROM orders 
                WHERE DATE_FORMAT(orders.createdAt, '%Y-%m-%d') = CURDATE()
                AND id_restaurant=?
            `

            pool.query(query, [id_restaurant],(error, results: IOrder[]) => {
                if (error) reject(error)

                resolve(results.length > 0 ? results : null)
            })
        })
    }

    static fetchAllDetail() {
        return new Promise((resolve, reject) => {
            const query = ``

            pool.query(query, (error, results) => {
                if (error) reject(error)

                resolve(results)
            })
        })
    }

    static updateCompleteOrder(id: string | number) {
        return new Promise((resolve, reject) => {
            const query = `UPDATE orders SET orderstatus='completed' WHERE id_order=?`

            pool.query(query, [id], (error, results) => {
                if (error) reject(error)

                resolve(results)
            })
        })
    }

    static updateCancelById(
        order: {
            id_order: string | number,
            id_restaurant: string | number
        }
    ) {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE orders SET
                orderstatus='canceled'
                WHERE id_order=?
                AND id_restaurant=?
            `

            pool.query(query, [order.id_order, order.id_restaurant], (error, results) => {
                if (error) reject(error)

                resolve(results)
            })
        })
    }
}