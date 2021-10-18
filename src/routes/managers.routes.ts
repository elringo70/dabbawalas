import { Router } from 'express'
import { managerControllers } from '../controllers/manager.controllers'
import { check } from 'express-validator'
import checkJWT from '../middlewares/jwt'
import { checkRole } from '../middlewares/roles'

class ManagerRoutes {
    public router: Router

    constructor() {
        this.router = Router()
        this.config()
    }

    private config() {
        //Post new manager validations
        this.router.post('/postNewManager', [
            check('name')
                .not().isEmpty().withMessage('Ingrese su nombre')
                .trim()
                .isLength({ min: 3 }).withMessage('El nombre debe de contener al menos 3 caracteres')
                .isAlpha('es-ES', { ignore: ' ' }).withMessage('Solo puede ingresar letras en el nombre'),
            check('lastname')
                .not().isEmpty().withMessage('Ingrese el apellido')
                .trim()
                .isLength({ min: 3 }).withMessage('El apellido debe de contener al menos 3 caracteres')
                .isAlpha('es-ES', { ignore: ' ' }).withMessage('Solo puede ingresar letras en el apellido'),
            check('maternalsurname')
                .not().isEmpty().withMessage('Ingrese su segundo apellido')
                .trim()
                .isLength({ min: 3 }).withMessage('El segundo apellido debe de contener al menos 3 caracteres')
                .isAlpha('es-ES', { ignore: ' ' }).withMessage('Solo puede ingresar letras en el segundo apellido'),
            check('dob')
                .not().isEmpty().withMessage('Ingrese la su fecha de nacimiento')
                .trim()
                .isDate().withMessage('Seleccione un formato valido de fecha'),
            check('number')
                .not().isEmpty().withMessage('Ingrese el numero de la dirección')
                .trim()
                .isNumeric().withMessage('Solo puede ingresar valores numéricos'),
            check('street')
                .not().isEmpty().withMessage('Ingrese el nombre de la calle')
                .trim(),
            check('municipality')
                .not().isEmpty().withMessage('Seleccione una colonia')
                .trim(),
            check('city')
                .not().isEmpty().withMessage('Seleccione una ciudad')
                .trim(),
            check('state')
                .not().isEmpty().withMessage('Seleccione un estado')
                .trim(),
            check('phone')
                .not().isEmpty().withMessage('Ingrese un número telefonico')
                .trim()
                .isNumeric().withMessage('Solo puede ingresar valores numéricos')
                .isMobilePhone(['es-MX']).withMessage('Ingrese un teléfono valido'),
            check('email')
                .not().isEmpty().withMessage('Ingrese un correo electrónico')
                .trim()
                .isEmail().withMessage('Ingrese un email con formato valido'),
            check('pass')
                .not().isEmpty().withMessage('Ingrese una contraseña')
                .trim()
                .isStrongPassword({ minLength: 6, minUppercase: 1, minSymbols: 1 }).withMessage('Ingrese la contraseña como se le indica')
        ], managerControllers.postNewManager)

        this.router.get('/getManagerByEmail/:email', managerControllers.getManagerByEmail)
        this.router.get('/editManagerPage/:id', [checkJWT.checkJWT, checkRole(['M'])], managerControllers.editManagerPage)

        //Edit validations
        this.router.patch('/editManager/:id', [checkJWT.checkJWT, checkRole(['M'])], [
            check('name')
                .not().isEmpty().withMessage('Ingrese su nombre')
                .trim()
                .isLength({ min: 3 }).withMessage('El nombre debe de contener al menos 3 caracteres')
                .isAlpha('es-ES', { ignore: ' ' }).withMessage('Solo puede ingresar letras en el nombre'),
            check('lastname')
                .not().isEmpty().withMessage('Ingrese el apellido')
                .trim()
                .isLength({ min: 3 }).withMessage('El apellido debe de contener al menos 3 caracteres')
                .isAlpha('es-ES', { ignore: ' ' }).withMessage('Solo puede ingresar letras en el apellido'),
            check('maternalsurname')
                .not().isEmpty().withMessage('Ingrese su segundo apellido')
                .trim()
                .isLength({ min: 3 }).withMessage('El segundo apellido debe de contener al menos 3 caracteres')
                .isAlpha('es-ES', { ignore: ' ' }).withMessage('Solo puede ingresar letras en el segundo apellido'),
            check('dob')
                .not().isEmpty().withMessage('Ingrese la su fecha de nacimiento')
                .trim()
                .isDate().withMessage('Seleccione un formato valido de fecha'),
            check('number')
                .not().isEmpty().withMessage('Ingrese el numero de la dirección')
                .trim()
                .isNumeric().withMessage('Solo puede ingresar valores numéricos'),
            check('street')
                .not().isEmpty().withMessage('Ingrese el nombre de la calle')
                .trim(),
            check('municipality')
                .not().isEmpty().withMessage('Seleccione una colonia')
                .trim(),
            check('city')
                .not().isEmpty().withMessage('Seleccione una ciudad')
                .trim(),
            check('state')
                .not().isEmpty().withMessage('Seleccione un estado')
                .trim(),
            check('phone')
                .not().isEmpty().withMessage('Ingrese un número telefonico')
                .trim()
                .isNumeric().withMessage('Solo puede ingresar valores numéricos')
                .isMobilePhone(['es-MX']).withMessage('Ingrese un teléfono valido'),
        ], managerControllers.editManagerById)
        this.router.get('/getChartsPage', [checkJWT.checkJWT, checkRole(['M'])], managerControllers.getChartsPage)
        this.router.post('/chartDashboard', [checkJWT.checkJWT, checkRole(['M'])], managerControllers.chartDashboard)
        this.router.get('/getPersonnel', [checkJWT.checkJWT, checkRole(['M'])], managerControllers.getPersonnel)
        this.router.get('/getPersonnelPage', [checkJWT.checkJWT, checkRole(['M'])], managerControllers.getPersonnelPage)
        this.router.get('/getNewEmployeePage', [checkJWT.checkJWT, checkRole(['M'])], managerControllers.getNewEmployeePage)
        this.router.post('/postNewEmployee', [checkJWT.checkJWT, checkRole(['M'])], [
            check('name')
                .not().isEmpty().withMessage('Ingrese su nombre')
                .trim()
                .isLength({ min: 3 }).withMessage('El nombre debe de contener al menos 3 caracteres')
                .isAlpha('es-ES', { ignore: ' ' }).withMessage('Solo puede ingresar letras en el nombre'),
            check('lastname')
                .not().isEmpty().withMessage('Ingrese el apellido')
                .trim()
                .isLength({ min: 3 }).withMessage('El apellido debe de contener al menos 3 caracteres')
                .isAlpha('es-ES', { ignore: ' ' }).withMessage('Solo puede ingresar letras en el apellido'),
            check('maternalsurname')
                .not().isEmpty().withMessage('Ingrese su segundo apellido')
                .trim()
                .isLength({ min: 3 }).withMessage('El segundo apellido debe de contener al menos 3 caracteres')
                .isAlpha('es-ES', { ignore: ' ' }).withMessage('Solo puede ingresar letras en el segundo apellido'),
            check('dob')
                .not().isEmpty().withMessage('Ingrese la su fecha de nacimiento')
                .trim()
                .isDate().withMessage('Seleccione un formato valido de fecha'),
            check('number')
                .not().isEmpty().withMessage('Ingrese el numero de la dirección')
                .trim()
                .isNumeric().withMessage('Solo puede ingresar valores numéricos'),
            check('street')
                .not().isEmpty().withMessage('Ingrese el nombre de la calle')
                .trim(),
            check('municipality')
                .not().isEmpty().withMessage('Seleccione una colonia')
                .trim(),
            check('city')
                .not().isEmpty().withMessage('Seleccione una ciudad')
                .trim(),
            check('state')
                .not().isEmpty().withMessage('Seleccione un estado')
                .trim(),
            check('phone')
                .not().isEmpty().withMessage('Ingrese un número telefonico')
                .trim()
                .isNumeric().withMessage('Solo puede ingresar valores numéricos')
                .isMobilePhone(['es-MX']).withMessage('Ingrese un teléfono valido'),
            check('email')
                .not().isEmpty().withMessage('Debe enviar correo electrónico')
                .trim()
                .isEmail().withMessage('Envie un correo electrónico valido')
        ], managerControllers.postNewEmployee)
    }
}

const managerRoutes = new ManagerRoutes()
export default managerRoutes.router