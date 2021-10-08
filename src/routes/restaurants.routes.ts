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

        this.router.get('/getAllRestaurants', [checkJWT.checkJWT, checkRole(['A'])], restaurantController.getAllRestaurants)
        this.router.get('/getAllRestaurantsPage', [checkJWT.checkJWT, checkRole(['A'])], restaurantController.getAllRestaurantsPage)
        this.router.get('/getManagerPage', [checkJWT.checkJWT, checkRole(['M'])], restaurantController.getManagerPage)
        this.router.get('/cookerRegistration', [checkJWT.checkJWT, checkRole(['M'])], restaurantController.cookerRegistrationPage)
        
        this.router.post('/postCookerRegistration', [checkJWT.checkJWT, checkRole(['M'])], [
            
            //Cooker post validations
            check('name')
                .not().isEmpty().withMessage('Ingrese el nombre')
                .trim()
                .isLength({ min: 3 }).withMessage('El nombre debe de contener al menos 3 caracteres')
                .isAlpha('es-ES', { ignore: ' ' }).withMessage('Solo puede ingresar letras en el nombre'),
            check('lastname')
                .not().isEmpty().withMessage('Ingrese el apellido')
                .trim()
                .isLength({ min: 3 }).withMessage('El apellido debe de contener al menos 3 caracteres')
                .isAlpha('es-ES', { ignore: ' ' }).withMessage('Solo puede ingresar letras en el apellido'),
            check('maternalsurname')
                .not().isEmpty().withMessage('Ingrese el segundo apellido')
                .trim()
                .isLength({ min: 3 }).withMessage('El segundo apellido debe de contener al menos 3 caracteres')
                .isAlpha('es-ES', { ignore: ' ' }).withMessage('Solo puede ingresar letras en el segundo apellido'),
            check('dob')
                .not().isEmpty().withMessage('Ingrese la su fecha de nacimiento')
                .trim()
                .isDate().withMessage('Seleccione un formato valido de fecha'),
            check('email')
                .not().isEmpty().withMessage('Ingrese un correo electrónico')
                .trim()
                .isEmail().withMessage('Ingrese un email con formato valido'),
            check('pass')
                .not().isEmpty().withMessage('Ingrese una contraseña')
                .trim()
                .isStrongPassword({ minLength: 6, minUppercase: 1, minSymbols: 1 }).withMessage('Ingrese la contraseña como se le indica')
        ], restaurantController.postCookerRegistration)

        //Admin routes
        this.router.get('/:id', [checkJWT.checkJWT, checkRole(['M', 'A'])], restaurantController.getRestaurantById)
        this.router.delete('deleteRestaurantById/:id', [checkJWT.checkJWT, checkRole(['A'])], restaurantController.deleteRestaurantById)
        this.router.get('/editRestaurantPage/:id', [checkJWT.checkJWT, checkRole(['A'])], restaurantController.updateRestaurantPage)
        this.router.get('/getBusinessHours/:id', [checkJWT.checkJWT, checkRole(['A', 'M'])], restaurantController.getBusinessHours)

        //Update restaurant route
        /* this.router.post('/updateRestaurant/:id', [checkJWT.checkJWT, checkRole(['A'])], [
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
        ], restaurantController.updateRestaurant) */
    }
}

const restaurantRoutes = new RestaurantRoutes()
export default restaurantRoutes.router