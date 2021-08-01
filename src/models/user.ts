import { ICustomer } from '../interfaces/IUsers'
import { IReqRest } from '../interfaces/IRestaurant'
import { pool } from '../utils/database'

export default class User {
    save(data: ICustomer) {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO users SET ?`

            pool.query(query, [data], (error, results) => {
                if (error) reject(error)

                resolve(results)
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

    static findById(id: string): Promise<ICustomer | null> {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT
                id_user, email, pass, name, lastname, maternalsurname, dob, street,
                number, municipality, city, state, phone, gender, usertype, position,
                license, image, lastpurchase, active, verified, createdAt, updatedAt
                FROM users 
                WHERE id_user=?
            `

            pool.query(query, [id], (error, results: ICustomer[]) => {
                if (error) reject(error)

                resolve(results.length === 1 ? results[0] : null)
            })
        })
    }

    static findBy(column: string, value: string): Promise<ICustomer | null> {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT
                id_user, email, pass, name, lastname, maternalsurname, dob, street,
                number, municipality, city, state, phone, gender, usertype, position,
                license, image, lastpurchase, active, verified, createdAt, updatedAt
                FROM users
                WHERE ${column}='${value}'
            `

            pool.query(query, (error, results: ICustomer[]) => {
                if (error) reject(error)

                resolve(results.length === 1 ? results[0] : null)
            })
        })
    }

    static findByVerified(id: string): Promise<ICustomer | null> {
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

            pool.query(query, [id], (error, results: ICustomer[])=>{
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

    updateById(id: string, data: ICustomer) {
        return new Promise((resolve, reject) => {
            const query = `UPDATE users SET ? WHERE id_user=?`

            pool.query(query, [data, id], (error, results) => {
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