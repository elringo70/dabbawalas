"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ordersController = void 0;
class OrderController {
    getOrdersPage(req, res) {
        res.render('orders/new-order', {
            title: 'Nueva orden',
            active: true,
            loggedIn: true
        });
    }
}
exports.ordersController = new OrderController();
