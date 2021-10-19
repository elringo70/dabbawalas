"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const products_controllers_1 = require("../controllers/products.controllers");
const jwt_1 = __importDefault(require("../middlewares/jwt"));
const express_validator_1 = require("express-validator");
const upload_1 = require("../middlewares/upload");
const roles_1 = require("../middlewares/roles");
class ProductRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/getNewProductPage', [jwt_1.default.checkJWT, roles_1.checkRole(['M'])], products_controllers_1.productController.getNewProductPage);
        //Post new product 
        this.router.post('/postNewProduct', [jwt_1.default.checkJWT, roles_1.checkRole(['M'])], upload_1.upload.single('image'), [
            //Validations
            express_validator_1.check('name')
                .not().isEmpty().withMessage('Ingrese el nombre del producto')
                .trim()
                .isLength({ min: 0, max: 20 }),
            express_validator_1.check('cost')
                .not().isEmpty().withMessage('Ingrese el costo del producto')
                .isFloat({ min: 0, max: 499 }).withMessage('Ingrese solo numeros y el valor no puede exceder de $500'),
            express_validator_1.check('price')
                .not().isEmpty().withMessage('Ingrese el precio de venta del producto')
                .isFloat({ min: 0, max: 499 }).withMessage('Ingrese solo numeros y el valor no puede exceder de $500'),
            express_validator_1.check('cookingtime')
                .not().isEmpty().withMessage('Ingrese el tiempo de cocción')
                .isInt({ min: 10, max: 60 }).withMessage('Debe de ser un minimo de 10 minutos y maximo de 60'),
            express_validator_1.check('description')
                .not().isEmpty().withMessage('Ingrese una descripción')
                .trim()
                .isLength({ min: 20, max: 100 }).withMessage('Ingrese un mínimo de 20 o máximo de 100 caracteres para la descripción')
        ], products_controllers_1.productController.postNewProduct);
        this.router.get('/getAllProductsPage', [jwt_1.default.checkJWT, roles_1.checkRole(['M'])], products_controllers_1.productController.getAllProductsPage);
        this.router.get('/getAllProductsByRestaurant', [jwt_1.default.checkJWT, roles_1.checkRole(['M'])], products_controllers_1.productController.getAllProductsByRestaurant);
        this.router.post('/getProductByIdByRestaurant', [jwt_1.default.checkJWT, roles_1.checkRole(['M', 'CA'])], products_controllers_1.productController.getProductByIdByRestaurant);
        this.router.delete('/deleteProductByIdByRestaurant/:id', [jwt_1.default.checkJWT, roles_1.checkRole(['M'])], products_controllers_1.productController.deleteProductByIdByRestaurant);
        this.router.get('/editProductByIdPage/:id', [jwt_1.default.checkJWT, roles_1.checkRole(['M'])], products_controllers_1.productController.editProductByIdPage);
        this.router.patch('/editProductByIdByRestaurant/:id', [jwt_1.default.checkJWT, roles_1.checkRole(['M'])], upload_1.upload.single('image'), [
            //Validations
            express_validator_1.check('name')
                .not().isEmpty().withMessage('Ingrese el nombre del producto')
                .trim()
                .isLength({ min: 0, max: 20 }),
            express_validator_1.check('cost')
                .not().isEmpty().withMessage('Ingrese el costo del producto')
                .isFloat({ min: 0, max: 499 }).withMessage('Ingrese solo numeros y el valor no puede exceder de $500'),
            express_validator_1.check('price')
                .not().isEmpty().withMessage('Ingrese el precio de venta del producto')
                .isFloat({ min: 0, max: 499 }).withMessage('Ingrese solo numeros y el valor no puede exceder de $500'),
            express_validator_1.check('cookingtime')
                .not().isEmpty().withMessage('Ingrese el tiempo de cocción')
                .isInt({ min: 10, max: 60 }).withMessage('Debe de ser un minimo de 10 minutos y maximo de 60'),
            express_validator_1.check('description')
                .not().isEmpty().withMessage('Ingrese una descripción')
                .trim()
                .isLength({ min: 20, max: 100 }).withMessage('Ingrese un mínimo de 20 o máximo de 100 caracteres para la descripción')
        ], products_controllers_1.productController.editProductByIdByRestaurant);
    }
}
const productRoutes = new ProductRoutes();
exports.default = productRoutes.router;
