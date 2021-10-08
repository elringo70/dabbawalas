"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controllers_1 = require("../controllers/auth.controllers");
const express_validator_1 = require("express-validator");
class AuthRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.post('/login', [
            express_validator_1.check('email')
                .isEmail().withMessage('Ingrese un correo electrónico valido'),
            express_validator_1.check('pass')
                .not().isEmpty().withMessage('Ingrese la contraseña')
        ], auth_controllers_1.authController.postLoginUser);
        this.router.get('/logout', auth_controllers_1.authController.getLogoutUser);
    }
}
const authRoutes = new AuthRoutes();
exports.default = authRoutes.router;
