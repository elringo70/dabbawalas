import { Router } from 'express'
import { restaurantController } from '../controllers/restaurants.controllers'
import checkJWT from '../middlewares/jwt'
import { check } from 'express-validator'
import { checkRole } from '../middlewares/roles'

class RestaurantRoutes {
    public router: Router

    constructor() {
        this.router = Router()
        this.config()
    }

    private config() {
        this.router.get('/postNewRestaurant', [checkJWT.checkJWT, checkRole(['M'])], restaurantController.getNewRestaurantPage)

        //Post new restaurant route
        this.router.post('/postNewRestaurant', [checkJWT.checkJWT, checkRole(['M'])], [
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

        this.router.get('/', [checkJWT.checkJWT, checkRole(['M'])], restaurantController.getAllRestaurants)
        this.router.get('/manager', [checkJWT.checkJWT, checkRole(['M'])], restaurantController.getManagerPage)
        this.router.get('/cookerRegistration', [checkJWT.checkJWT, checkRole(['M'])], restaurantController.cookerRegistrationPage)
        this.router.post('/postCookerRegistration', [checkJWT.checkJWT, checkRole(['M'])], restaurantController.postCookerRegistration)
        this.router.get('/:id', [checkJWT.checkJWT, checkRole(['M', 'A'])], restaurantController.getRestaurantById)
        this.router.delete('/:id', [checkJWT.checkJWT, checkRole(['M'])], restaurantController.deleteRestaurantById)
        this.router.get('/editRestaurantPage/:id', [checkJWT.checkJWT, checkRole(['A'])], restaurantController.updateRestaurantPage)
        this.router.get('/getBusinessHours/:id', [checkJWT.checkJWT, checkRole(['A', 'M'])], restaurantController.getBusinessHours)

        //Update restaurant route
        this.router.post('/updateRestaurant/:id', [checkJWT.checkJWT, checkRole(['A'])], [
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
        ], restaurantController.updateRestaurant)
    }
}

const restaurantRoutes = new RestaurantRoutes()
export default restaurantRoutes.router