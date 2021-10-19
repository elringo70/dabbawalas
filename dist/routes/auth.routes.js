"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controllers_1 = require("../controllers/auth.controllers");
const express_validator_1 = require("express-validator");
const roles_1 = require("../middlewares/roles");
const jwt_1 = __importDefault(require("../middlewares/jwt"));
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
        this.router.get('/logout', [jwt_1.default.checkJWT, roles_1.checkRole(['M', 'D', 'CO', 'A', 'CA'])], auth_controllers_1.authController.getLogoutUser);
        this.router.get('/getNotPermissionsPage', [jwt_1.default.checkJWT, roles_1.checkRole(['M', 'D', 'CO', 'A', 'CA'])], auth_controllers_1.authController.getNotPermissionsPage);
        this.router.get('/resetPasswordPage', [jwt_1.default.checkJWT, roles_1.checkRole(['M', 'D', 'CO', 'A', 'CA'])], auth_controllers_1.authController.resetPasswordPage);
        this.router.post('/resetPassword', [jwt_1.default.checkJWT, roles_1.checkRole(['M', 'D', 'CO', 'A', 'CA'])], auth_controllers_1.authController.resetPassword);
        this.router.post('/forgotPassword', [
            express_validator_1.check('email')
                .trim()
                .isEmail().withMessage('Ingrese un correo electrónico valido'),
        ], auth_controllers_1.authController.forgotPassword);
        this.router.post('/confirmCaptcha', auth_controllers_1.authController.confirmCaptcha);
        this.router.get('/confirmEmailPage/:token', auth_controllers_1.authController.confirmEmailPage);
    }
}
const authRoutes = new AuthRoutes();
exports.default = authRoutes.router;
