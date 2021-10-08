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
exports.customerController = void 0;
const express_validator_1 = require("express-validator");
const restaurant_1 = __importDefault(require("../models/restaurant"));
const customer_1 = __importDefault(require("../models/customer"));
class CustomerController {
    getCustomerPage(req, res) {
        res.render('customers/customer-registration', {
            title: 'Agregar un cliente al restaurant',
            active: true,
            loggedIn: true
        });
    }
    getAllCustomersPage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = res.locals.token;
            try {
                const restaurant = yield restaurant_1.default.findWithUser(user.id_user);
                if ((restaurant === null || restaurant === void 0 ? void 0 : restaurant.id_restaurant) === undefined) {
                    return res.json({
                        status: 304,
                        errorMessage: 'Indique el dato id_restaurant'
                    });
                }
                const customers = yield customer_1.default.fetchAll(restaurant === null || restaurant === void 0 ? void 0 : restaurant.id_restaurant);
                res.render('customers/get-customers', {
                    title: 'Clientes del restaurante',
                    customers,
                    active: true,
                    loggedIn: true
                });
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    status: 304,
                    errorMessage: 'Error al traer a los clientes'
                });
            }
        });
    }
    getAllCustomersByRestaurant(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = res.locals.token;
            try {
                const restaurant = yield restaurant_1.default.findWithUser(user.id_user);
                if ((restaurant === null || restaurant === void 0 ? void 0 : restaurant.id_restaurant) === undefined) {
                    return res.json({
                        status: 304,
                        errorMessage: 'Inserte el dato id_restaurant'
                    });
                }
                const customers = yield customer_1.default.fetchAll(restaurant === null || restaurant === void 0 ? void 0 : restaurant.id_restaurant);
                console.log(customers);
                res.json({
                    status: 200,
                    customers
                });
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    status: 304,
                    errorMessage: 'Error al traer a los clientes'
                });
            }
        });
    }
    postNewCustomer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = res.locals.token;
            try {
                const restaurant = yield restaurant_1.default.findWithUser(user.id_user);
                const customerObj = req.body;
                customerObj.usertype = 'C';
                customerObj.active = 1;
                customerObj.id_restaurant = restaurant === null || restaurant === void 0 ? void 0 : restaurant.id_restaurant;
                const customer = new customer_1.default();
                yield customer.save(customerObj);
                res.status(201).json({
                    status: 201,
                    customerObj
                });
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    status: 304,
                    errorMessage: 'Error al ingresar al cliente'
                });
            }
        });
    }
    getCustomerByPhone(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = res.locals.token;
            try {
                const restaurant = yield restaurant_1.default.findWithUser(user.id_user);
                if ((restaurant === null || restaurant === void 0 ? void 0 : restaurant.id_restaurant) === undefined) {
                    return res.json({
                        status: 304,
                        errorMessage: 'Envie el dato id_restaurant'
                    });
                }
                const phone = {
                    column: 'phone',
                    value: req.body.phone,
                    id_restaurant: restaurant.id_restaurant
                };
                const customer = yield customer_1.default.findCustomerBy(phone);
                if (customer !== null) {
                    return res.json({
                        status: 200,
                        customer
                    });
                }
                res.json({
                    status: 304,
                    message: 'Número disponible'
                });
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    status: 304,
                    errorMessage: 'Error al obtener el cliente'
                });
            }
        });
    }
    deleteCustomerByRestaurant(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = res.locals.token;
            const { id } = req.params;
            try {
                const restaurant = yield restaurant_1.default.findWithUser(user.id_user);
                const customerObj = {
                    id_user: id,
                    id_restaurant: restaurant === null || restaurant === void 0 ? void 0 : restaurant.id_restaurant
                };
                const customer = new customer_1.default();
                yield customer.deleteCustomerByRestaurant(customerObj);
                res.json({
                    status: 200,
                    message: 'Usuario borrado'
                });
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    status: 304,
                    errorMessage: 'Error al borrar al cliente'
                });
            }
        });
    }
    editCustomerByRestaurantPage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = res.locals.token;
            const { id } = req.params;
            try {
                const restaurant = yield restaurant_1.default.findWithUser(user.id_user);
                if ((restaurant === null || restaurant === void 0 ? void 0 : restaurant.id_restaurant) === undefined) {
                    return res.json({
                        status: 304,
                        errorMessage: 'Ingrese el dato id_restaurant'
                    });
                }
                const findCustomer = {
                    id_user: id,
                    id_restaurant: restaurant === null || restaurant === void 0 ? void 0 : restaurant.id_restaurant
                };
                const customer = yield customer_1.default.findById(findCustomer);
                res.render('customers/edit-customer', {
                    title: 'Editar información del cliente',
                    customer,
                    active: true,
                    loggedIn: true
                });
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.render('customers/edit-customer', {
                    title: 'Editar información del cliente',
                    errorMessage: 'Error al cargar la pagina de edición',
                    active: true,
                    loggedIn: true
                });
            }
        });
    }
    editCustomerByRestaurant(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = express_validator_1.validationResult(req);
            const user = res.locals.token;
            const { id } = req.params;
            try {
                const customerObj = req.body;
                const editCustomer = new customer_1.default();
                yield editCustomer.editCustomerByRestaurant(customerObj, user.id_user);
                if (!errors.isEmpty()) {
                    return res.status(200).render('customers/edit-customer', {
                        title: 'Editar información del cliente',
                        errors: errors.array(),
                        customer: customerObj,
                        loginIn: true
                    });
                }
                res.redirect(`/api/customers/editCustomerByRestaurantPage/${id}`);
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.render('customers/edit-customer', {
                    title: 'Editar información del cliente',
                    errorMessage: 'Error al actualizar al cliente de edición',
                    active: true,
                    loggedIn: true
                });
            }
        });
    }
}
exports.customerController = new CustomerController();
