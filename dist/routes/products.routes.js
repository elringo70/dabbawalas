"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const products_controllers_1 = require("../controllers/products.controllers");
const upload_1 = require("../middlewares/upload");
const jwt_1 = __importDefault(require("../middlewares/jwt"));
class ProductRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/getNewProductPage', jwt_1.default.checkJWT, products_controllers_1.productController.getNewProductPage);
        this.router.post('/postNewProduct', jwt_1.default.checkJWT, upload_1.upload.single('image'), products_controllers_1.productController.postNewProduct);
        this.router.get('/getAllProducts', jwt_1.default.checkJWT, products_controllers_1.productController.getAllProductsPage);
        /*
        this.router.get('/:id', productController.getProductById)
        this.router.patch('/:id', upload.single('image'), productController.updateProductById)
        this.router.delete('/:id', productController.deleteProductById) */
    }
}
const productRoutes = new ProductRoutes();
exports.default = productRoutes.router;
