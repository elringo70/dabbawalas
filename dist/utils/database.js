"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.conn = exports.pool = void 0;
const mysql_1 = __importDefault(require("mysql"));
const poolConfig = {
    host: 'localhost',
    user: 'root',
    database: 'dabbawalas',
    password: ''
};
exports.pool = mysql_1.default.createPool(poolConfig);
exports.conn = mysql_1.default.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'dabbawalas',
    password: ''
});
