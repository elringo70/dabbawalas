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
    //Manager controllers
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
            if (queryObj.email === undefined) {
                return res.json({
                    status: 304,
                    errorMessage: 'Envie el dato email'
                });
            }
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
}
exports.userControllers = new UserControllers();
