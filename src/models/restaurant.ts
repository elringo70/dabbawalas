import { pool, conn, asyncConn } from '../utils/database'
import { ICustomer } from '../interfaces/IUsers'
import { IRestaurant, IBusinessHours } from '../interfaces/IRestaurant'
import { IAddress } from '../interfaces/IAddresses'

export default class Restaurant {
    save
        (
            id: string | number,
            restaurant: IRestaurant,
            address: IAddress,
            schedule: IBusinessHours[]
        ) {
        return new Promise(async (resolve, reject) => {
            const db = asyncConn()
            try {
                db.beginTransaction()
                const addressQuery = `
                    INSERT INTO addresses
                    (id_state, id_city, id_municipality, number, street)
                    VALUES
                    (
                        '${address.id_state}',
                        '${address.id_city}',
                        '${address.id_municipality}',
                        '${address.number}',
                        '${address.street}'
                    )
                `
                const newAddress: any = await db.query(addressQuery)

                const restaurantQuery = `
                    INSERT INTO restaurants
                    (name, type, phone,description, id_address)
                    VALUES
                    (
                        '${restaurant.name}',
                        '${restaurant.type}',
                        '${restaurant.phone}',
                        '${restaurant.description}',
                        ${newAddress.insertId}
                    )
                `
                const newRestaurant: any = await db.query(restaurantQuery)

                const managerRestaurantQuery = `
                    INSERT INTO manager_restaurant
                    (id_user, id_restaurant, active)
                    VALUES
                    (
                        ${id},
                        ${newRestaurant.insertId},
                        1
                    )
                `
                const manager_restaurant = await db.query(managerRestaurantQuery)

                for (let i = 0; i < schedule.length; i++) {
                    const scheduleQuery = `
                        INSERT INTO business_hours
                        (id_restaurant, day, openhours, closinghours)
                        VALUES
                        (
                            ${newRestaurant.insertId},
                            ${schedule[i].day},
                            '${schedule[i].openhours}',
                            '${schedule[i].closinghours}'
                        )
                    `
                    const newSchedule = await db.query(scheduleQuery)
                }
                const results = db.commit()
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

    static fetchAll(query: string) {
        return new Promise((resolve, reject) => {
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

    static deleteById(query: string) {
        return new Promise((resolve, reject) => {
            pool.query(query, (error, results) => {
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

    updateById(restaurant: IRestaurant, address: IAddress, schedule?: IBusinessHours[]) {
        return new Promise(async (resolve, reject) => {
            const db = asyncConn()
            try {
                await db.beginTransaction()

                const restaurantQuery = `
                    UPDATE restaurants
                    SET
                        name='${restaurant.name}',
                        type='${restaurant.type}',
                        phone='${restaurant.phone}',
                        description='${restaurant.description}'
                    WHERE id_restaurant=${restaurant.id_restaurant}
                `
                await db.query(restaurantQuery)

                const addressQuery = `
                    UPDATE addresses SET
                        id_state=${address.id_state},
                        id_city=${address.id_city},
                        id_municipality=${address.id_municipality},
                        number='${address.number}',
                        street='${address.street}'
                    WHERE id_address=${address.id_address}
                `
                await db.query(addressQuery)

                if (schedule) {
                    for (let i = 0; i < schedule.length; i++) {
                        const query = `
                            INSERT INTO business_hours
                            (id_restaurant, day, openhours, closinghours)
                            VALUES
                            (
                                ${restaurant.id_restaurant},
                                ${schedule[i].day},
                                '${schedule[i].openhours}',
                                '${schedule[i].closinghours}'
                            )
                        `
                        await db.query(query)
                    }
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
}