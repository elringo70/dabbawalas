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
exports.authController = void 0;
const user_1 = __importDefault(require("../models/user"));
const jsonwebtoken_1 = require("jsonwebtoken");
const bcrypt_1 = require("bcrypt");
const express_validator_1 = require("express-validator");
class AuthController {
    postLoginUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = express_validator_1.validationResult(req);
            const queryObj = req.body;
            try {
                const user = yield user_1.default.findBy('email', queryObj.email);
                if (!errors.isEmpty()) {
                    return res.status(200).render('auth/login', {
                        title: 'Login',
                        errors: errors.array()
                    });
                }
                if (!user) {
                    return res.render('auth/login', {
                        title: 'Login',
                        status: 304,
                        errorMessage: 'Usuario no encontrado o contraseña incorrecta'
                    });
                }
                if (!bcrypt_1.compareSync(`${queryObj.pass}`, `${user.pass}`)) {
                    res.render('auth/login', {
                        title: 'Login',
                        status: 304,
                        errorMessage: 'Usuario no encontrado o contraseña incorrecta'
                    });
                }
                else {
                    const verifiedUser = yield user_1.default.findByVerified(`${user.id_user}`);
                    if (!verifiedUser) {
                        return res.render('auth/login', {
                            title: 'Login',
                            status: 304,
                            errorMessage: 'El correo electrónico aun no ha sido verificado'
                        });
                    }
                    delete user.pass;
                    const token = jsonwebtoken_1.sign({ user }, 'SECRET', { expiresIn: '1h' });
                    res.cookie('token', token, {
                        httpOnly: false
                    });
                    res.redirect('/api/restaurants/manager');
                }
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    errorMessage: 'Error al loguearse en el sistema'
                });
            }
        });
    }
    getLogoutUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.clearCookie('token');
            res.redirect('/');
        });
    }
    postEmailConfirmation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.authController = new AuthController();
