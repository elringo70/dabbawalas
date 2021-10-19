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
exports.productController = void 0;
const product_1 = __importDefault(require("../models/product"));
const restaurant_1 = __importDefault(require("../models/restaurant"));
const express_validator_1 = require("express-validator");
class ProductController {
    getNewProductPage(req, res) {
        res.render('products/newProduct', {
            title: 'Agregar nuevo platillo',
            user: res.locals.token,
            active: true,
            manager: true,
            loggedIn: true
        });
    }
    getAllProductsPage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = res.locals.token;
            try {
                const restaurant = yield restaurant_1.default.findWithUser(user.id_user);
                const products = yield product_1.default.fetchAllByRestaurant(restaurant === null || restaurant === void 0 ? void 0 : restaurant.id_restaurant);
                res.render('products/getAllProducts', {
                    title: 'Todos los platillos',
                    user: res.locals.token,
                    products: products,
                    active: true,
                    manager: true,
                    loggedIn: true
                });
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    errorMessage: 'Error al obtener los platillos'
                });
            }
        });
    }
    postNewProduct(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const errors = express_validator_1.validationResult(req);
            const error = errors.array();
            const body = req.body;
            const user = res.locals.token;
            try {
                const image = (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename;
                const productObj = {
                    name: body.name.toUpperCase(),
                    cost: body.cost,
                    price: body.price,
                    image: 'uploads/' + image,
                    description: body.description.toUpperCase(),
                    cookingTime: body.cookingtime,
                    active: 1,
                    id_restaurant: user.id_restaurant
                };
                if (image === undefined) {
                    error.push({
                        value: '',
                        msg: 'No ingreso ninguna archivo de imagen o excede el tamaño permitido',
                        param: 'name',
                        location: 'body'
                    });
                    return res.status(422).render('products/newProduct', {
                        user,
                        title: 'Agregar nuevo platillo',
                        product: productObj,
                        active: true,
                        manager: true,
                        loggedIn: true,
                        error: error[0]
                    });
                }
                if (!errors.isEmpty()) {
                    return res.status(422).render('products/newProduct', {
                        user,
                        title: 'Agregar nuevo platillo',
                        product: productObj,
                        active: true,
                        manager: true,
                        loggedIn: true,
                        error: error[0]
                    });
                }
                const product = new product_1.default();
                yield product.save(productObj);
                res.status(201).render('products/newProduct', {
                    user,
                    title: 'Agregar nuevo platillo',
                    active: true,
                    manager: true,
                    loggedIn: true,
                    message: 'Producto agregado'
                });
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.render('products/newProduct', {
                    user,
                    title: 'Agregar nuevo platillo',
                    active: true,
                    manager: true,
                    loggedIn: true,
                    errorMessage: 'Error al agregar el Platillo'
                });
            }
        });
    }
    getProductByIdByRestaurant(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = res.locals.token;
            const id = req.body.id;
            try {
                const product = yield product_1.default.findById(id, user.id_restaurant);
                if (product) {
                    return res.json({
                        status: 200,
                        product
                    });
                }
                res.json({
                    status: 304,
                    message: 'Platillo no encontrado'
                });
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    errorMessage: 'Error al buscar al platillo'
                });
            }
        });
    }
    deleteProductByIdByRestaurant(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = res.locals.token;
            const id = req.params.id;
            try {
                const product = {
                    id_product: id,
                    id_restaurant: user.id_restaurant
                };
                yield product_1.default.deleteById(product);
                res.status(200).json({
                    status: 200,
                    message: 'Platillo borrado'
                });
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    errorMessage: 'Error al eliminar el platillo'
                });
            }
        });
    }
    getAllProductsByRestaurant(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = res.locals.token;
            try {
                const products = yield product_1.default.fetchAllByRestaurant(user.id_restaurant);
                res.json(products);
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    errorMessage: 'Error al traer los platillos'
                });
            }
        });
    }
    editProductByIdPage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = res.locals.token;
            const id = req.params.id;
            try {
                const editProduct = yield product_1.default.findById(id, user.id_restaurant);
                res.status(200).render('products/edit-product', {
                    title: 'Editar el platillo',
                    user: res.locals.token,
                    product: editProduct,
                    active: true,
                    manager: true,
                    loggedIn: true
                });
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.render('products/edit-product', {
                    title: 'Editar el platillo',
                    user: res.locals.token,
                    errorMessage: 'Error al cargar la página',
                    active: true,
                    manager: true,
                    loggedIn: true
                });
            }
        });
    }
    editProductByIdByRestaurant(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const errors = express_validator_1.validationResult(req);
            const error = errors.array();
            const body = req.body;
            const user = res.locals.token;
            const { id } = req.params;
            try {
                if (!errors.isEmpty()) {
                    return res.json({
                        status: 304,
                        message: error[0].msg
                    });
                }
                const image = (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename;
                const productObject = {
                    name: body.name.toUpperCase(),
                    cost: body.cost,
                    price: body.price,
                    description: body.description.toUpperCase(),
                    cookingTime: body.cookingtime,
                    active: 1,
                    id_restaurant: user.id_restaurant
                };
                if (image !== undefined) {
                    productObject.image = 'uploads/' + image;
                }
                const searchProduct = yield product_1.default.findById(id, user.id_restaurant);
                if (!searchProduct) {
                    return res.json({
                        status: 200,
                        message: 'Error con el id del platillo'
                    });
                }
                const product = new product_1.default();
                yield product.updateById(id, productObject);
                res.json({
                    status: 200,
                    message: 'Platillo editado con éxito'
                });
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    status: 304,
                    message: 'Error al editar el platillo'
                });
            }
        });
    }
}
exports.productController = new ProductController();
