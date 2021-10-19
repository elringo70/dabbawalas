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
class Restaurant {
    save(id, restaurant, address, schedule) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const db = database_1.asyncConn();
            try {
                db.beginTransaction();
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
                const restaurantQuery = `
                    INSERT INTO restaurants
                    (name, type, phone,description, id_address)
                    VALUES
                    (
                        '${restaurant.name}',
                        '${restaurant.type}',
                        '${restaurant.phone}',
                        '${restaurant.description}',
                        ${newAddress.insertId}
                    )
                `;
                const newRestaurant = yield db.query(restaurantQuery);
                const managerRestaurantQuery = `
                    INSERT INTO manager_restaurant
                    (id_user, id_restaurant, active)
                    VALUES
                    (
                        ${id},
                        ${newRestaurant.insertId},
                        1
                    )
                `;
                const manager_restaurant = yield db.query(managerRestaurantQuery);
                for (let i = 0; i < schedule.length; i++) {
                    const scheduleQuery = `
                        INSERT INTO business_hours
                        (id_restaurant, day, openhours, closinghours)
                        VALUES
                        (
                            ${newRestaurant.insertId},
                            ${schedule[i].day},
                            '${schedule[i].openhours}',
                            '${schedule[i].closinghours}'
                        )
                    `;
                    const newSchedule = yield db.query(scheduleQuery);
                }
                const results = db.commit();
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
    static findById(id) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT *
                FROM restaurants
                WHERE id_restaurant=?
            `;
            database_1.pool.query(query, [id], (error, results) => {
                if (error)
                    reject(error);
                resolve(results.length === 1 ? results[0] : null);
            });
        });
    }
    static findWithUser(id) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT restaurants.*
                FROM restaurants
                RIGHT JOIN manager_restaurant
                ON restaurants.id_restaurant=manager_restaurant.id_restaurant
                LEFT JOIN users
                ON manager_restaurant.id_user=users.id_user
                WHERE users.id_user=${id}
            `;
            database_1.pool.query(query, (error, results) => {
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
    static deleteById(query) {
        return new Promise((resolve, reject) => {
            database_1.pool.query(query, (error, results) => {
                if (error)
                    reject(error);
                resolve(results);
            });
        });
    }
    static findOne(query) {
        return new Promise((resolve, reject) => {
            database_1.pool.query(query, (error, results) => {
                if (error)
                    reject(error);
                resolve(results);
            });
        });
    }
    updateById(restaurant, address, schedule) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const db = database_1.asyncConn();
            try {
                yield db.beginTransaction();
                const restaurantQuery = `
                    UPDATE restaurants
                    SET
                        name='${restaurant.name}',
                        type='${restaurant.type}',
                        phone='${restaurant.phone}',
                        description='${restaurant.description}'
                    WHERE id_restaurant=${restaurant.id_restaurant}
                `;
                yield db.query(restaurantQuery);
                const addressQuery = `
                    UPDATE addresses SET
                        id_state=${address.id_state},
                        id_city=${address.id_city},
                        id_municipality=${address.id_municipality},
                        number='${address.number}',
                        street='${address.street}'
                    WHERE id_address=${address.id_address}
                `;
                yield db.query(addressQuery);
                if (schedule) {
                    for (let i = 0; i < schedule.length; i++) {
                        const query = `
                            INSERT INTO business_hours
                            (id_restaurant, day, openhours, closinghours)
                            VALUES
                            (
                                ${restaurant.id_restaurant},
                                ${schedule[i].day},
                                '${schedule[i].openhours}',
                                '${schedule[i].closinghours}'
                            )
                        `;
                        yield db.query(query);
                    }
                }
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
exports.default = Restaurant;
