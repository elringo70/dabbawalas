import { IAddress } from '../interfaces/IAddresses'
import { ICustomer } from '../interfaces/IUsers'
import { pool, asyncConn } from '../utils/database'


export default class Customer {
    save(customer: ICustomer, address: IAddress) {
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

                const customerQuery = `
                    INSERT INTO users
                    (name, lastname, maternalsurname, phone, usertype, gender, active, id_restaurant, id_address)
                    VALUES
                    ('${customer.name}',
                    '${customer.lastname}',
                    '${customer.maternalsurname}',
                    '${customer.phone}',
                    '${customer.usertype}',
                    ${customer.gender},
                    '${customer.active}',
                    ${customer.id_restaurant},
                    ${newAddress.insertId})
                `
                await db.query(customerQuery)

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

    static fetchAll(query: string) {
        return new Promise((resolve, reject) => {
            pool.query(query, (error, results) => {
                if (error) reject(error)

                resolve(results)
            })
        })
    }

    static findById(customer: { id_user: string | number, id_restaurant: string | number }): Promise<ICustomer | null> {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT
                    users.id_user, users.name, users.lastname, users.maternalsurname, users.phone, users.usertype,
                    users.gender, users.image, users.lastpurchase, users.active, users.id_restaurant, users.id_address,
                    users.email,
                    estados.nombre AS state,
                    estados.id AS id_state,
                    municipios.nombre AS city,
                    municipios.id AS id_city,
                    colonias.nombre AS municipality,
                    colonias.id AS id_municipality,
                    addresses.number, 
                    addresses.street
                FROM users
                LEFT JOIN addresses
                    ON users.id_address = addresses.id_address
                JOIN estados
                    ON addresses.id_state = estados.id
                JOIN municipios
                    ON addresses.id_city = municipios.id
                JOIN colonias
                    ON addresses.id_municipality = colonias.id
                WHERE id_restaurant=${customer.id_restaurant}
                AND id_user=${customer.id_user}
                AND usertype='C'
            `

            pool.query(query, (error, results: ICustomer[]) => {
                if (error) reject(error)

                resolve(results.length === 1 ? results[0] : null)
            })
        })
    }

    static findBy(query: string): Promise<ICustomer | null> {
        return new Promise((resolve, reject) => {
            pool.query(query, (error, results: ICustomer[]) => {
                if (error) reject

                resolve(results.length === 1 ? results[0] : null)
            })            
        })
    }

    static deleteById(userId: string | number, addressId: string | number) {
        return new Promise(async (resolve, reject) => {
            const db = asyncConn()
            try {
                db.beginTransaction()
                const deleteCustomer = `DELETE FROM users WHERE id_user=${userId}`
                await db.query(deleteCustomer)
                const deleteAddress = `DELETE FROM addresses WHERE id_address=${addressId}`
                db.query(deleteAddress)

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

    editById(customer: ICustomer, address: IAddress) {
        return new Promise(async (resolve, reject) => {
            const db = asyncConn()

            const customerQuery = `
                UPDATE users SET
                name='${customer.name}',
                lastname='${customer.lastname}',
                maternalsurname='${customer.maternalsurname}',
                gender=${customer.gender}
                WHERE id_user=${customer.id_user}
            `
            const addressQuery = `
                UPDATE addresses SET
                    id_state=${address.id_state},
                    id_city=${address.id_city},
                    id_municipality=${address.id_municipality},
                    number='${address.number}',
                    street='${address.street}'
                WHERE id_address=${address.id_address}
            `

            try {
                db.beginTransaction()
                await db.query(customerQuery)
                await db.query(addressQuery)
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