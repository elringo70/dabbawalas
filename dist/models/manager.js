"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../utils/database");
class Manager {
    save(manager, address) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const db = database_1.asyncConn();
            try {
                yield db.beginTransaction();
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
                `;
                const newAddress = yield db.query(managerAddress);
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
                `;
                yield db.query(newManager);
                const results = yield db.commit();
                resolve(results);
            }
            catch (error) {
                yield db.rollback();
                reject(error);
                console.log(error);
            }
            finally {
                yield db.close();
            }
        }));
    }
    static findBy(query) {
        return new Promise((resolve, reject) => {
            database_1.pool.query(query, (error, results) => {
                if (error)
                    reject(error);
                resolve(results.length === 1 ? results[0] : null);
            });
        });
    }
    static findById(id) {
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
            `;
            database_1.pool.query(query, [id], (error, results) => {
                if (error)
                    reject(error);
                resolve(results.length === 1 ? results[0] : null);
            });
        });
    }
    updateById(manager, address) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const db = database_1.asyncConn();
            try {
                yield db.beginTransaction();
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
                `;
                yield db.query(managerQuery);
                const addressQuery = `
                    UPDATE addresses SET
                    id_state=${address.id_state},
                    id_city=${address.id_city},
                    id_municipality=${address.id_municipality},
                    street='${address.street}',
                    number='${address.number}'
                    WHERE id_address=${address.id_address}
                `;
                yield db.query(addressQuery);
                const results = yield db.commit();
                resolve(results);
            }
            catch (error) {
                yield db.rollback();
                reject(error);
                console.log(error);
            }
            finally {
                yield db.close();
            }
        }));
    }
}
exports.default = Manager;
