import { Router } from 'express'
import { restaurantController } from '../controllers/restaurants.controllers'
import checkJWT from '../middlewares/jwt'
import { check } from 'express-validator'

class RestaurantRoutes {
    public router: Router

    constructor() {
        this.router = Router()
        this.config()
    }

    private config() {
        this.router.get('/postNewRestaurant', checkJWT.checkJWT, restaurantController.getNewRestaurantPage)

        this.router.post('/postNewRestaurant', checkJWT.checkJWT, [
            check('name')
                .not().isEmpty().withMessage('Ingrese nombre del restaurant')
                .trim()
                .not().isEmpty().withMessage('Ingrese el tipo de restaurant')
                .trim(),
            check('number')
                .not().isEmpty().withMessage('No ingreso ningun valor')
                .trim()
                .isNumeric().withMessage('Solo puede ingresar valores numéricos'),
            check('street')
                .not().isEmpty().withMessage('No ingreso ningun valor')
                .trim(),
            check('municipality')
                .not().isEmpty().withMessage('No ingreso ningun valor')
                .trim(),
            check('city')
                .not().isEmpty().withMessage('No ingreso ningun valor')
                .trim(),
            check('state')
                .not().isEmpty().withMessage('No ingreso ningun valor')
                .trim(),
        ], restaurantController.postNewRestaurant)
        this.router.get('/', checkJWT.checkJWT, restaurantController.getAllRestaurants)
        this.router.get('/manager', checkJWT.checkJWT, restaurantController.getManagerPage)
        this.router.get('/:id', checkJWT.checkJWT, restaurantController.getRestaurantById)
        //this.router.patch('/:id', checkJWT.checkJWT, restaurantController.updateRestaurantById)
        this.router.delete('/:id', checkJWT.checkJWT, restaurantController.deleteRestaurantById)
    }
}

const restaurantRoutes = new RestaurantRoutes()
export default restaurantRoutes.router