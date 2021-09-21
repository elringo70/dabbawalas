import { Router } from 'express'
import { customerController } from '../controllers//customers.controllers'
import { check } from 'express-validator'
import checkJWT from '../middlewares/jwt'
import { checkRole } from '../middlewares/roles'

class CustomerRoutes {
    public router: Router

    constructor() {
        this.router = Router()
        this.config()
    }

    private config() {

        //Route post a new customer
        this.router.post('/postNewCustomer', [checkJWT.checkJWT, checkRole(['M'])], [
            //Inputs validations
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
        ], customerController.postNewCustomer)

        this.router.get('/getCustomerPage', [checkJWT.checkJWT, checkRole(['M'])], customerController.getCustomerPage)
        this.router.get('/getAllCustomersPageByRestaurant', [checkJWT.checkJWT, checkRole(['M'])], customerController.getAllCustomersPage)
        this.router.post('/getCustomerBy', [checkJWT.checkJWT, checkRole(['M', 'A'])], customerController.getCustomerByPhone)
        this.router.get('/getCustomerById/:id', [checkJWT.checkJWT, checkRole(['M', 'A'])], customerController.getCustomerById)
        this.router.post('/getCustomerByPhone', [checkJWT.checkJWT, checkRole(['M', 'A'])], customerController.getCustomerBy)
        this.router.delete('/deleteCustomerByRestaurant/:id', [checkJWT.checkJWT, checkRole(['M', 'A'])], customerController.deleteCustomerByRestaurant)
        this.router.get('/getAllCustomersByRestaurant', [checkJWT.checkJWT, checkRole(['M'])], customerController.getAllCustomersByRestaurant)
        this.router.get('/editCustomerByRestaurantPage/:id', [checkJWT.checkJWT, checkRole(['M'])], customerController.editCustomerByRestaurantPage)
        
        //Route edit customer
        this.router.patch('/editCustomerByRestaurant', [checkJWT.checkJWT, checkRole(['M', 'A'])], [
            //Inputs validations
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
                .trim()
        ],
            customerController.editCustomerByRestaurant)
    }
}

const customerRoutes = new CustomerRoutes()
export default customerRoutes.router