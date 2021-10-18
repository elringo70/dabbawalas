import { IReqRest } from '../interfaces/IRestaurant'
import { pool, asyncConn } from '../utils/database'
import { IAdmin, IEmployee } from '../interfaces/IUsers'
import { IAddress } from '../interfaces/IAddresses'

export default class User {
    saveEmployee(employee: IEmployee, address: IAddress) {
        return new Promise(async (resolve, reject) => {
            const db = asyncConn()
            try {
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

                const employeeQuery = `
                    INSERT INTO users
                    (name, lastname, maternalsurname, pass, dob, email, gender, usertype, phone, active, id_restaurant, id_address)
                    VALUES
                    (
                        '${employee.name}',
                        '${employee.lastname}',
                        '${employee.maternalsurname}',
                        '${employee.pass}',
                        '${employee.dob}',
                        '${employee.email}',
                        '${employee.gender}',
                        '${employee.usertype}',
                        '${employee.phone}',
                        '${employee.active}',
                        ${employee.id_restaurant},
                        ${newAddress.insertId}
                    )
                `
                await db.query(employeeQuery)

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

    static fetchAllAny(query: string): Promise<any[] | null> {
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

    static deleteById(id: string | number, id_restaurant: string | number) {
        return new Promise((resolve, reject) => {
            const query = `
            DELETE FROM users
            WHERE id_user=?
                AND id_restaurant=?
            `

            pool.query(query, [id, id_restaurant], (error, results) => {
                if (error) reject(error)

                resolve(results)
            })
        })
    }
}