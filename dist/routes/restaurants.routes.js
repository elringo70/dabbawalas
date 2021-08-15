"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const restaurants_controllers_1 = require("../controllers/restaurants.controllers");
const jwt_1 = __importDefault(require("../middlewares/jwt"));
const express_validator_1 = require("express-validator");
class RestaurantRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/postNewRestaurant', jwt_1.default.checkJWT, restaurants_controllers_1.restaurantController.getNewRestaurantPage);
        //Post new restaurant route
        this.router.post('/postNewRestaurant', jwt_1.default.checkJWT, [
            //Input validations
            express_validator_1.check('name')
                .not().isEmpty().withMessage('Ingrese el nombre')
                .trim()
                .isLength({ min: 3 }).withMessage('El nombre debe de contener al menos 3 caracteres'),
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
                .isMobilePhone(['es-MX']).withMessage('Ingrese un teléfono valido')
        ], restaurants_controllers_1.restaurantController.postNewRestaurant);
        this.router.get('/', jwt_1.default.checkJWT, restaurants_controllers_1.restaurantController.getAllRestaurants);
        this.router.get('/manager', jwt_1.default.checkJWT, restaurants_controllers_1.restaurantController.getManagerPage);
        this.router.get('/:id', jwt_1.default.checkJWT, restaurants_controllers_1.restaurantController.getRestaurantById);
        //this.router.patch('/:id', checkJWT.checkJWT, restaurantController.updateRestaurantById)
        this.router.delete('/:id', jwt_1.default.checkJWT, restaurants_controllers_1.restaurantController.deleteRestaurantById);
    }
}
const restaurantRoutes = new RestaurantRoutes();
exports.default = restaurantRoutes.router;
