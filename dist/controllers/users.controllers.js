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
exports.userControllers = void 0;
const user_1 = __importDefault(require("../models/user"));
const bcrypt_1 = require("bcrypt");
const express_validator_1 = require("express-validator");
class UserControllers {
    //Customer Controllers
    postNewCustomer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryObj = req.body;
            queryObj.usertype = 'C';
            queryObj.active = 1;
            queryObj.verified = 'UNVERIFIED';
            const customer = yield user_1.default.findBy('email', queryObj.email);
            try {
                if (customer) {
                    return res.json({
                        status: 304,
                        message: 'El email ya se encuentra registrado'
                    });
                }
                const user = new user_1.default();
                yield user.save(queryObj);
                res.status(201).json({
                    message: 'Usuario almacenado exitosamente'
                });
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    errorMessage: 'Error al registrar al usuario'
                });
            }
        });
    }
    postNewManager(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = express_validator_1.validationResult(req);
            const queryObj = req.body;
            queryObj.usertype = 'M';
            queryObj.active = 1;
            queryObj.verified = 'UNVERIFIED';
            const salt = bcrypt_1.genSaltSync(10);
            const hashPass = bcrypt_1.hashSync(`${queryObj.pass}`, salt);
            queryObj.pass = hashPass;
            const manager = yield user_1.default.findBy('email', queryObj.email);
            if (manager) {
                return res.json({
                    status: 304,
                    message: 'El email ya se encuentra registrado'
                });
            }
            if (queryObj.pass === req.body.confpass) {
                return res.json({
                    status: 304,
                    message: 'Las contraseñas no coinciden'
                });
            }
            try {
                if (!errors.isEmpty()) {
                    delete queryObj.pass;
                    return res.status(200).render('restaurants/registration', {
                        title: 'Pagina de registro de restaurant',
                        errors: errors.array(),
                        user: queryObj,
                        loginIn: false
                    });
                }
                delete queryObj.confpass;
                const manager = new user_1.default();
                yield manager.save(queryObj);
                setTimeout(function () {
                    res.redirect('/login');
                }, 4000);
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    errorMessage: 'Error al registrar al encargado'
                });
            }
        });
    }
    getCustomerBy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { option, email } = req.body;
            try {
                const customer = yield user_1.default.findBy(option, email);
                if (!customer) {
                    return res.json({
                        status: 400,
                        messages: 'Usuario no encontrado'
                    });
                }
                res.json({
                    status: 200,
                    customer
                });
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    errorMessage: 'Error al buscar al cliente'
                });
            }
        });
    }
    getManagerExistsByEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            try {
                const manager = yield user_1.default.findBy('email', email);
                if (manager) {
                    res.json({
                        status: 200,
                        message: 'El el correo electrónico ya se encuentra registrado'
                    });
                }
                else {
                    res.json({
                        status: 304,
                        message: 'Email not found'
                    });
                }
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    errorMessage: 'Error al buscar el correo electrónico'
                });
            }
        });
    }
    getCustomerByEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            try {
                const emailCustomer = yield user_1.default.findBy('email', email);
                if (emailCustomer) {
                    res.json(emailCustomer === null || emailCustomer === void 0 ? void 0 : emailCustomer.email);
                }
                else {
                    res.status(304);
                }
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    errorMessage: 'Error al buscar el correo electrónico'
                });
            }
        });
    }
    getCustomerById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const customer = yield user_1.default.findById(id);
                if (!customer) {
                    return res.status(400).json({
                        messages: 'Usuario no encontrado'
                    });
                }
                res.status(200).json(customer);
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    errorMessage: 'Error al buscar al usuario'
                });
            }
        });
    }
    getAllCustomers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const customers = yield user_1.default.fetchAll();
                res.status(200).json(customers);
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    errorMessage: 'Error obtener todos los usuarios'
                });
            }
        });
    }
    updateCustomerById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryObj = req.body;
            queryObj.usertype = 'C';
            queryObj.active = 1;
            const { id } = req.params;
            try {
                const customer = yield user_1.default.findById(id);
                if (!customer) {
                    return res.status(400).json({
                        messages: 'Cliente no encontrado'
                    });
                }
                const updatedCustomer = new user_1.default();
                yield updatedCustomer.updateById(id, queryObj);
                res.status(200).json({
                    message: 'Cliente actualizado'
                });
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    errorMessage: 'Error al actualizar al cliente'
                });
            }
        });
    }
}
exports.userControllers = new UserControllers();
