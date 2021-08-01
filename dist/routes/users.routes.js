"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controllers_1 = require("../controllers/users.controllers");
const express_validator_1 = require("express-validator");
class UsersRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        //Customer Routes
        this.router.post('/customers/postNewUser', users_controllers_1.userControllers.postNewCustomer);
        this.router.get('/customers/:id', users_controllers_1.userControllers.getCustomerById);
        this.router.get('/customers', users_controllers_1.userControllers.getAllCustomers);
        this.router.post('/customers/searchBy', users_controllers_1.userControllers.getCustomerBy);
        this.router.patch('/customers/:id', users_controllers_1.userControllers.updateCustomerById);
        this.router.post('/customers/searchByEmail', users_controllers_1.userControllers.getCustomerByEmail);
        //Manager Routes
        this.router.post('/manager/postNewManager', [
            express_validator_1.check('name')
                .not().isEmpty().withMessage('No ingreso ningun valor')
                .trim()
                .isLength({ min: 3 }).withMessage('El nombre debe de contener al menos 3 caracteres')
                .isAlpha('es-ES', { ignore: ' ' }).withMessage('Solo puede ingresar letras en el nombre'),
            express_validator_1.check('lastname')
                .not().isEmpty().withMessage('No ingreso ningun valor')
                .trim()
                .isLength({ min: 3 }).withMessage('El apellido debe de contener al menos 3 caracteres')
                .isAlpha('es-ES', { ignore: ' ' }).withMessage('Solo puede ingresar letras en el apellido'),
            express_validator_1.check('maternalsurname')
                .not().isEmpty().withMessage('No ingreso ningun valor')
                .trim()
                .isLength({ min: 3 }).withMessage('El segundo apellido debe de contener al menos 3 caracteres')
                .isAlpha('es-ES', { ignore: ' ' }).withMessage('Solo puede ingresar letras en el segundo apellido'),
            express_validator_1.check('dob')
                .not().isEmpty()
                .trim()
                .isDate().withMessage('Seleccione un formato valido de fecha'),
            express_validator_1.check('number')
                .not().isEmpty().withMessage('No ingreso ningun valor')
                .trim()
                .isNumeric().withMessage('Solo puede ingresar valores numéricos'),
            express_validator_1.check('street')
                .not().isEmpty().withMessage('No ingreso ningun valor')
                .trim(),
            express_validator_1.check('municipality')
                .not().isEmpty().withMessage('No ingreso ningun valor')
                .trim(),
            express_validator_1.check('city')
                .not().isEmpty().withMessage('No ingreso ningun valor')
                .trim(),
            express_validator_1.check('state')
                .not().isEmpty().withMessage('No ingreso ningun valor')
                .trim(),
            express_validator_1.check('phone')
                .trim()
                .isNumeric().withMessage('Solo puede ingresar valores numéricos')
                .isMobilePhone(['es-MX']).withMessage('Ingrese un teléfono valido'),
            express_validator_1.check('email')
                .trim()
                .isEmail().withMessage('Ingrese un email con formato valido'),
            express_validator_1.check('pass')
                .not().isEmpty().withMessage('No ingreso ningun valor')
                .trim()
                .isStrongPassword({ minLength: 6, minUppercase: 1, minSymbols: 1 })
        ], users_controllers_1.userControllers.postNewManager);
        this.router.post('/manager/searchByEmail', users_controllers_1.userControllers.getManagerExistsByEmail);
    }
}
const usersRoutes = new UsersRoutes();
exports.default = usersRoutes.router;
