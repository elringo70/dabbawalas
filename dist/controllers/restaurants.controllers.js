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
exports.restaurantController = void 0;
const restaurant_1 = __importDefault(require("../models/restaurant"));
const express_validator_1 = require("express-validator");
const addresses_1 = __importDefault(require("../models/addresses"));
class ResturantController {
    getManagerPage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = res.locals.token;
            try {
                if (user.id_restaurant === null || user.id_restaurant === undefined) {
                    return res.redirect('/api/restaurants/postNewRestaurant');
                }
                res.render('restaurants/manager', {
                    title: 'Página de supervisor',
                    user,
                    active: true,
                    manager: true,
                    loggedIn: true
                });
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    message: 'Error al obtener la página del supervisor'
                });
            }
        });
    }
    cookerRegistrationPage(req, res) {
        const user = res.locals.token;
        res.render('restaurants/cookers-registration', {
            title: 'Alta de cocineros',
            user,
            active: true,
            manager: true,
            loggedIn: true
        });
    }
    updateRestaurantPage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = res.locals.token;
            const { id } = req.params;
            try {
                const restaurant = yield restaurant_1.default.findById(id);
                let address;
                if ((restaurant === null || restaurant === void 0 ? void 0 : restaurant.id_address) !== undefined) {
                    address = yield addresses_1.default.findById(restaurant === null || restaurant === void 0 ? void 0 : restaurant.id_address);
                }
                res.render('restaurants/edit-restaurant', {
                    title: 'Edit restaurant',
                    user,
                    restaurant,
                    address,
                    active: true,
                    admin: true,
                    loggedIn: true
                });
            }
            catch (error) {
                res.render('restaurants/edit-restaurant', {
                    title: 'Edit restaurant',
                    active: true,
                    admin: true,
                    loggedIn: true,
                    errorMessage: 'Error while loading edit restaurant page'
                });
            }
        });
    }
    updateRestaurant(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = express_validator_1.validationResult(req);
            const error = errors.array();
            const body = req.body;
            const { days, openhours, closinghours } = req.body;
            const id = req.body.id_restaurant;
            try {
                if (!errors.isEmpty()) {
                    return res.json({
                        status: 304,
                        message: error[0].msg
                    });
                }
                const restaurant = yield restaurant_1.default.findById(id);
                if (!restaurant) {
                    return res.json({
                        status: 304,
                        message: 'No se encuentra el restaurant que esta enviando'
                    });
                }
                const restaurantObject = {
                    id_restaurant: id,
                    name: body.name.toUpperCase(),
                    type: body.type.toUpperCase(),
                    phone: body.phone,
                    description: body.description.toUpperCase()
                };
                const addressObject = {
                    id_address: restaurant.id_restaurant,
                    id_state: body.state,
                    id_city: body.city,
                    id_municipality: body.municipality,
                    number: body.number,
                    street: body.street.toUpperCase()
                };
                let schedule = [];
                for (let i = 0; i < days.length; i++) {
                    const businessHours = {
                        day: days[i],
                        openhours: openhours[i],
                        closinghours: closinghours[i]
                    };
                    schedule.push(businessHours);
                }
                const query = `
                SELECT *
                FROM business_hours
                WHERE id_restaurant=${id}
                ORDER BY
                    day ASC
            `;
                //Search for actual schedule from restaurant
                const business_hours = yield restaurant_1.default.findOne(query);
                //Compare if actual schedule is different from posting one
                const differentSchedule = compareObjects(business_hours, schedule);
                if (!differentSchedule) {
                    //If false, program will delete actual schedule and insert a new one
                    const query = `
                    DELETE FROM business_hours WHERE id_restaurant=${id}
                `;
                    //Delete actual schedule
                    yield restaurant_1.default.findOne(query);
                    const updatedRestaurant = new restaurant_1.default();
                    yield updatedRestaurant.updateById(restaurantObject, addressObject, schedule);
                }
                else {
                    //If schedule is the same, will continue program in else condition
                    const updatedRestaurant = new restaurant_1.default();
                    yield updatedRestaurant.updateById(restaurantObject, addressObject);
                }
                res.json({
                    status: 200,
                    message: 'Restaurante actualizado'
                });
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    status: 304,
                    message: 'Error al actualizar el restaurante'
                });
            }
        });
    }
    getBusinessHours(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = res.locals.token;
            const { id } = req.params;
            try {
                const query = `
                SELECT *
                FROM business_hours
                WHERE id_restaurant=${id}
                ORDER BY
                    day ASC
            `;
                const business_hours = yield restaurant_1.default.findOne(query);
                res.status(200).json(business_hours);
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    errorMessage: 'Error while pulling business hours'
                });
            }
        });
    }
    getNewRestaurantPage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = res.locals.token;
            try {
                if (user.id_restaurant) {
                    return res.redirect('/api/restaurants/manager');
                }
                res.render('restaurants/newRestaurant', {
                    title: 'Registro de un nuevo restaurant',
                    active: true,
                    manager: true,
                    loggedIn: true
                });
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    errorMessage: 'Error al obtener la página'
                });
            }
        });
    }
    getAllRestaurantsPage(req, res) {
        const user = res.locals.token;
        res.status(200).render('restaurants/restaurants', {
            title: 'All restaurants',
            user,
            active: true,
            admin: true,
            loggedIn: true
        });
    }
    getAllRestaurants(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                SELECT
                    restaurants.*,
                    manager_restaurant.id_user,
                    colonias.nombre AS municipality,
                    municipios.nombre AS city,
                    estados.nombre AS state,
                    addresses.street,
                    addresses.number
                FROM restaurants
                JOIN manager_restaurant
                    ON restaurants.id_restaurant = manager_restaurant.id_restaurant
                JOIN addresses
                    ON restaurants.id_address = addresses.id_address
                JOIN colonias
                    ON addresses.id_municipality=colonias.id
                JOIN municipios
                    ON addresses.id_city=municipios.id
                JOIN estados
                    ON addresses.id_state=estados.id
            `;
                const restaurants = yield restaurant_1.default.fetchAll(query);
                res.status(200).json(restaurants);
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    errorMessage: 'Error while loading restaurants'
                });
            }
        });
    }
    postNewRestaurant(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = express_validator_1.validationResult(req);
            const error = errors.array();
            const body = req.body;
            const user = res.locals.token;
            try {
                if (!errors.isEmpty()) {
                    return res.json({
                        status: 304,
                        message: error[0].msg
                    });
                }
                const restaurantObject = {
                    name: body.name.toUpperCase(),
                    type: body.type.toUpperCase(),
                    phone: body.phone,
                    description: body.description.toUpperCase()
                };
                const restaurantAddress = {
                    id_state: body.state,
                    id_city: body.city,
                    id_municipality: body.municipality,
                    number: body.number.toUpperCase(),
                    street: body.street.toUpperCase()
                };
                const { days, openhours, closinghours } = req.body;
                let hours = [];
                for (let i = 0; i < days.length; i++) {
                    const hour = {
                        day: days[i],
                        openhours: openhours[i],
                        closinghours: closinghours[i]
                    };
                    hours.push(hour);
                }
                const restaurant = new restaurant_1.default();
                yield restaurant.save(user.user, restaurantObject, restaurantAddress, hours);
                res.json({
                    status: 201,
                    message: 'Restaurant creado correctamente'
                });
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    status: 304,
                    message: 'Error al registrar el nuevo restaurant'
                });
            }
        });
    }
    getRestaurantById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const restaurant = yield restaurant_1.default.findById(id);
                if (!restaurant) {
                    return res.status(404).json({
                        message: 'Restaurant no encontrado'
                    });
                }
                res.status(200).json(restaurant);
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    errorMessage: 'Error al obtener el restaurant'
                });
            }
        });
    }
    deleteRestaurantById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const query = `
                DELETE
                FROM restaurants
                WHERE id_restaurant=${id}
            `;
                const restaurant = yield restaurant_1.default.deleteById(query);
                if (!restaurant) {
                    return res.status(404).json({
                        message: 'Error while deleting restaurant'
                    });
                }
                yield restaurant_1.default.deleteById(id);
                res.status(200).json({
                    message: 'Restaurant deleted'
                });
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    errorMessage: 'Error al borrar el restaurant'
                });
            }
        });
    }
}
exports.restaurantController = new ResturantController();
//Compare two IBusinessHours objects arrays and know if actual schedule is the same
//from database and updated information from form
function compareObjects(actualSchedule, newSchedule) {
    let different = true;
    if (actualSchedule.length !== newSchedule.length) {
        return different = false;
    }
    //Sort by day
    actualSchedule.sort((a, b) => (a.day > b.day) ? 1 : -1);
    newSchedule.sort((a, b) => (a.days > b.days) ? 1 : -1);
    for (let i = 0; i < actualSchedule.length; i++) {
        if (actualSchedule[i].day != newSchedule[i].days) {
            different = false;
            break;
        }
        if (actualSchedule[i].openhours != newSchedule[i].openhours) {
            different = false;
            break;
        }
        if (actualSchedule[i].closinghours != newSchedule[i].closinghours) {
            different = false;
            break;
        }
    }
    return different;
}
