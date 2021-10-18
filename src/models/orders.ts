import { IOrder, IOrderDetail, IPostingOrder } from '../interfaces/IOrder'
import { conn, pool, asyncConn } from '../utils/database'

export default class Order {
    save(orderObject: any, orderDetailArray: IOrderDetail[]) {
        return new Promise(async (resolve, reject) => {
            const db = asyncConn()
            try {
                await db.beginTransaction()
                const orderQuery = `
                    INSERT INTO orders
                    (total, orderstatus, id_restaurant, id_user)
                    VALUES
                    (
                        ${orderObject.total},
                        '${orderObject.orderstatus}',
                        ${orderObject.id_restaurant},
                        ${orderObject.id_user}
                    )
                `
                const newOrder: any = await db.query(orderQuery)

                for (let i = 0; i < orderDetailArray.length; i++) {
                    const query = `
                        INSERT INTO order_detail
                        (id_order, id_product, id_restaurant, quantity)
                        VALUES
                        (
                            ${newOrder.insertId},
                            ${orderDetailArray[i].id_product},
                            ${orderDetailArray[i].id_restaurant},
                            ${orderDetailArray[i].quantity}
                        )
                    `
                    await db.query(query)
                }

                const results = await db.commit()
                resolve(results)
            } catch (error) {
                await db.rollback()
                reject(error)
                console.log(error)
            } finally {
                await db.close()
            }
        })
    }

    static findOne(query: string): Promise<IOrder | IOrderDetail | null> {
        return new Promise((resolve, reject) => {
            pool.query(query, (error, results: IOrder[] | IOrderDetail[]) => {
                if (error) reject(error)

                resolve(results.length === 1 ? results[0] : null)
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

    static fetchAllAny(query: string): Promise<any[] | null> {
        return new Promise((resolve, reject) => {
            pool.query(query, (error, results: any[]) => {
                if (error) reject(error)

                if (results === undefined) {
                    return null
                }

                resolve(results.length > 0 ? results : null)
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

    static deleteById(query: string) {
        return new Promise((resolve, reject) => {
            pool.query(query, (error, results) => {
                if (error) reject(error)

                resolve(results)
            })
        })
    }
}