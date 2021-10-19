"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../utils/database");
class Addresses {
    static fetchAll(query) {
        return new Promise((resolve, reject) => {
            database_1.pool.query(query, (error, results) => {
                if (error)
                    reject(error);
                resolve(results);
            });
        });
    }
    static findById(id) {
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
            `;
            database_1.pool.query(query, [id], (error, results) => {
                if (error)
                    reject(error);
                resolve(results.length === 1 ? results[0] : null);
            });
        });
    }
}
exports.default = Addresses;
