"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const restaurants_controllers_1 = require("../controllers/restaurants.controllers");
const jwt_1 = __importDefault(require("../middlewares/jwt"));
class RestaurantRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/postNewRestaurant', jwt_1.default.checkJWT, restaurants_controllers_1.restaurantController.getNewRestaurantPage);
        this.router.post('/postNewRestaurant', jwt_1.default.checkJWT, restaurants_controllers_1.restaurantController.postNewRestaurant);
        this.router.get('/', jwt_1.default.checkJWT, restaurants_controllers_1.restaurantController.getAllRestaurants);
        this.router.get('/manager', jwt_1.default.checkJWT, restaurants_controllers_1.restaurantController.getManagerPage);
        this.router.get('/:id', jwt_1.default.checkJWT, restaurants_controllers_1.restaurantController.getRestaurantById);
        //this.router.patch('/:id', checkJWT.checkJWT, restaurantController.updateRestaurantById)
        this.router.delete('/:id', jwt_1.default.checkJWT, restaurants_controllers_1.restaurantController.deleteRestaurantById);
    }
}
const restaurantRoutes = new RestaurantRoutes();
exports.default = restaurantRoutes.router;
