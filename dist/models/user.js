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
class User {
    saveEmployee(employee, address) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const db = database_1.asyncConn();
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
                `;
                const newAddress = yield db.query(addressQuery);
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
                `;
                yield db.query(employeeQuery);
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
    static fetchAll() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT
                id_user, email, pass, name, lastname, maternalsurname, dob, street,
                number, municipality, city, state, phone, gender, usertype, position,
                license, image, lastpurchase, active, verified, createdAt, updatedAt
                FROM users
            `;
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
                SELECT *
                FROM users 
                WHERE id_user=?
            `;
            database_1.pool.query(query, [id], (error, results) => {
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
                    reject(error);
                if (results === undefined) {
                    return null;
                }
                resolve(results.length === 1 ? results[0] : null);
            });
        });
    }
    static findByVerified(id) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT
                id_user, email, pass, name, lastname, maternalsurname, dob, street,
                number, municipality, city, state, phone, gender, usertype, position,
                license, image, lastpurchase, active, verified, createdAt, updatedAt
                FROM users 
                WHERE id_user=?
                AND verified='VERIFIED'
            `;
            database_1.pool.query(query, [id], (error, results) => {
                if (error)
                    reject(error);
                resolve(results.length === 1 ? results[0] : null);
            });
        });
    }
    static findWithRestaurant(id) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT restaurants.*
                FROM restaurants, users, manager_restaurant
                WHERE users.id_user = ?
                AND manager_restaurant.id_user = users.id_user
                AND restaurants.id_restaurant = manager_restaurant.id_restaurant
            `;
            database_1.pool.query(query, [id], (error, results) => {
                if (error)
                    reject(error);
                resolve(results);
            });
        });
    }
    static fetchAllAny(query) {
        return new Promise((resolve, reject) => {
            database_1.pool.query(query, (error, results) => {
                if (error)
                    reject(error);
                if (results === undefined) {
                    return null;
                }
                resolve(results.length > 0 ? results : null);
            });
        });
    }
    updateById(query) {
        return new Promise((resolve, reject) => {
            database_1.pool.query(query, (error, results) => {
                if (error)
                    reject(error);
                resolve(results);
            });
        });
    }
    static deleteById(id, id_restaurant) {
        return new Promise((resolve, reject) => {
            const query = `
            DELETE FROM users
            WHERE id_user=?
                AND id_restaurant=?
            `;
            database_1.pool.query(query, [id, id_restaurant], (error, results) => {
                if (error)
                    reject(error);
                resolve(results);
            });
        });
    }
}
exports.default = User;
