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
exports.adminController = void 0;
const orders_1 = __importDefault(require("../models/orders"));
const product_1 = __importDefault(require("../models/product"));
const user_1 = __importDefault(require("../models/user"));
const restaurant_1 = __importDefault(require("../models/restaurant"));
const addresses_1 = __importDefault(require("../models/addresses"));
class AdminController {
    getRestaurantsPersonnelPage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = res.locals.profile;
            profile.title = 'Restaurants personnel';
            res.render('admin/managers-personnel', profile);
        });
    }
    postAllPersonnelRestaurant(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            let restaurantObject = {
                personnel: null,
                restaurant: null
            };
            try {
                const query = `
                SELECT id_user, email, CONCAT(name, " ", lastname, " ",maternalsurname) AS fullname, dob, phone, usertype,
                    CONCAT(addresses.street, " ", addresses.number, " ", colonias.nombre, " ", municipios.nombre, " ", estados.nombre) AS address
                FROM users
                JOIN addresses
                    ON users.id_address = addresses.id_address
                JOIN colonias
                    ON addresses.id_municipality=colonias.id
                JOIN municipios
                    ON addresses.id_city=municipios.id
                JOIN estados
                    ON addresses.id_state=estados.id
                WHERE id_restaurant=${body.personnel}
                    AND (usertype='CO' OR usertype='CA')
            `;
                const personnel = yield user_1.default.fetchAllAny(query);
                restaurantObject.personnel = personnel;
                const restaurant = yield restaurant_1.default.findById(body.personnel);
                restaurantObject.restaurant = restaurant;
                res.json({
                    status: 200,
                    restaurantObject
                });
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    status: 304,
                    message: 'Error while loading personnel'
                });
            }
        });
    }
    getAdminDashboardPage(req, res) {
        const user = res.locals.token;
        res.render('admin/dashboard', {
            title: 'Dashboard',
            user,
            active: true,
            admin: true,
            loggedIn: true
        });
    }
    adminCharts(req, res) {
        const user = res.locals.token;
        res.render('admin/charts', {
            title: 'Status charts',
            user,
            active: true,
            admin: true,
            loggedIn: true
        });
    }
    getAllManagersPage(req, res) {
        const user = res.locals.token;
        res.render('admin/managers', {
            title: 'Get all managers',
            user,
            active: true,
            admin: true,
            loggedIn: true
        });
    }
    getManagerPageInfoPage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = res.locals.token;
            const { id } = req.params;
            try {
                const manager = yield user_1.default.findById(id);
                delete manager.pass;
                const address = yield addresses_1.default.findById(manager.id_address);
                res.render('admin/managers-info', {
                    title: 'Manager information',
                    user,
                    manager,
                    address,
                    active: true,
                    admin: true,
                    loggedIn: true
                });
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.render('admin/managers-info', {
                    title: 'Manager information',
                    user,
                    active: true,
                    admin: true,
                    loggedIn: true,
                    errorMessage: 'Error while loading manager information'
                });
            }
        });
    }
    postLoadRestaurantData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = res.locals.token;
            const body = req.body;
            //Period time orders
            let compressQuery = ``;
            let ordersSummary;
            //Best selling product
            let bestSellingProductQuery = ``;
            let bestSellingProductObject;
            //Chart sales per day
            let chartQuery = ``;
            let chartObject;
            try {
                switch (body.option) {
                    case '1':
                        //Search by today queries
                        compressQuery = `
                        SELECT
                        SUM(orders.orderstatus = 'opened') AS opened,
                        SUM(orders.orderstatus = 'completed') AS completed,
                        SUM(orders.orderstatus = 'canceled') AS canceled
                        FROM orders 
                        WHERE id_restaurant=${body.id}
                        AND createdAt = CURDATE()
                    `;
                        bestSellingProductQuery = `
                        SELECT id_product, COUNT( id_product ) AS totalproduct
                        FROM  order_detail
                        WHERE id_restaurant=${body.id}
                        AND createdAt = CURDATE()
                        GROUP BY id_product
                        ORDER BY totalproduct DESC
                    `;
                        chartQuery = `
                        SELECT DATE_FORMAT(orders.createdAt, '%Y-%m-%d') AS day_number, COUNT(*) AS day_count
                        FROM orders 
                        WHERE id_restaurant=${body.id}
                        AND createdAt = CURDATE()
                        GROUP BY day_number
                    `;
                        break;
                    case '2':
                        //Search by present week queries
                        compressQuery = `
                        SELECT
                        SUM(orders.orderstatus = 'opened') AS opened,
                        SUM(orders.orderstatus = 'completed') AS completed,
                        SUM(orders.orderstatus = 'canceled') AS canceled
                        FROM orders 
                        WHERE id_restaurant=${body.id}
                        AND YEARWEEK(createdAt) = YEARWEEK(NOW())
                    `;
                        bestSellingProductQuery = `
                        SELECT id_product, COUNT( id_product ) AS totalproduct
                        FROM  order_detail
                        WHERE YEARWEEK(createdAt) = YEARWEEK(NOW())
                        AND id_restaurant=${body.id}
                        GROUP BY id_product
                        ORDER BY totalproduct DESC
                    `;
                        chartQuery = `
                        SELECT DATE_FORMAT(orders.createdAt, '%Y-%m-%d') AS day_number, COUNT(*) AS day_count
                        FROM orders 
                        WHERE id_restaurant=${body.id}
                        AND YEARWEEK(createdAt) = YEARWEEK(NOW())
                        GROUP BY day_number
                    `;
                        break;
                    case '3':
                        //Search by present month queries
                        compressQuery = `
                        SELECT
                        SUM(orders.orderstatus = 'opened') AS opened,
                        SUM(orders.orderstatus = 'completed') AS completed,
                        SUM(orders.orderstatus = 'canceled') AS canceled
                        FROM orders 
                        WHERE id_restaurant=${body.id}
                        AND MONTH(createdAt) = MONTH(CURRENT_DATE())
                    `;
                        bestSellingProductQuery = `
                        SELECT id_product, COUNT( id_product ) AS totalproduct
                        FROM  order_detail
                        WHERE id_restaurant=${body.id}
                        AND MONTH(createdAt) = MONTH(CURRENT_DATE())
                        GROUP BY id_product
                        ORDER BY totalproduct DESC
                    `;
                        chartQuery = `
                        SELECT DATE_FORMAT(orders.createdAt, '%Y-%m-%d') AS day_number, COUNT(*) AS day_count
                        FROM orders 
                        WHERE id_restaurant=${body.id}
                        AND MONTH(createdAt) = MONTH(CURRENT_DATE())
                        GROUP BY day_number
                    `;
                        break;
                }
                ordersSummary = yield orders_1.default.fetchAllAny(compressQuery);
                bestSellingProductObject = yield orders_1.default.fetchAllAny(bestSellingProductQuery);
                chartObject = yield orders_1.default.fetchAllAny(chartQuery);
                if (ordersSummary &&
                    bestSellingProductObject &&
                    chartObject) {
                    const query = `
                    SELECT products.name, products.image
                    FROM products
                    WHERE id_product=${bestSellingProductObject[0].id_product}
                `;
                    const findProduct = yield product_1.default.findBy(query);
                    let dataLabels = [];
                    let data = [];
                    for (let i = 0; i < chartObject.length; i++) {
                        dataLabels.push(chartObject[i].day_number);
                        data.push(chartObject[i].day_count);
                    }
                    const RestaurantSalesObject = {
                        ordersSummary: ordersSummary[0],
                        product: {
                            productName: findProduct.name,
                            productImage: findProduct.image,
                            quantity: bestSellingProductObject[0].totalproduct
                        },
                        chartObject: {
                            dataLabels,
                            data
                        }
                    };
                    res.status(200).json(RestaurantSalesObject);
                }
                else {
                    res.json({
                        status: 304,
                        message: 'No hay información en el periodo'
                    });
                }
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    status: 304,
                    errorMessage: 'Error while loading restaurant information'
                });
            }
        });
    }
    getAllManagers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = res.locals.token;
            try {
                const managersQuery = `
                SELECT users.*, manager_restaurant.id_restaurant
                FROM users
                LEFT JOIN manager_restaurant
                    ON users.id_user=manager_restaurant.id_user
                WHERE users.usertype='M';
            `;
                const managers = yield user_1.default.fetchAllAny(managersQuery);
                if (managers) {
                    for (let i = 0; i < managers.length; i++) {
                        delete managers[i].pass;
                    }
                }
                res.status(200).json(managers);
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    status: 304,
                    errorMessage: 'Error while loading managers information'
                });
            }
        });
    }
    approveManager(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = res.locals.token;
            const { id } = req.params;
            try {
                const manager = yield user_1.default.findById(id);
                if (manager.verified === 'VERIFIED') {
                    return res.status(200).json({
                        message: 'Manager is already verified'
                    });
                }
                const query = `
                UPDATE users
                SET verified='VERIFIED'
                WHERE id_user=${id}
            `;
                const verifiedManager = new user_1.default();
                yield verifiedManager.updateById(query);
                console.log(verifiedManager);
                res.status(200).json(verifiedManager);
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    status: 304,
                    errorMessage: 'Error while updating manager status'
                });
            }
        });
    }
}
exports.adminController = new AdminController();
