import { ICustomer } from '../interfaces/IUsers'
import { pool } from '../utils/database'

export default class Customer {
    save(data: ICustomer) {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO users SET ?`

            pool.query(query, [data], (error, results) => {
                if (error) reject(error)

                resolve(results)
            })
        })
    }

    static fetchAll(id_restaurant: string | number): Promise<ICustomer[] | null> {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT
                id_user, name, lastname, maternalsurname, street, number, municipality, city,
                state, phone, gender, usertype, active, id_restaurant, createdAt, updatedAt
                FROM users
                WHERE id_restaurant=?
                AND usertype='C'
            `

            pool.query(query, [id_restaurant], (error, results: ICustomer[]) => {
                if (error) reject(error)

                resolve(results.length > 0 ? results : null)
            })
        })
    }

    static findById(customer: { id_user: string, id_restaurant: string | number }): Promise<ICustomer | null> {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT
                id_user, name, lastname, maternalsurname, street, number, municipality, city,
                state, phone, gender, usertype, active, id_restaurant
                FROM users
                WHERE id_restaurant=?
                AND id_user=?
            `

            pool.query(query, [customer.id_restaurant, customer.id_user], (error, results: ICustomer[]) => {
                if (error) reject(error)

                resolve(results.length === 1 ? results[0] : null)
            })
        })
    }

    static findBy(customer: { column: string, value: string, id_restaurant: string | number }): Promise<ICustomer | null> {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT
                id_user, name, lastname, maternalsurname, street, number, municipality, city,
                state, phone, gender, usertype, active, id_restaurant, createdAt, updatedAt
                FROM users
                WHERE ${customer.column}='${customer.value}'
                AND id_restaurant=${customer.id_restaurant}
            `

            pool.query(query, (error, results: ICustomer[]) => {
                if (error) reject

                resolve(results.length === 1 ? results[0] : null)
            })
        })
    }

    deleteCustomerByRestaurant(customer: { id_user: string, id_restaurant: string | number | undefined }) {
        return new Promise((resolve, reject) => {
            const query = `
            DELETE FROM users 
            WHERE id_user='${customer.id_user}' AND id_restaurant='${customer.id_restaurant}'`

            pool.query(query, (error, results) => {
                if (error) reject(error)

                resolve(results)
            })
        })
    }

    editCustomerByRestaurant(customer: ICustomer, id: string) {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE users SET
                street='${customer.street}',
                number='${customer.number}',
                municipality='${customer.municipality}',
                city='${customer.city}',
                state='${customer.state}',
                gender='${customer.gender}'
                WHERE id_user=${id}
            `

            const q = pool.query(query, (error, results)=>{
                if (error) reject(error)

                resolve(results)
            })

            console.log(q.sql)
        })
    }
}