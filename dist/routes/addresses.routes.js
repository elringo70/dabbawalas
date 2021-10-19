"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const addresses_controllers_1 = require("../controllers/addresses.controllers");
class AddressesRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/getAllStates', addresses_controllers_1.addressesController.getAllStates);
        this.router.get('/getAllCitiesFromState/:state', addresses_controllers_1.addressesController.getAllCitiesFromState);
        this.router.get('/getAllMunicipalitiesFromCity/:municipality', addresses_controllers_1.addressesController.getAllMunicipalitiesFromCity);
    }
}
const addressesRoutes = new AddressesRoutes();
exports.default = addressesRoutes.router;
