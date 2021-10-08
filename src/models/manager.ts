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
}