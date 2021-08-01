"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
//Index controllers
const index_controllers_1 = require("../controllers/index.controllers");
class IndexRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        //Index Routes
        this.router.get('/', index_controllers_1.indexControllers.getIndexPage);
        this.router.get('/restaurantes', index_controllers_1.indexControllers.getRestaurantIndexPage);
        this.router.get('/restaurantes/registro', index_controllers_1.indexControllers.getRestaurantRegistration);
        this.router.get('/login', index_controllers_1.indexControllers.getLoginPage);
    }
}
const indexRoutes = new IndexRoutes();
exports.default = indexRoutes.router;
