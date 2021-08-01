"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../utils/database");
class Restaurant {
    save(restaurant, user, schedule) {
        return new Promise((resolve, reject) => {
            database_1.conn.beginTransaction((err) => {
                if (err)
                    reject(err);
                database_1.conn.query('INSERT INTO restaurants SET ?', [restaurant], (error, results) => {
                    if (error) {
                        return database_1.conn.rollback(() => {
                            reject(error);
                        });
                    }
                    const restaurantId = results.insertId;
                    const manRestQuery = `
                        INSERT INTO manager_restaurant
                        (id_user, id_restaurant)
                        VALUES
                        (?,?)
                    `;
                    resolve(results);
                    database_1.conn.query(manRestQuery, [user.id_user, restaurantId], (error, results) => {
                        if (error) {
                            return database_1.conn.rollback(() => {
                                reject(error);
                            });
                        }
                        for (let i = 0; i < schedule.length; i++) {
                            const query = `
                                INSERT INTO business_hours
                                (id_restaurant, day, openhours, closinghours)
                                VALUES
                                (${restaurantId},${schedule[i].day},'${schedule[i].openhours}','${schedule[i].closinghours}')
                            `;
                            database_1.conn.query(query, (error, results) => {
                                if (error) {
                                    return database_1.conn.rollback(() => {
                                        reject(error);
                                    });
                                }
                                resolve(results);
                                database_1.conn.commit(() => {
                                    if (err) {
                                        return database_1.conn.rollback(() => {
                                            reject(err);
                                        });
                                    }
                                });
                                resolve(results);
                            });
                        }
                    });
                });
            });
        });
    }
    static fetchAll() {
        return new Promise((resolve, reject) => {
            const query = `
                id_restaurant, name, type, street, number, municipality, city, state,
                createdAt, updatedAt
                FROM restaurants
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
                SELECT
                id_restaurant, name, type, street, number, municipality, city, state,
                createdAt, updatedAt
                FROM restaurants
                WHERE id_restaurant=?
            `;
            database_1.pool.query(query, [id], (error, results) => {
                if (error)
                    reject(error);
                resolve(results);
            });
        });
    }
    static findWithUser(id) {
        return new Promise((resolve, reject) => {
            const query = `
            SELECT restaurants.*
                FROM restaurants
                RIGHT JOIN manager_restaurant
                ON restaurants.id_restaurant = manager_restaurant.id_restaurant
                LEFT JOIN users
                ON manager_restaurant.id_user = users.id_user
                WHERE users.id_user = ?
            `;
            database_1.pool.query(query, [id], (error, results) => {
                if (error)
                    reject(error);
                resolve(results.length === 1 ? results[0] : null);
            });
        });
    }
    static findWithSchedule(id) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT business_hours.*
                FROM business_hours
                RIGHT JOIN restaurants
                ON business_hours.id_restaurant = restaurants.id_restaurant
                WHERE restaurants.id_restaurant = ?
            `;
            database_1.pool.query(query, [id], (error, results) => {
                if (error)
                    reject(error);
                resolve(results);
            });
        });
    }
    static findBy(column, value) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT
                id_restaurant, name, type, street, number, municipality, city, state,
                createdAt, updatedAt
                FROM restaurants
                WHERE ${column}='${value}'
            `;
            database_1.pool.query(query, (error, results) => {
                if (error)
                    reject(error);
                resolve(results.length === 1 ? results[0] : null);
            });
        });
    }
    /* updateById(id: string) {
        return new Promise((resolve, reject)=>{
            const queryRestObj = {
                name: this.name,
                restaurantType: this.restaurantType,
                street: this.street,
                number: this.number,
                municipality: this.municipality,
                city: this.city,
                state: this.state,
                phone: this.phone,
                businessHours: this.businessHours
            }

            const query = `UPDATE restaurants SET ? WHERE id_restaurant=?`

            pool.query(query, [queryRestObj, id], (error, results)=>{
                if (error) reject (error)

                resolve (results)
            })
        })
    } */
    static deleteById(id) {
        return new Promise((resolve, reject) => {
            const query = `DELETE FROM restaurants WHERE id_restaurant=?`;
            database_1.pool.query(query, [id], (error, results) => {
                if (error)
                    reject(error);
                resolve(results);
            });
        });
    }
}
exports.default = Restaurant;
