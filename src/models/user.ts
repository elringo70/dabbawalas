import { IReqRest } from '../interfaces/IRestaurant'
import { pool, asyncConn } from '../utils/database'
import { IAdmin, ICashier, ICooker } from '../interfaces/IUsers'
import { IAddress } from '../interfaces/IAddresses'

export default class User {
    saveCooker(cooker: ICooker) {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO users SET ?`

            pool.query(query, [cooker], (error, results) => {
                if (error) reject(error)

                resolve(results)
            })
        })
    }

    saveCashier(cashier: ICashier, address: IAddress) {
        return new Promise(async (resolve, reject) => {
            const db = asyncConn()
            try {
                await db.beginTransaction()

                const addressQuery = `
                    INSERT INTO addresses
                    (id_municipality, id_city, id_state, street, number)
                    VALUES
                    (${address.id_municipality},
                    ${address.id_city},
                    ${address.id_state},
                    '${address.street}',
                    '${address.number}')
                `
                const newAddress: any = await db.query(addressQuery)

                const cashierQuery = `
                    INSERT INTO users
                    (
                        name,
                        lastname,
                        maternalsurname,
                        dob,
                        phone,
                        usertype,
                        active,
                        email,
                        pass,
                        id_restaurant,
                        id_address
                    )
                        VALUES
                    (
                        '${cashier.name}',
                        '${cashier.lastname}',
                        '${cashier.maternalsurname}',
                        '${cashier.dob}',
                        '${cashier.phone}',
                        '${cashier.usertype}',
                        ${cashier.active},
                        '${cashier.email}',
                        '${cashier.pass}',
                        ${cashier.id_restaurant},
                        ${newAddress.insertId}
                    )
                `
                const newCashier = await db.query(cashierQuery)
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

    static fetchAllCashiers(query: string): Promise<ICashier[] | null> {
        return new Promise(async (resolve, reject) => {
            pool.query(query, (error, results: ICashier[]) => {
                if (error) reject(error)

                resolve(results.length > 0 ? results : null)
            })
        })
    }

    static fetchAll() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT
                id_user, email, pass, name, lastname, maternalsurname, dob, street,
                number, municipality, city, state, phone, gender, usertype, position,
                license, image, lastpurchase, active, verified, createdAt, updatedAt
                FROM users
            `

            pool.query(query, (error, results) => {
                if (error) reject(error)

                resolve(results)
            })
        })
    }

    static findById(id: string): Promise<any | null> {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT *
                FROM users 
                WHERE id_user=?
            `

            pool.query(query, [id], (error, results) => {
                if (error) reject(error)

                resolve(results.length === 1 ? results[0] : null)
            })
        })
    }

    static findBy(query: string): Promise<any | null> {
        return new Promise((resolve, reject) => {
            pool.query(query, (error, results) => {
                if (error) reject(error)

                if (results === undefined) {
                    return null
                }
                resolve(results.length === 1 ? results[0] : null)
            })
        })
    }

    static findByVerified(id: string): Promise<any | null> {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT
                id_user, email, pass, name, lastname, maternalsurname, dob, street,
                number, municipality, city, state, phone, gender, usertype, position,
                license, image, lastpurchase, active, verified, createdAt, updatedAt
                FROM users 
                WHERE id_user=?
                AND verified='VERIFIED'
            `

            pool.query(query, [id], (error, results) => {
                if (error) reject(error)

                resolve(results.length === 1 ? results[0] : null)
            })
        })
    }

    static findWithRestaurant(id: string) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT restaurants.*
                FROM restaurants, users, manager_restaurant
                WHERE users.id_user = ?
                AND manager_restaurant.id_user = users.id_user
                AND restaurants.id_restaurant = manager_restaurant.id_restaurant
            `

            pool.query(query, [id], (error, results: IReqRest) => {
                if (error) reject(error)

                resolve(results)
            })
        })
    }

    static fetchAllAny(query: string): Promise<IAdmin[] | null> {
        return new Promise((resolve, reject) => {
            pool.query(query, (error, results: IAdmin[]) => {
                if (error) reject(error)

                if (results === undefined) {
                    return null
                }

                resolve(results.length > 0 ? results : null)
            })
        })
    }

    updateById(query: string) {
        return new Promise((resolve, reject) => {
            pool.query(query, (error, results) => {
                if (error) reject(error)

                resolve(results)
            })
        })
    }

    deleteById(id: string) {
        return new Promise((resolve, reject) => {
            const query = `DELETE FROM users WHERE=?`

            pool.query(query, [id], (error, results) => {
                if (error) reject(error)

                resolve(results)
            })
        })
    }
}