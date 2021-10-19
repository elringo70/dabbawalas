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
const customer_1 = __importDefault(require("../models/customer"));
class CustomerController {
    getCustomerPage(req, res) {
        const profile = res.locals.profile;
        profile.title = 'Agregar un cliente al restaurant';
        res.render('customers/customer-registration', profile);
    }
    getAllCustomersPage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = res.locals.profile;
            profile.title = 'Clientes del restaurante';
            res.render('customers/get-customers', profile);
        });
    }
    getAllCustomersByRestaurant(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = res.locals.token;
            try {
                const customerQuery = `
                SELECT
                    users.id_user, users.name, users.lastname, users.maternalsurname, users.phone, users.usertype,
                    users.gender, users.image, users.lastpurchase, users.active, users.id_restaurant, users.id_address,
                    users.email,
                    estados.nombre AS state,
                    municipios.nombre AS city,
                    colonias.nombre AS municipality,
                    addresses.number, 
                    addresses.street
                FROM users
                LEFT JOIN addresses
                    ON users.id_address = addresses.id_address
                JOIN estados
                    ON addresses.id_state = estados.id
                JOIN municipios
                    ON addresses.id_city = municipios.id
                JOIN colonias
                    ON addresses.id_municipality = colonias.id
                WHERE id_restaurant=${user.id_restaurant}
                AND usertype='C'
            `;
                const customers = yield customer_1.default.fetchAll(customerQuery);
                res.status(200).json({
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
            const body = req.body;
            const customer = {
                phone: req.body.phone,
                name: body.name.toUpperCase(),
                lastname: body.lastname.toUpperCase(),
                maternalsurname: body.maternalsurname.toUpperCase(),
                gender: body.gender,
                usertype: 'C',
                active: 1,
                id_restaurant: user.id_restaurant
            };
            const address = {
                id_municipality: body.municipality,
                id_city: body.city,
                id_state: body.state,
                number: body.number,
                street: body.street.toUpperCase()
            };
            try {
                const newCustomer = new customer_1.default();
                yield newCustomer.save(customer, address);
                res.status(201).json({
                    status: 201,
                    message: 'Cliente guardado exitosamente'
                });
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    status: 304,
                    errorMessage: 'Error al guardar al cliente'
                });
            }
        });
    }
    getCustomerByPhone(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = express_validator_1.validationResult(req);
            const error = errors.array();
            const user = res.locals.token;
            const body = req.body;
            if (!errors.isEmpty()) {
                return res.json({
                    status: 304,
                    message: error[0].msg
                });
            }
            const query = `
            SELECT
                users.name,
                users.lastname,
                users.maternalsurname,
                users.phone,
                users.gender,
                users.usertype,
                colonias.nombre AS municipality,
                municipios.nombre AS city,
                estados.nombre AS state,
                addresses.street,
                addresses.number
            FROM users
            JOIN addresses
                ON users.id_address = addresses.id_address
            JOIN colonias
                ON addresses.id_municipality=colonias.id
            JOIN municipios
                ON addresses.id_city=municipios.id
            JOIN estados
                ON addresses.id_state=estados.id
            WHERE users.usertype='C'
                AND users.phone=${body.phone}
                AND users.id_restaurant=${user.id_restaurant}
                AND users.active=1
        `;
            try {
                const customer = yield customer_1.default.findBy(query);
                if (customer !== null) {
                    return res.json({
                        status: 201,
                        customer
                    });
                }
                res.status(200).json(customer);
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
    findCustomerByPhone(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { phone } = req.params;
            const user = res.locals.token;
            try {
                const query = `
                SELECT phone
                FROM users
                WHERE phone='${phone}'
                AND id_restaurant=${user.id_restaurant}
                AND usertype='C'
            `;
                const customer = yield customer_1.default.findBy(query);
                if (customer) {
                    return res.json({
                        status: 200,
                        message: 'El número ya se encuentra registrado'
                    });
                }
                res.json({
                    status: 400,
                    message: 'Disponible'
                });
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    status: 304,
                    errorMessage: 'Error al encontrar el número'
                });
            }
        });
    }
    getCustomerById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = res.locals.token;
            const id = req.params.id;
            const customerOBJ = {
                id_user: id,
                id_restaurant: user.id_restaurant
            };
            try {
                const customer = yield customer_1.default.findById(customerOBJ);
                res.status(200).json(customer);
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    status: 304,
                    errorMessage: 'Error al buscar al cliente por ID'
                });
            }
        });
    }
    deleteCustomerByRestaurant(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = res.locals.token;
            const { id } = req.params;
            try {
                const customerObject = {
                    id_user: id,
                    id_restaurant: user.id_restaurant
                };
                const customer = yield customer_1.default.findById(customerObject);
                if (!customer) {
                    return res.status(200).json({
                        status: 200,
                        message: 'El usuario no existe'
                    });
                }
                if (customer.id_user && customer.id_address) {
                    yield customer_1.default.deleteById(customer.id_user, customer.id_address);
                    res.status(200).json({
                        status: 200,
                        message: 'Cliente borrado'
                    });
                }
                else {
                    res.json({
                        status: 304,
                        message: 'Error al borrar al cliente'
                    });
                }
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
            const errors = express_validator_1.validationResult(req);
            const error = errors.array();
            const profile = res.locals.profile;
            profile.title = 'Editar información del cliente';
            const user = res.locals.token;
            const { id } = req.params;
            try {
                if (!errors.isEmpty()) {
                    profile.error = error[0].msg;
                    return res.status(200).render('customers/edit-customer', profile);
                }
                const customerObject = {
                    id_user: id,
                    id_restaurant: user.id_restaurant
                };
                const customer = yield customer_1.default.findById(customerObject);
                if (!customer) {
                    profile.errorMessage = 'No se encuentra el cliente';
                    return res.status(200).render('customers/edit-customer', profile);
                }
                profile.customer = customer;
                res.status(200).render('customers/edit-customer', profile);
            }
            catch (error) {
                if (error)
                    console.log(error);
                profile.errorMessage = 'Error al cargar la pagina de edición';
                res.render('customers/edit-customer', profile);
            }
        });
    }
    editCustomerByRestaurant(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = express_validator_1.validationResult(req);
            const error = errors.array();
            const user = res.locals.token;
            const { phone } = req.params;
            const body = req.body;
            try {
                if (!errors.isEmpty()) {
                    return res.json({
                        status: 304,
                        message: error[0].msg
                    });
                }
                const query = `
                SELECT users.*
                FROM users
                WHERE phone='${phone}'
                AND usertype='C'
                AND id_restaurant=${user.id_restaurant}
            `;
                const customer = yield customer_1.default.findBy(query);
                if (!customer) {
                    return res.json({
                        status: 304,
                        message: 'Cliente no encontrado o información no valida'
                    });
                }
                const customerInfo = {
                    id_user: customer.id_user,
                    name: body.name.toUpperCase(),
                    lastname: body.lastname.toUpperCase(),
                    maternalsurname: body.toUpperCase(),
                    phone: req.body.phone,
                    gender: req.body.gender,
                    usertype: 'C',
                    active: 1,
                    id_restaurant: user.id_restaurant
                };
                const customerAddress = {
                    id_address: customer.id_address,
                    id_state: body.state,
                    id_city: req.body.city,
                    id_municipality: req.body.municipality,
                    street: body.street.toUpperCase(),
                    number: body.number.toUpperCase(),
                };
                const updateCustomer = new customer_1.default();
                yield updateCustomer.editById(customerInfo, customerAddress);
                res.status(201).json({
                    status: 201,
                    message: 'Cliente actualizado con éxito'
                });
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    status: 304,
                    message: 'Error al actualizar al cliente'
                });
            }
        });
    }
}
exports.customerController = new CustomerController();
