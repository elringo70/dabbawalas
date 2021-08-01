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
    static fetchAll() {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM products`;
            database_1.pool.query(query, (error, results) => {
                if (error)
                    reject(error);
                resolve(results);
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
    static findOne(id) {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM products WHERE id_product=?`;
            database_1.pool.query(query, [id], (error, results) => {
                if (error)
                    reject(error);
                resolve(results);
            });
        });
    }
    /* updateById(id: string) {
        return new Promise((resolve, reject)=>{
            const queryObj = {
                name: this.name,
                cost: this.cost,
                price: this.price,
                image: this.image,
                description: this.description
            }

            const query = `UPDATE products SET ? WHERE id_product=?`

            pool.query(query, [queryObj, id], (error, results)=>{
                if (error) reject (error)

                resolve (results)
            })
        })
    } */
    static deleteById(id) {
        return new Promise((resolve, reject) => {
            const query = `DELETE FROM products WHERE id_product=?`;
            database_1.pool.query(query, [id], (error, results) => {
                if (error)
                    reject(error);
                resolve(results);
            });
        });
    }
}
exports.default = Product;
