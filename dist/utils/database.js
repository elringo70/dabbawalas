"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncConn = exports.conn = exports.pool = void 0;
const mysql_1 = __importDefault(require("mysql"));
const util_1 = __importDefault(require("util"));
const poolConfig = {
    host: 'us-cdbr-east-04.cleardb.com',
    user: 'b1c97ef4c685ed',
    database: 'heroku_95d44d52299a0eb',
    password: 'fb8b618a'
};
exports.pool = mysql_1.default.createPool(poolConfig);
exports.conn = mysql_1.default.createConnection({
    host: 'us-cdbr-east-04.cleardb.com',
    user: 'b1c97ef4c685ed',
    database: 'heroku_95d44d52299a0eb',
    password: 'fb8b618a'
});
function asyncConn() {
    const connection = mysql_1.default.createConnection({
        host: 'us-cdbr-east-04.cleardb.com',
        user: 'b1c97ef4c685ed',
        database: 'heroku_95d44d52299a0eb',
        password: 'fb8b618a'
    });
    return {
        query(query) {
            return util_1.default.promisify(connection.query).call(connection, query);
        },
        close() {
            return util_1.default.promisify(connection.end).call(connection);
        },
        beginTransaction() {
            return util_1.default.promisify(connection.beginTransaction).call(connection);
        },
        commit() {
            return util_1.default.promisify(connection.commit).call(connection);
        },
        rollback() {
            return util_1.default.promisify(connection.rollback).call(connection);
        }
    };
}
exports.asyncConn = asyncConn;
/* host: 'localhost',
user: 'root',
database: 'dabbawalas',
password: '' */
/* host: 'us-cdbr-east-04.cleardb.com',
user: 'b1c97ef4c685ed',
database: 'heroku_95d44d52299a0eb',
password: 'fb8b618a' */
//mysql://b1c97ef4c685ed:fb8b618a@us-cdbr-east-04.cleardb.com/heroku_95d44d52299a0eb?reconnect=true
