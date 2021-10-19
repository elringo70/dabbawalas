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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ordersController = void 0;
const product_1 = __importDefault(require("../models/product"));
const orders_1 = __importDefault(require("../models/orders"));
const express_validator_1 = require("express-validator");
const customer_1 = __importDefault(require("../models/customer"));
const user_1 = __importDefault(require("../models/user"));
class OrderController {
    getNewOrdersPage(req, res) {
        const profile = res.locals.profile;
        profile.title = 'Nueva orden';
        res.render('orders/new-order', profile);
    }
    getAllTodayOrdersPage(req, res) {
        const profile = res.locals.profile;
        profile.title = 'Ordenes del día';
        res.render('orders/get-all-orders', profile);
    }
    getAllTodayOrdersCookerPage(req, res) {
        const profile = res.locals.profile;
        profile.title = 'Ordenes del día';
        res.render('orders/cooking-dashboard', profile);
    }
    getAllRestaurantsOrdersPage(req, res) {
        const profile = res.locals.profile;
        profile.title = 'Live orders';
        res.render('orders/restaurants-orders', profile);
    }
    getOrderDetailPage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, restaurant } = req.params;
            const profile = res.locals.profile;
            profile.title = 'Detalle de la orden';
            try {
                const orderDetailQuery = `
                SELECT
                    order_detail.id_restaurant, order_detail.quantity, products.*
                FROM order_detail
                JOIN products
                    ON order_detail.id_product = products.id_product
                WHERE order_detail.id_restaurant=${restaurant}
                    AND order_detail.id_order=${id}
            `;
                const orderDetail = yield orders_1.default.fetchAllAny(orderDetailQuery);
                if (!orderDetail) {
                    profile.message = 'La el del platillo enviado no existe';
                    return res.render('orders/order-detail', profile);
                }
                profile.orderDetail = orderDetail;
                res.render('orders/order-detail', profile);
            }
            catch (error) {
                if (error)
                    console.log(error);
                profile.message = 'Error al buscar la orden';
                res.render('orders/order-detail', profile);
            }
        });
    }
    getAllRestaurantsOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = res.locals.token;
            try {
                const query = `
                SELECT orders.*, restaurants.name
                FROM orders
                JOIN restaurants
                ON orders.id_restaurant = restaurants.id_restaurant
                WHERE orderstatus='opened'
            `;
                const orders = yield orders_1.default.fetchAllAny(query);
                res.status(200).json(orders);
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    status: 304,
                    errorMessage: 'Error while loading all restaurant orders'
                });
            }
        });
    }
    postNewOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = express_validator_1.validationResult(req);
            const error = errors.array();
            const user = res.locals.token;
            const body = req.body;
            const productQuantity = body.quantity;
            let productsPrice = [];
            try {
                if (!errors.array()) {
                    return res.json({
                        status: 304,
                        message: error[0].msg
                    });
                }
                const orderObject = {
                    quantity: body.quantity,
                    id_product: body.product,
                    price: body.price,
                    phone: body.phone
                };
                const length = orderObject.quantity.length;
                let orderDetailArray = [];
                for (let i = 0; i < length; i++) {
                    const productPrice = yield product_1.default.findById(orderObject.id_product[i], user.id_restaurant);
                    if (!productPrice) {
                        return res.json({
                            status: 304,
                            message: 'El id del platillo no existe'
                        });
                    }
                    productsPrice[i] = productPrice.price;
                    const orderDetail = {
                        id_product: body.product[i],
                        id_restaurant: user.id_restaurant,
                        quantity: body.quantity[i]
                    };
                    orderDetailArray.push(orderDetail);
                }
                let total = 0;
                for (let i = 0; i < productsPrice.length; i++) {
                    total += productQuantity[i] * productsPrice[i];
                }
                const customerPhoneQuery = `
                SELECT id_user
                FROM users
                WHERE phone='${body.phone}'
                AND usertype='C'
            `;
                const customerPhone = yield customer_1.default.findBy(customerPhoneQuery);
                if (!customerPhone) {
                    return res.json({
                        status: 304,
                        message: 'El número enviado no fue encontrado'
                    });
                }
                const newOrder = {
                    total,
                    orderstatus: 'opened',
                    id_restaurant: user.id_restaurant,
                    id_user: customerPhone.id_user
                };
                const order = new orders_1.default();
                yield order.save(newOrder, orderDetailArray);
                res.json({
                    status: 201,
                    message: 'Orden procesada con éxito'
                });
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    status: 304,
                    errorMessage: 'Error al procesar la orden'
                });
            }
        });
    }
    getAllTodayOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = res.locals.token;
            const query = `
            SELECT orders.*, users.name, users.lastname, users.phone
            FROM orders
            LEFT JOIN users
                ON orders.id_user = users.id_user
            WHERE orders.id_restaurant=${user.id_restaurant}
                AND orderstatus='opened'
            ORDER BY orders.createdAt ASC
        `;
            try {
                const orders = yield orders_1.default.fetchAllAny(query);
                res.status(200).json(orders);
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    status: 304,
                    errorMessage: 'Error al traer las ordenes del día'
                });
            }
        });
    }
    postCompleteOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = res.locals.token;
            const body = req.body;
            try {
                const completeOrder = yield orders_1.default.updateCompleteOrder(body.id_order);
                res.status(200).json(completeOrder);
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    status: 304,
                    errorMessage: 'Error al completar la orden'
                });
            }
        });
    }
    cancelOrderById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = res.locals.token;
            const { id } = req.params;
            try {
                const query = `
                UPDATE orders SET
                orderstatus='canceled'
                WHERE id_order=${id}
            `;
                yield orders_1.default.deleteById(query);
                res.json({
                    status: 200,
                    message: 'Orden cancelada'
                });
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    status: 304,
                    errorMessage: 'Error al cancelar la orden'
                });
            }
        });
    }
    loadDashboard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = res.locals.token;
            let dashboard = {
                ordersByStatus: null,
                daysCount: null,
                monthSales: null,
                lastSales: null
            };
            try {
                //Orders query
                const ordersQuery = todayOrdersRoleQuery(user);
                //Load orders from database
                const orders = yield orders_1.default.fetchAllAny(ordersQuery);
                if (orders) {
                    //Load variables for cards
                    const ordersByStatus = loadStatusCards(orders);
                    dashboard.ordersByStatus = ordersByStatus;
                }
                //Query for the 7 day chart
                const sevenDayQuery = `
                SELECT DAYNAME(orders.createdAt) AS day_name, COUNT(*) AS day_count
                FROM orders
                WHERE YEARWEEK(createdAt) = YEARWEEK(NOW())
                AND id_restaurant=${user.id_restaurant}
                GROUP BY day_name
            `;
                //Load 7 day chart from database
                const sevenDayChart = yield orders_1.default.fetchAllAny(sevenDayQuery);
                if (sevenDayChart) {
                    //Load days variables for 7 day chart
                    const daysCount = load7DayChart(sevenDayChart);
                    dashboard.daysCount = daysCount;
                }
                //Query for month sales
                const query = `
                SELECT DATE_FORMAT(orders.createdAt, '%Y-%m-%d') AS day, COUNT(*) AS day_count
                FROM orders 
                WHERE YEAR(createdAt) = YEAR(CURRENT_DATE())
                AND MONTH(createdAt) = MONTH(CURRENT_DATE())
                AND id_restaurant=${user.id_restaurant}
                GROUP BY day
            `;
                //Load data from database for month sales
                const monthSales = yield orders_1.default.fetchAllAny(query);
                dashboard.monthSales = monthSales;
                const last3OrdersQuery = `
                SELECT orders.*, CONCAT(users.name, " ",users.lastname, " ", users.maternalsurname) AS fullname, users.phone
                FROM orders
                LEFT JOIN users
                    ON orders.id_user = users.id_user
                WHERE orders.id_restaurant=${user.id_restaurant}
                    AND orderstatus='opened'
                    AND CURDATE()
                ORDER BY orders.createdAt ASC
                LIMIT 5
            `;
                const last3Orders = yield orders_1.default.fetchAllAny(last3OrdersQuery);
                dashboard.lastSales = last3Orders;
                //Dashboard Object
                res.status(200).json(dashboard);
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    status: 304,
                    errorMessage: 'Error al cargar el dashboard'
                });
            }
        });
    }
    findExistingOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { phone } = req.params;
            try {
                const idQuery = `
                SELECT
                    id_restaurant
                FROM users
                WHERE phone='${phone}'
                    AND usertype='C'
            `;
                const id = yield user_1.default.findBy(idQuery);
                const findExistingOrderQuery = `
                SELECT orderstatus
                FROM orders
                WHERE id_restaurant=${id.id_restaurant}
                AND orderstatus='opened'
            `;
                const findExistingOrder = yield orders_1.default.fetchAllAny(findExistingOrderQuery);
                if (findExistingOrder) {
                    return res.json({
                        status: 200,
                        message: 'Existe una orden previa sin completar, ¿desea continuar?'
                    });
                }
                res.json({
                    status: 304,
                    message: 'Sin órdenes'
                });
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    status: 304,
                    message: 'Error al verificar si existe alguna orden previa'
                });
            }
        });
    }
}
exports.ordersController = new OrderController();
//Select query if admin, manager
function todayOrdersRoleQuery(user) {
    let query = ``;
    switch (user.usertype) {
        case 'A':
            query = `
                SELECT * FROM orders
                WHERE DATE_FORMAT(orders.createdAt, '%Y-%m-%d') = CURDATE()
                AND id_restaurant=${user.id_restaurant}
            `;
            break;
        case 'M':
            query = `
                SELECT * FROM orders
                WHERE DATE(createdAt) = CURDATE()
                    AND id_restaurant=6
            `;
            break;
    }
    return query;
}
//Load variables for 
function loadStatusCards(orders) {
    let processing = 0;
    let completed = 0;
    let canceled = 0;
    let delayed = 0;
    for (let i = 0; i < (orders === null || orders === void 0 ? void 0 : orders.length); i++) {
        switch (orders[i].orderstatus) {
            case 'opened':
                processing++;
                delayed++;
                break;
            case 'canceled':
                canceled++;
                delayed++;
                break;
            case 'completed':
                completed++;
                delayed++;
                break;
        }
    }
    return {
        processing,
        completed,
        canceled,
        delayed
    };
}
function load7DayChart(sevenDayChart) {
    let Monday = 0, Tuesday = 0, Wednesday = 0, Thursday = 0, Friday = 0, Saturday = 0, Sunday = 0;
    if (sevenDayChart) {
        for (let i = 0; i < sevenDayChart.length; i++) {
            switch (sevenDayChart[i].day_name) {
                case 'Monday':
                    Monday = sevenDayChart[i].day_count;
                    break;
                case 'Tuesday':
                    Tuesday = sevenDayChart[i].day_count;
                    break;
                case 'Wednesday':
                    Wednesday = sevenDayChart[i].day_count;
                    break;
                case 'Thursday':
                    Thursday = sevenDayChart[i].day_count;
                    break;
                case 'Friday':
                    Friday = sevenDayChart[i].day_count;
                    break;
                case 'Saturday':
                    Saturday = sevenDayChart[i].day_count;
                    break;
                case 'Sunday':
                    Sunday = sevenDayChart[i].day_count;
                    break;
            }
        }
    }
    let daysCount = [Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday];
    return daysCount;
}
