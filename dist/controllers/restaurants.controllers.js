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
class ResturantController {
    getManagerPage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = res.locals.token;
            try {
                const restaurant = yield restaurant_1.default.findWithUser(user.id_user);
                if (!restaurant) {
                    return res.redirect('/api/restaurants/postNewRestaurant');
                }
                res.render('restaurants/manager', {
                    title: 'Página de supervisor',
                    user: res.locals.token,
                    active: true,
                    loggedIn: true
                });
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    errorMessage: 'Error al obtener la página del supervisor'
                });
            }
        });
    }
    getNewRestaurantPage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = res.locals.token;
            console.log(user);
            try {
                const restaurant = yield restaurant_1.default.findWithUser(user.id_user);
                if (restaurant) {
                    return res.redirect('/api/restaurants/manager');
                }
                res.render('restaurants/newRestaurant', {
                    title: 'Registro de un nuevo restaurant',
                    active: true,
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
    postNewRestaurant(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const restaurantObj = {
                name: req.body.name,
                type: req.body.type,
                street: req.body.street,
                number: req.body.number,
                municipality: req.body.municipality,
                city: req.body.city,
                state: req.body.state
            };
            const hours = req.body.hours;
            const user = res.locals.token;
            try {
                const restaurant = new restaurant_1.default();
                yield restaurant.save(restaurantObj, user.user, hours);
                res.json({
                    status: 200,
                    message: 'Restaurant registrado con éxito'
                });
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    status: 304,
                    errorMessage: 'Error al registrar el nuevo restaurant'
                });
            }
        });
    }
    getAllRestaurants(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const restaurants = yield restaurant_1.default.fetchAll();
                res.status(200).json(restaurants);
            }
            catch (error) {
                if (error)
                    console.log(error);
                res.json({
                    errorMessage: 'Error al obtener los restaurants'
                });
            }
        });
    }
    getRestaurantById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const restaurant = yield restaurant_1.default.findById(id);
                if (restaurant.length === 0) {
                    return res.status(404).json({
                        message: 'Restaurant no encontrado'
                    });
                }
                res.status(200).json(restaurant[0]);
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
    /* async updateRestaurantById(req: Request, res: Response) {
        const {
            name,
            restaurantType,
            street,
            number,
            municipality,
            city,
            state,
            phone,
            businessHours
        } = req.body

        const resturant = new Restaurant(
            name.toUpperCase(),
            restaurantType,
            street.toUpperCase(),
            number,
            municipality.toUpperCase(),
            city.toUpperCase(),
            state.toUpperCase(),
            phone,
            businessHours
        )

        try {
            const { id } = req.params

            const restaurant: any = await Restaurant.findById(id)

            if (restaurant.length === 0) {
                return res.status(404).json({
                    message: 'Restaurant no encontrado'
                })
            }

            await resturant.updateById(id)

            res.status(200).json({
                message: 'Restaurant actualizado'
            })
        } catch (error) {
            if (error) console.log(error)

            res.json({
                errorMessage: 'Error al actualizar el restaurant'
            })
        }
    } */
    deleteRestaurantById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const restaurant = yield restaurant_1.default.findById(id);
                if (restaurant.length === 0) {
                    return res.status(404).json({
                        message: 'Restaurant no encontrado'
                    });
                }
                yield restaurant_1.default.deleteById(id);
                res.status(200).json('Restaurant borrado');
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
