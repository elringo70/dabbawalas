"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orders_controllers_1 = require("../controllers/orders.controllers");
const jwt_1 = __importDefault(require("../middlewares/jwt"));
class OrderRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/getNewOrderPage', jwt_1.default.checkJWT, orders_controllers_1.ordersController.getOrdersPage);
    }
}
const orderRoutes = new OrderRoutes();
exports.default = orderRoutes.router;
