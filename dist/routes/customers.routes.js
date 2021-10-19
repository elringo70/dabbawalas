"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customers_controllers_1 = require("../controllers//customers.controllers");
const express_validator_1 = require("express-validator");
const jwt_1 = __importDefault(require("../middlewares/jwt"));
const roles_1 = require("../middlewares/roles");
class CustomerRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        //Route post a new customer
        this.router.post('/postNewCustomer', [jwt_1.default.checkJWT, roles_1.checkRole(['M'])], [
            //Inputs validations
            express_validator_1.check('name')
                .not().isEmpty().withMessage('Ingrese el nombre')
                .trim()
                .isLength({ min: 3 }).withMessage('El nombre debe de contener al menos 3 caracteres')
                .isAlpha('es-ES', { ignore: ' ' }).withMessage('Solo puede ingresar letras en el nombre'),
            express_validator_1.check('lastname')
                .not().isEmpty().withMessage('Ingrese el apellido')
                .trim()
                .isLength({ min: 3 }).withMessage('El apellido debe de contener al menos 3 caracteres')
                .isAlpha('es-ES', { ignore: ' ' }).withMessage('Solo puede ingresar letras en el apellido'),
            express_validator_1.check('maternalsurname')
                .not().isEmpty().withMessage('Ingrese el segundo apellido')
                .trim()
                .isLength({ min: 3 }).withMessage('El segundo apellido debe de contener al menos 3 caracteres')
                .isAlpha('es-ES', { ignore: ' ' }).withMessage('Solo puede ingresar letras en el segundo apellido'),
            express_validator_1.check('number')
                .not().isEmpty().withMessage('Ingrese el número de casa')
                .trim()
                .isNumeric().withMessage('Solo puede ingresar valores numéricos'),
            express_validator_1.check('street')
                .not().isEmpty().withMessage('Ingrese la calle')
                .trim(),
            express_validator_1.check('municipality')
                .not().isEmpty().withMessage('Ingrese la colonia')
                .trim(),
            express_validator_1.check('city')
                .not().isEmpty().withMessage('Ingrese la ciudad')
                .trim(),
            express_validator_1.check('state')
                .not().isEmpty().withMessage('Ingrese el estado')
                .trim(),
            express_validator_1.check('phone')
                .trim()
                .isNumeric().withMessage('Solo puede ingresar valores numéricos')
                .isMobilePhone(['es-MX']).withMessage('Ingrese un teléfono válido'),
            express_validator_1.check('email')
                .optional()
                .trim()
                .isEmail().withMessage('Ingrese un correo electrónico valido')
        ], customers_controllers_1.customerController.postNewCustomer);
        this.router.get('/getCustomerPage', [jwt_1.default.checkJWT, roles_1.checkRole(['M', 'CA'])], customers_controllers_1.customerController.getCustomerPage);
        this.router.get('/getAllCustomersPageByRestaurant', [jwt_1.default.checkJWT, roles_1.checkRole(['M', 'CA'])], customers_controllers_1.customerController.getAllCustomersPage);
        this.router.get('/getCustomerById/:id', [jwt_1.default.checkJWT, roles_1.checkRole(['M', 'A'])], customers_controllers_1.customerController.getCustomerById);
        this.router.delete('/deleteCustomerByRestaurant/:id', [jwt_1.default.checkJWT, roles_1.checkRole(['M', 'A'])], customers_controllers_1.customerController.deleteCustomerByRestaurant);
        this.router.get('/getAllCustomersByRestaurant', [jwt_1.default.checkJWT, roles_1.checkRole(['M', 'A', 'CA'])], customers_controllers_1.customerController.getAllCustomersByRestaurant);
        this.router.get('/editCustomerByRestaurantPage/:id', [jwt_1.default.checkJWT, roles_1.checkRole(['M', 'CA'])], customers_controllers_1.customerController.editCustomerByRestaurantPage);
        this.router.post('/getCustomerByPhone', [jwt_1.default.checkJWT, roles_1.checkRole(['M', 'A', 'CA'])], [
            express_validator_1.check('phone')
                .not().isEmpty().withMessage('Ingrese el numero telefónico del cliente')
                .trim()
                .isMobilePhone(['es-MX']).withMessage('Ingrese un teléfono válido'),
        ], customers_controllers_1.customerController.getCustomerByPhone);
        this.router.get('/findCustomerByPhone/:phone', [jwt_1.default.checkJWT, roles_1.checkRole(['M'])], customers_controllers_1.customerController.findCustomerByPhone);
        //Route edit customer
        this.router.patch('/editCustomerByRestaurant/:phone', [jwt_1.default.checkJWT, roles_1.checkRole(['M', 'A'])], [
            //Inputs validations
            express_validator_1.check('name')
                .not().isEmpty().withMessage('Ingrese el nombre')
                .trim()
                .isLength({ min: 3 }).withMessage('El nombre debe de contener al menos 3 caracteres')
                .isAlpha('es-ES', { ignore: ' ' }).withMessage('Solo puede ingresar letras en el nombre'),
            express_validator_1.check('lastname')
                .not().isEmpty().withMessage('Ingrese el apellido')
                .trim()
                .isLength({ min: 3 }).withMessage('El apellido debe de contener al menos 3 caracteres')
                .isAlpha('es-ES', { ignore: ' ' }).withMessage('Solo puede ingresar letras en el apellido'),
            express_validator_1.check('maternalsurname')
                .not().isEmpty().withMessage('Ingrese el segundo apellido')
                .trim()
                .isLength({ min: 3 }).withMessage('El segundo apellido debe de contener al menos 3 caracteres')
                .isAlpha('es-ES', { ignore: ' ' }).withMessage('Solo puede ingresar letras en el segundo apellido'),
            express_validator_1.check('number')
                .not().isEmpty().withMessage('Ingrese el número de casa')
                .trim()
                .isNumeric().withMessage('Solo puede ingresar valores numéricos'),
            express_validator_1.check('street')
                .not().isEmpty().withMessage('Ingrese la calle')
                .trim(),
            express_validator_1.check('municipality')
                .not().isEmpty().withMessage('Ingrese la colonia')
                .trim(),
            express_validator_1.check('city')
                .not().isEmpty().withMessage('Ingrese la ciudad')
                .trim(),
            express_validator_1.check('state')
                .not().isEmpty().withMessage('Ingrese el estado')
                .trim(),
            express_validator_1.check('phone')
                .trim()
                .isNumeric().withMessage('Solo puede ingresar valores numéricos')
                .isMobilePhone(['es-MX']).withMessage('Ingrese un teléfono valido'),
            express_validator_1.check('email')
                .isEmail()
                .optional({ nullable: true, checkFalsy: true })
                .withMessage('Ingrese un correo electrónico valido')
        ], customers_controllers_1.customerController.editCustomerByRestaurant);
    }
}
const customerRoutes = new CustomerRoutes();
exports.default = customerRoutes.router;
