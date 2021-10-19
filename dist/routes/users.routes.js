"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controllers_1 = require("../controllers/users.controllers");
const roles_1 = require("../middlewares/roles");
const jwt_1 = __importDefault(require("../middlewares/jwt"));
class UsersRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/getUserByEmail/:email', [jwt_1.default.checkJWT, roles_1.checkRole(['A', 'M'])], users_controllers_1.userControllers.getUserByEmail);
        this.router.delete('/deleteEmployeeById/:id', [jwt_1.default.checkJWT, roles_1.checkRole(['A', 'M'])], users_controllers_1.userControllers.deleteEmployeeById);
    }
}
const usersRoutes = new UsersRoutes();
exports.default = usersRoutes.router;
