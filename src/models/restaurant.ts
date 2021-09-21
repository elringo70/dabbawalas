import { pool, conn, asyncConn } from '../utils/database'
const db = asyncConn()
import { ICustomer } from '../interfaces/IUsers'
import { IRestaurant, IBusinessHours } from '../interfaces/IRestaurant'

export default class Restaurant {
    save(restaurant: IRestaurant, user: ICustomer, schedule: any) {
        return new Promise((resolve, reject) => {
            conn.beginTransaction((err) => {
                if (err) throw err
                conn.query('INSERT INTO restaurants SET ?', [restaurant], (error, results) => {
                    if (error) {
                        return conn.rollback(() => {
                            throw error
                        })
                    }

                    const restaurantId = results.insertId
                    const manRestQuery = `
                        INSERT INTO manager_restaurant
                        (id_user, id_restaurant)
                        VALUES
                        (?,?)
                    `
                    resolve(results)

                    conn.query(manRestQuery, [user.id_user, restaurantId], (error, results) => {
                        if (error) {
                            return conn.rollback(() => {
                                throw error
                            })
                        }

                        for (let i = 0; i < schedule.length; i++) {

                            const query = `
                                INSERT INTO business_hours
                                (id_restaurant, day, openhours, closinghours)
                                VALUES
                                (${restaurantId},${schedule[i].days},'${schedule[i].openhours}','${schedule[i].closinghours}')
                            `

                            conn.query(query, (error, results) => {
                                if (error) {
                                    return conn.rollback(() => {
                                        throw error
                                    })
                                }
                                resolve(results)

                                conn.commit(() => {
                                    if (err) {
                                        return conn.rollback(() => {
                                            throw err
                                        })
                                    }
                                })

                                resolve(results)
                            })
                        }
                    })
                })
            })
        })
    }

    static fetchAll() {
        return new Promise((resolve, reject) => {
            const query = `
                id_restaurant, name, type, street, number, municipality, city, state,
                createdAt, updatedAt
                FROM restaurants
            `

            pool.query(query, (error, results) => {
                if (error) reject(error)

                resolve(results)
            })
        })
    }

    static findById(id: string): Promise<IRestaurant | null> {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT *
                FROM restaurants
                WHERE id_restaurant=?
            `

            pool.query(query, [id], (error, results: IRestaurant[]) => {
                if (error) reject(error)

                resolve(results.length === 1 ? results[0] : null)
            })
        })
    }

    static findWithUser(id: string | number): Promise<IRestaurant | null> {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT restaurants.*
                FROM restaurants
                RIGHT JOIN manager_restaurant
                ON restaurants.id_restaurant=manager_restaurant.id_restaurant
                LEFT JOIN users
                ON manager_restaurant.id_user=users.id_user
                WHERE users.id_user=${id}
            `

            pool.query(query, (error, results: IRestaurant[]) => {
                if (error) reject(error)

                resolve(results.length === 1 ? results[0] : null)
            })
        })
    }

    static findWithSchedule(id: string): Promise<IBusinessHours | null> {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT business_hours.*
                FROM business_hours
                RIGHT JOIN restaurants
                ON business_hours.id_restaurant = restaurants.id_restaurant
                WHERE restaurants.id_restaurant = ?
            `

            pool.query(query, [id], (error, results: IBusinessHours) => {
                if (error) reject(error)

                resolve(results)
            })
        })
    }

    static findBy(column: string, value: string): Promise<IRestaurant | null> {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT
                id_restaurant, name, type, street, number, municipality, city, state,
                createdAt, updatedAt
                FROM restaurants
                WHERE ${column}='${value}'
            `

            pool.query(query, (error, results: IRestaurant[]) => {
                if (error) reject(error)

                resolve(results.length === 1 ? results[0] : null)
            })
        })
    }

    static deleteById(id: string | number) {
        return new Promise((resolve, reject) => {
            const query = `DELETE FROM restaurants WHERE id_restaurant=?`

            pool.query(query, [id], (error, results) => {
                if (error) reject(error)

                resolve(results)
            })
        })
    }

    static findOne(query: string) {
        return new Promise((resolve, reject) => {
            pool.query(query, (error, results) => {
                if (error) reject(error)

                resolve(results)
            })
        })
    }

    updateById(restaurant: IRestaurant, id: string | number, schedule?: any) {
        return new Promise(async (resolve, reject) => {
            try {
                await db.beginTransaction()

                const restaurantQuery = `
                    UPDATE restaurants
                    SET
                        name='${restaurant.name}',
                        type='${restaurant.type}',
                        street='${restaurant.street}',
                        number='${restaurant.number}',
                        municipality='${restaurant.municipality}',
                        city='${restaurant.city}',
                        state='${restaurant.state}',
                        phone='${restaurant.phone}'
                    WHERE id_restaurant=${id}
                `
                const updateRestaurant = await db.query(restaurantQuery)

                if (schedule.length > 0) {
                    for (let i = 0; i < schedule.length; i++) {
                        const query = `
                            UPDATE business_hours
                            SET
                                day=${schedule[i].days},
                                openhours='${schedule[i].openhours}',
                                closinghours='${schedule[i].closinghours}'
                            WHERE id_restaurant=${id}
                        `

                        await db.query(query)
                    }
                }

                const results = await db.commit()
                resolve(results)
            } catch (error) {
                await db.rollback()
                reject(error)
            } finally {
                await db.close()
            }
        })
    }
}