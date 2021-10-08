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
class ProductRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/getNewProductPage', jwt_1.default.checkJWT, products_controllers_1.productController.getNewProductPage);
        //Post new product 
        this.router.post('/postNewProduct', jwt_1.default.checkJWT, [
            //Validations
            express_validator_1.check('name')
                .trim()
                .not().isEmpty().withMessage('Ingrese el nombre del producto')
                .isLength({ min: 0, max: 20 }),
            express_validator_1.check('cost')
                .trim()
                .isFloat({ min: 0, max: 499 }).withMessage('Ingrese solo numeros y el valor no puede exceder de $500'),
            express_validator_1.check('price')
                .trim()
                .isFloat({ min: 0, max: 499 }).withMessage('Ingrese solo numeros y el valor no puede exceder de $500'),
            express_validator_1.check('image')
                .not().isEmpty().withMessage('Por favor ingrese la imagen del producto'),
        ], upload_1.upload.single('image'), products_controllers_1.productController.postNewProduct);
        this.router.get('/getAllProductsByRestaurant', jwt_1.default.checkJWT, products_controllers_1.productController.getAllProductsPage);
        /*
        this.router.get('/:id', productController.getProductById)
        this.router.patch('/:id', upload.single('image'), productController.updateProductById)
        this.router.delete('/:id', productController.deleteProductById) */
    }
}
const productRoutes = new ProductRoutes();
exports.default = productRoutes.router;
