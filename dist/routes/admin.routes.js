"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controllers_1 = require("../controllers/admin.controllers");
const roles_1 = require("../middlewares/roles");
const jwt_1 = __importDefault(require("../middlewares/jwt"));
class AdminRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/getAdminDashboardPage', [jwt_1.default.checkJWT, roles_1.checkRole(['A'])], admin_controllers_1.adminController.getAdminDashboardPage);
        this.router.get('/adminCharts', [jwt_1.default.checkJWT, roles_1.checkRole(['A'])], admin_controllers_1.adminController.adminCharts);
        this.router.post('/postLoadRestaurantData', [jwt_1.default.checkJWT, roles_1.checkRole(['A'])], admin_controllers_1.adminController.postLoadRestaurantData);
        this.router.get('/getAllManagersPage', [jwt_1.default.checkJWT, roles_1.checkRole(['A'])], admin_controllers_1.adminController.getAllManagersPage);
        this.router.get('/getAllManagers', [jwt_1.default.checkJWT, roles_1.checkRole(['A'])], admin_controllers_1.adminController.getAllManagers);
        this.router.get('/getManagerPageInfoPage/:id', [jwt_1.default.checkJWT, roles_1.checkRole(['A'])], admin_controllers_1.adminController.getManagerPageInfoPage);
        this.router.patch('/approveManager/:id', [jwt_1.default.checkJWT, roles_1.checkRole(['A'])], admin_controllers_1.adminController.approveManager);
        this.router.get('/getRestaurantsPersonnelPage', [jwt_1.default.checkJWT, roles_1.checkRole(['A'])], admin_controllers_1.adminController.getRestaurantsPersonnelPage);
        this.router.post('/postAllPersonnelRestaurant', [jwt_1.default.checkJWT, roles_1.checkRole(['A'])], admin_controllers_1.adminController.postAllPersonnelRestaurant);
    }
}
const adminRoutes = new AdminRoutes();
exports.default = adminRoutes.router;
