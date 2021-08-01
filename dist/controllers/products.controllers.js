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
class ProductController {
    getNewProductPage(req, res) {
        res.render('products/newProduct', {
            title: 'Agregar nuevo platillo',
            user: res.locals.token,
            active: true,
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
        return __awaiter(this, void 0, void 0, function* () {
            const user = res.locals.token;
            try {
                const restaurant = yield restaurant_1.default.findWithUser(user.id_user);
                const productObj = {
                    name: req.body.name,
                    cost: req.body.cost,
                    price: req.body.price,
                    image: req.file.path,
                    description: req.body.description,
                    active: 1,
                    id_restaurant: restaurant === null || restaurant === void 0 ? void 0 : restaurant.id_restaurant
                };
                const product = new product_1.default();
                yield product.save(productObj);
                res.status(201).json({
                    status: 201,
                    message: 'Producto agregado con éxito'
                });
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    errorMessage: 'Error al agregar el Platillo'
                });
            }
        });
    }
}
exports.productController = new ProductController();
