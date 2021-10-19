"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const manager_controllers_1 = require("../controllers/manager.controllers");
const express_validator_1 = require("express-validator");
const jwt_1 = __importDefault(require("../middlewares/jwt"));
const roles_1 = require("../middlewares/roles");
class ManagerRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        //Post new manager validations
        this.router.post('/postNewManager', [
            express_validator_1.check('name')
                .not().isEmpty().withMessage('Ingrese su nombre')
                .trim()
                .isLength({ min: 3 }).withMessage('El nombre debe de contener al menos 3 caracteres')
                .isAlpha('es-ES', { ignore: ' ' }).withMessage('Solo puede ingresar letras en el nombre'),
            express_validator_1.check('lastname')
                .not().isEmpty().withMessage('Ingrese el apellido')
                .trim()
                .isLength({ min: 3 }).withMessage('El apellido debe de contener al menos 3 caracteres')
                .isAlpha('es-ES', { ignore: ' ' }).withMessage('Solo puede ingresar letras en el apellido'),
            express_validator_1.check('maternalsurname')
                .not().isEmpty().withMessage('Ingrese su segundo apellido')
                .trim()
                .isLength({ min: 3 }).withMessage('El segundo apellido debe de contener al menos 3 caracteres')
                .isAlpha('es-ES', { ignore: ' ' }).withMessage('Solo puede ingresar letras en el segundo apellido'),
            express_validator_1.check('dob')
                .not().isEmpty().withMessage('Ingrese la su fecha de nacimiento')
                .trim()
                .isDate().withMessage('Seleccione un formato valido de fecha'),
            express_validator_1.check('number')
                .not().isEmpty().withMessage('Ingrese el numero de la dirección')
                .trim()
                .isNumeric().withMessage('Solo puede ingresar valores numéricos'),
            express_validator_1.check('street')
                .not().isEmpty().withMessage('Ingrese el nombre de la calle')
                .trim(),
            express_validator_1.check('municipality')
                .not().isEmpty().withMessage('Seleccione una colonia')
                .trim(),
            express_validator_1.check('city')
                .not().isEmpty().withMessage('Seleccione una ciudad')
                .trim(),
            express_validator_1.check('state')
                .not().isEmpty().withMessage('Seleccione un estado')
                .trim(),
            express_validator_1.check('phone')
                .not().isEmpty().withMessage('Ingrese un número telefonico')
                .trim()
                .isNumeric().withMessage('Solo puede ingresar valores numéricos')
                .isMobilePhone(['es-MX']).withMessage('Ingrese un teléfono valido'),
            express_validator_1.check('email')
                .not().isEmpty().withMessage('Ingrese un correo electrónico')
                .trim()
                .isEmail().withMessage('Ingrese un email con formato valido'),
            express_validator_1.check('pass')
                .not().isEmpty().withMessage('Ingrese una contraseña')
                .trim()
                .isStrongPassword({ minLength: 6, minUppercase: 1, minSymbols: 1 }).withMessage('Ingrese la contraseña como se le indica')
        ], manager_controllers_1.managerControllers.postNewManager);
        this.router.get('/getManagerByEmail/:email', manager_controllers_1.managerControllers.getManagerByEmail);
        this.router.get('/editManagerPage/:id', [jwt_1.default.checkJWT, roles_1.checkRole(['M'])], manager_controllers_1.managerControllers.editManagerPage);
        //Edit validations
        this.router.patch('/editManager/:id', [jwt_1.default.checkJWT, roles_1.checkRole(['M'])], [
            express_validator_1.check('name')
                .not().isEmpty().withMessage('Ingrese su nombre')
                .trim()
                .isLength({ min: 3 }).withMessage('El nombre debe de contener al menos 3 caracteres')
                .isAlpha('es-ES', { ignore: ' ' }).withMessage('Solo puede ingresar letras en el nombre'),
            express_validator_1.check('lastname')
                .not().isEmpty().withMessage('Ingrese el apellido')
                .trim()
                .isLength({ min: 3 }).withMessage('El apellido debe de contener al menos 3 caracteres')
                .isAlpha('es-ES', { ignore: ' ' }).withMessage('Solo puede ingresar letras en el apellido'),
            express_validator_1.check('maternalsurname')
                .not().isEmpty().withMessage('Ingrese su segundo apellido')
                .trim()
                .isLength({ min: 3 }).withMessage('El segundo apellido debe de contener al menos 3 caracteres')
                .isAlpha('es-ES', { ignore: ' ' }).withMessage('Solo puede ingresar letras en el segundo apellido'),
            express_validator_1.check('dob')
                .not().isEmpty().withMessage('Ingrese la su fecha de nacimiento')
                .trim()
                .isDate().withMessage('Seleccione un formato valido de fecha'),
            express_validator_1.check('number')
                .not().isEmpty().withMessage('Ingrese el numero de la dirección')
                .trim()
                .isNumeric().withMessage('Solo puede ingresar valores numéricos'),
            express_validator_1.check('street')
                .not().isEmpty().withMessage('Ingrese el nombre de la calle')
                .trim(),
            express_validator_1.check('municipality')
                .not().isEmpty().withMessage('Seleccione una colonia')
                .trim(),
            express_validator_1.check('city')
                .not().isEmpty().withMessage('Seleccione una ciudad')
                .trim(),
            express_validator_1.check('state')
                .not().isEmpty().withMessage('Seleccione un estado')
                .trim(),
            express_validator_1.check('phone')
                .not().isEmpty().withMessage('Ingrese un número telefonico')
                .trim()
                .isNumeric().withMessage('Solo puede ingresar valores numéricos')
                .isMobilePhone(['es-MX']).withMessage('Ingrese un teléfono valido'),
        ], manager_controllers_1.managerControllers.editManagerById);
        this.router.get('/getChartsPage', [jwt_1.default.checkJWT, roles_1.checkRole(['M'])], manager_controllers_1.managerControllers.getChartsPage);
        this.router.post('/chartDashboard', [jwt_1.default.checkJWT, roles_1.checkRole(['M'])], manager_controllers_1.managerControllers.chartDashboard);
        this.router.get('/getPersonnel', [jwt_1.default.checkJWT, roles_1.checkRole(['M'])], manager_controllers_1.managerControllers.getPersonnel);
        this.router.get('/getPersonnelPage', [jwt_1.default.checkJWT, roles_1.checkRole(['M'])], manager_controllers_1.managerControllers.getPersonnelPage);
        this.router.get('/getNewEmployeePage', [jwt_1.default.checkJWT, roles_1.checkRole(['M'])], manager_controllers_1.managerControllers.getNewEmployeePage);
        this.router.post('/postNewEmployee', [jwt_1.default.checkJWT, roles_1.checkRole(['M'])], [
            express_validator_1.check('name')
                .not().isEmpty().withMessage('Ingrese su nombre')
                .trim()
                .isLength({ min: 3 }).withMessage('El nombre debe de contener al menos 3 caracteres')
                .isAlpha('es-ES', { ignore: ' ' }).withMessage('Solo puede ingresar letras en el nombre'),
            express_validator_1.check('lastname')
                .not().isEmpty().withMessage('Ingrese el apellido')
                .trim()
                .isLength({ min: 3 }).withMessage('El apellido debe de contener al menos 3 caracteres')
                .isAlpha('es-ES', { ignore: ' ' }).withMessage('Solo puede ingresar letras en el apellido'),
            express_validator_1.check('maternalsurname')
                .not().isEmpty().withMessage('Ingrese su segundo apellido')
                .trim()
                .isLength({ min: 3 }).withMessage('El segundo apellido debe de contener al menos 3 caracteres')
                .isAlpha('es-ES', { ignore: ' ' }).withMessage('Solo puede ingresar letras en el segundo apellido'),
            express_validator_1.check('dob')
                .not().isEmpty().withMessage('Ingrese la su fecha de nacimiento')
                .trim()
                .isDate().withMessage('Seleccione un formato valido de fecha'),
            express_validator_1.check('number')
                .not().isEmpty().withMessage('Ingrese el numero de la dirección')
                .trim()
                .isNumeric().withMessage('Solo puede ingresar valores numéricos'),
            express_validator_1.check('street')
                .not().isEmpty().withMessage('Ingrese el nombre de la calle')
                .trim(),
            express_validator_1.check('municipality')
                .not().isEmpty().withMessage('Seleccione una colonia')
                .trim(),
            express_validator_1.check('city')
                .not().isEmpty().withMessage('Seleccione una ciudad')
                .trim(),
            express_validator_1.check('state')
                .not().isEmpty().withMessage('Seleccione un estado')
                .trim(),
            express_validator_1.check('phone')
                .not().isEmpty().withMessage('Ingrese un número telefonico')
                .trim()
                .isNumeric().withMessage('Solo puede ingresar valores numéricos')
                .isMobilePhone(['es-MX']).withMessage('Ingrese un teléfono valido'),
            express_validator_1.check('email')
                .not().isEmpty().withMessage('Debe enviar correo electrónico')
                .trim()
                .isEmail().withMessage('Envie un correo electrónico valido')
        ], manager_controllers_1.managerControllers.postNewEmployee);
    }
}
const managerRoutes = new ManagerRoutes();
exports.default = managerRoutes.router;
