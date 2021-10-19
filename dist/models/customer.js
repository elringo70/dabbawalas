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
class Customer {
    save(customer, address) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const db = database_1.asyncConn();
            try {
                yield db.beginTransaction();
                const addressQuery = `
                    INSERT INTO addresses
                    (id_municipality, id_city, id_state, street, number)
                    VALUES
                    (${address.id_municipality},
                    ${address.id_city},
                    ${address.id_state},
                    '${address.street}',
                    '${address.number}')
                `;
                const newAddress = yield db.query(addressQuery);
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
                `;
                yield db.query(customerQuery);
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
    static fetchAll(query) {
        return new Promise((resolve, reject) => {
            database_1.pool.query(query, (error, results) => {
                if (error)
                    reject(error);
                resolve(results);
            });
        });
    }
    static findById(customer) {
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
            `;
            database_1.pool.query(query, (error, results) => {
                if (error)
                    reject(error);
                resolve(results.length === 1 ? results[0] : null);
            });
        });
    }
    static findBy(query) {
        return new Promise((resolve, reject) => {
            database_1.pool.query(query, (error, results) => {
                if (error)
                    reject;
                resolve(results.length === 1 ? results[0] : null);
            });
        });
    }
    static deleteById(userId, addressId) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const db = database_1.asyncConn();
            try {
                db.beginTransaction();
                const deleteCustomer = `DELETE FROM users WHERE id_user=${userId}`;
                yield db.query(deleteCustomer);
                const deleteAddress = `DELETE FROM addresses WHERE id_address=${addressId}`;
                db.query(deleteAddress);
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
    editById(customer, address) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const db = database_1.asyncConn();
            const customerQuery = `
                UPDATE users SET
                name='${customer.name}',
                lastname='${customer.lastname}',
                maternalsurname='${customer.maternalsurname}',
                gender=${customer.gender}
                WHERE id_user=${customer.id_user}
            `;
            const addressQuery = `
                UPDATE addresses SET
                    id_state=${address.id_state},
                    id_city=${address.id_city},
                    id_municipality=${address.id_municipality},
                    number='${address.number}',
                    street='${address.street}'
                WHERE id_address=${address.id_address}
            `;
            try {
                db.beginTransaction();
                yield db.query(customerQuery);
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
exports.default = Customer;
