import { IAddress } from '../interfaces/IAddresses'
import { pool } from '../utils/database'

export default class Addresses {
    static fetchAll(query: string) {
        return new Promise((resolve, reject) => {
            pool.query(query, (error, results) => {
                if (error) reject(error)

                resolve(results)
            })
        })
    }

    static findById(id: string): Promise<IAddress | null> {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT
                    addresses.number, addresses.street,
                    municipios.nombre AS city,
                    municipios.id AS id_city,
                    estados.nombre AS state,
                    estados.id AS id_state,
                    colonias.nombre AS municipality,
                    colonias.id AS id_municipality
                FROM addresses
                JOIN colonias
                    ON addresses.id_municipality=colonias.id
                JOIN municipios
                    ON addresses.id_city=municipios.id
                JOIN estados
                    ON addresses.id_state=estados.id
                WHERE id_address=?
            `

            pool.query(query, [id], (error, results: IAddress[]) => {
                if (error) reject(error)

                resolve(results.length === 1 ? results[0] : null)
            })
        })
    }
}