import { asyncConn, pool } from '../utils/database'
import { IManager } from '../interfaces/IUsers'
import { IAddress } from '../interfaces/IAddresses'

export default class Manager {
    save(manager: IManager, address: IAddress) {
        return new Promise(async (resolve, reject) => {
            const db = asyncConn()
            try {
                await db.beginTransaction()

                const managerAddress = `
                    INSERT INTO addresses
                    (id_municipality, id_city, id_state, street, number)
                    VALUES
                    (
                        '${address.id_municipality}',
                        '${address.id_city}',
                        '${address.id_state}',
                        '${address.street}',
                        '${address.number}'
                    )
                `
                const newAddress: any = await db.query(managerAddress)

                const newManager = `
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
                        gender,
                        position,
                        verified,
                        id_address
                    ) VALUES
                    (
                        '${manager.name}',
                        '${manager.lastname}',
                        '${manager.maternalsurname}',
                        '${manager.dob}',
                        '${manager.phone}',
                        '${manager.usertype}',
                        '${manager.active}',
                        '${manager.email}',
                        '${manager.pass}',
                        '${manager.gender}',
                        '${manager.position}',
                        '${manager.verified}',
                        '${newAddress.insertId}'
                    )
                `

                await db.query(newManager)

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

    static findBy(query: string): Promise<IManager | null> {
        return new Promise((resolve, reject) => {
            pool.query(query, (error, results: IManager[]) => {
                if (error) reject(error)

                resolve(results.length === 1 ? results[0] : null)
            })
        })
    }

    static findById(id: string | number): Promise<IManager | null> {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT
                    users.id_user, users.email, users.name, users.lastname, users.maternalsurname,
                    users.dob, users.phone, users.usertype, users.active,
                    users.email, users.gender, users.position, users.id_address,
                    manager_restaurant.id_restaurant,
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
                JOIN manager_restaurant
                    ON users.id_user = manager_restaurant.id_user
                JOIN estados
                    ON addresses.id_state = estados.id
                JOIN municipios
                    ON addresses.id_city = municipios.id
                JOIN colonias
                    ON addresses.id_municipality = colonias.id
                WHERE users.id_user=?
                AND users.usertype='M'
            `

            pool.query(query, [id], (error, results: IManager[]) => {
                if (error) reject(error)

                resolve(results.length === 1 ? results[0] : null)
            })
        })
    }

    updateById(manager: IManager, address: IAddress) {
        return new Promise(async (resolve, reject) => {
            const db = asyncConn()
            try {
                await db.beginTransaction()
                
                const managerQuery = `
                    UPDATE users SET
                    name='${manager.name}',
                    lastname='${manager.lastname}',
                    maternalsurname='${manager.maternalsurname}',
                    dob='${manager.dob}',
                    gender='${manager.gender}',
                    position='${manager.position}',
                    phone='${manager.phone}'
                    WHERE id_user=${manager.id_user}
                `
                await db.query(managerQuery)

                const addressQuery = `
                    UPDATE addresses SET
                    id_state=${address.id_state},
                    id_city=${address.id_city},
                    id_municipality=${address.id_municipality},
                    street='${address.street}',
                    number='${address.number}'
                    WHERE id_address=${address.id_address}
                `
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