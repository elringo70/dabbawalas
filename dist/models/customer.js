"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../utils/database");
class Customer {
    save(data) {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO users SET ?`;
            database_1.pool.query(query, [data], (error, results) => {
                if (error)
                    reject(error);
                resolve(results);
            });
        });
    }
    static fetchAll(id_restaurant) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT
                id_user, name, lastname, maternalsurname, street, number, municipality, city,
                state, phone, gender, usertype, active, id_restaurant, createdAt, updatedAt
                FROM users
                WHERE id_restaurant=?
                AND usertype='C'
            `;
            database_1.pool.query(query, [id_restaurant], (error, results) => {
                if (error)
                    reject(error);
                resolve(results.length > 0 ? results : null);
            });
        });
    }
    static findById(customer) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT
                id_user, name, lastname, maternalsurname, street, number, municipality, city,
                state, phone, gender, usertype, active, id_restaurant, createdAt, updatedAt
                FROM users
                WHERE id_restaurant=${customer.id_restaurant}
                AND id_user=${customer.id_user}
            `;
            database_1.pool.query(query, [customer.id_user, customer.id_restaurant], (error, results) => {
                if (error)
                    reject(error);
                resolve(results.length === 1 ? results[0] : null);
            });
        });
    }
    static findCustomerBy(customer) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT
                id_user, name, lastname, maternalsurname, street, number, municipality, city,
                state, phone, gender, usertype, active, id_restaurant, createdAt, updatedAt
                FROM users
                WHERE ${customer.column}='${customer.value}'
                AND id_restaurant='${customer.id_restaurant}'
            `;
            database_1.pool.query(query, (error, results) => {
                if (error)
                    reject;
                resolve(results.length === 1 ? results[0] : null);
            });
        });
    }
    deleteCustomerByRestaurant(customer) {
        return new Promise((resolve, reject) => {
            const query = `
            DELETE FROM users 
            WHERE id_user='${customer.id_user}' AND id_restaurant='${customer.id_restaurant}'`;
            database_1.pool.query(query, (error, results) => {
                if (error)
                    reject(error);
                resolve(results);
            });
        });
    }
    editCustomerByRestaurant(customer, id) {
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
            `;
            const q = database_1.pool.query(query, (error, results) => {
                if (error)
                    reject(error);
                resolve(results);
            });
            console.log(q.sql);
        });
    }
}
exports.default = Customer;
