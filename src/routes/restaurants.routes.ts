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

        //Post new restaurant route
        this.router.post('/postNewRestaurant', checkJWT.checkJWT, [
            //Input validations
            check('name')
                .not().isEmpty().withMessage('Ingrese el nombre')
                .trim()
                .isLength({ min: 3 }).withMessage('El nombre debe de contener al menos 3 caracteres'),
            check('number')
                .not().isEmpty().withMessage('Ingrese el número de casa')
                .trim()
                .isNumeric().withMessage('Solo puede ingresar valores numéricos'),
            check('street')
                .not().isEmpty().withMessage('Ingrese la calle')
                .trim(),
            check('municipality')
                .not().isEmpty().withMessage('Ingrese la colonia')
                .trim(),
            check('city')
                .not().isEmpty().withMessage('Ingrese la ciudad')
                .trim(),
            check('state')
                .not().isEmpty().withMessage('Ingrese el estado')
                .trim(),
            check('phone')
                .trim()
                .isNumeric().withMessage('Solo puede ingresar valores numéricos')
                .isMobilePhone(['es-MX']).withMessage('Ingrese un teléfono valido')
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