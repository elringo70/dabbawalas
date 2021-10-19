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
class Order {
    save(orderObject, orderDetailArray) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const db = database_1.asyncConn();
            try {
                yield db.beginTransaction();
                const orderQuery = `
                    INSERT INTO orders
                    (total, orderstatus, id_restaurant, id_user)
                    VALUES
                    (
                        ${orderObject.total},
                        '${orderObject.orderstatus}',
                        ${orderObject.id_restaurant},
                        ${orderObject.id_user}
                    )
                `;
                const newOrder = yield db.query(orderQuery);
                for (let i = 0; i < orderDetailArray.length; i++) {
                    const query = `
                        INSERT INTO order_detail
                        (id_order, id_product, id_restaurant, quantity)
                        VALUES
                        (
                            ${newOrder.insertId},
                            ${orderDetailArray[i].id_product},
                            ${orderDetailArray[i].id_restaurant},
                            ${orderDetailArray[i].quantity}
                        )
                    `;
                    yield db.query(query);
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
    static findOne(query) {
        return new Promise((resolve, reject) => {
            database_1.pool.query(query, (error, results) => {
                if (error)
                    reject(error);
                resolve(results.length === 1 ? results[0] : null);
            });
        });
    }
    static fetchAll(order) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT orders.*, users.name, users.lastname, users.phone
                FROM orders
                LEFT JOIN users
                ON orders.id_user = users.id_user
                WHERE orders.id_restaurant=?
                AND orderstatus='opened'
                ORDER BY orders.createdAt DESC
            `;
            database_1.pool.query(query, [order.id_restaurant], (error, results) => {
                if (error)
                    reject(error);
                resolve(results.length > 0 ? results : null);
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
    static updateCompleteOrder(id) {
        return new Promise((resolve, reject) => {
            const query = `UPDATE orders SET orderstatus='completed' WHERE id_order=?`;
            database_1.pool.query(query, [id], (error, results) => {
                if (error)
                    reject(error);
                resolve(results);
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
}
exports.default = Order;
