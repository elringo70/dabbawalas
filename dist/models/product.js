"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../utils/database");
class Product {
    save(data) {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO products SET ?`;
            database_1.pool.query(query, [data], (error, results) => {
                if (error)
                    reject(error);
                resolve(results);
            });
        });
    }
    static fetchAll(query) {
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
    static fetchAllByRestaurant(id) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT products.*
                FROM products
                LEFT JOIN restaurants
                ON products.id_restaurant = restaurants.id_restaurant
                WHERE restaurants.id_restaurant = ?
            `;
            database_1.pool.query(query, [id], (error, results) => {
                if (error)
                    reject(error);
                resolve(results);
            });
        });
    }
    static findById(id, restaurant) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT *
                FROM products
                WHERE id_product=?
                AND id_restaurant=?
                AND active=1
            `;
            database_1.pool.query(query, [id, restaurant], (error, results) => {
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
                resolve(results.length === 1 ? results[0] : null);
            });
        });
    }
    static deleteById(product) {
        return new Promise((resolve, reject) => {
            const query = `
                DELETE FROM products
                WHERE id_product=${product.id_product}
                AND id_restaurant=${product.id_restaurant}
            `;
            database_1.pool.query(query, (error, results) => {
                if (error)
                    reject(error);
                resolve(results);
            });
        });
    }
    updateById(id, product) {
        return new Promise((resolve, reject) => {
            const query = `UPDATE products SET ? WHERE id_product=?`;
            database_1.pool.query(query, [product, id], (error, results) => {
                if (error)
                    reject(error);
                resolve(results);
            });
        });
    }
}
exports.default = Product;
