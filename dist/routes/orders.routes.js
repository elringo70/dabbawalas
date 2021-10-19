"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orders_controllers_1 = require("../controllers/orders.controllers");
const express_validator_1 = require("express-validator");
const jwt_1 = __importDefault(require("../middlewares/jwt"));
const roles_1 = require("../middlewares/roles");
class OrderRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/getNewOrderPage', [jwt_1.default.checkJWT, roles_1.checkRole(['M', 'CA'])], orders_controllers_1.ordersController.getNewOrdersPage);
        //Post new order
        this.router.post('/postNewOrder', [jwt_1.default.checkJWT, roles_1.checkRole(['M', 'CA'])], orders_controllers_1.ordersController.postNewOrder);
        this.router.get('/getAllTodayOrders', [jwt_1.default.checkJWT, roles_1.checkRole(['M', 'CO', 'CA'])], orders_controllers_1.ordersController.getAllTodayOrders);
        this.router.get('/getAllTodayOrdersPage', [jwt_1.default.checkJWT, roles_1.checkRole(['M', 'CA'])], orders_controllers_1.ordersController.getAllTodayOrdersPage);
        this.router.post('/postCompleteOrder', [jwt_1.default.checkJWT, roles_1.checkRole(['M', 'CO'])], orders_controllers_1.ordersController.postCompleteOrder);
        this.router.delete('/cancelOrderById/:id', [jwt_1.default.checkJWT, roles_1.checkRole(['M', 'A'])], orders_controllers_1.ordersController.cancelOrderById);
        this.router.get('/loadDashboard', [jwt_1.default.checkJWT, roles_1.checkRole(['M'])], [
            express_validator_1.check('quantity')
                .trim()
                .not().isEmpty().withMessage('Debe enviar la cantidad de productos'),
            express_validator_1.check('product')
                .trim()
                .not().isEmpty().withMessage('Debe enviar los el código del producto')
        ], orders_controllers_1.ordersController.loadDashboard);
        this.router.get('/findExistingOrder/:phone', [jwt_1.default.checkJWT, roles_1.checkRole(['M'])], orders_controllers_1.ordersController.findExistingOrder);
        //Admin
        this.router.get('/getOrderDetailPage/:id&:restaurant', [jwt_1.default.checkJWT, roles_1.checkRole(['CO', 'M', 'A', 'CA'])], orders_controllers_1.ordersController.getOrderDetailPage);
        this.router.get('/getAllRestaurantsOrdersPage', [jwt_1.default.checkJWT, roles_1.checkRole(['A'])], orders_controllers_1.ordersController.getAllRestaurantsOrdersPage);
        this.router.get('/getAllRestaurantsOrders', [jwt_1.default.checkJWT, roles_1.checkRole(['A'])], orders_controllers_1.ordersController.getAllRestaurantsOrders);
        //Cooker routes
        this.router.get('/getAllTodayOrdersCookerPage', [jwt_1.default.checkJWT, roles_1.checkRole(['CO'])], orders_controllers_1.ordersController.getAllTodayOrdersCookerPage);
    }
}
const orderRoutes = new OrderRoutes();
exports.default = orderRoutes.router;
