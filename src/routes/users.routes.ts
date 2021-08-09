import { Router } from 'express'
import { userControllers } from '../controllers/users.controllers'
import { check } from 'express-validator'

class UsersRoutes {
    public router: Router

    constructor() {
        this.router = Router()
        this.config()
    }

    private config() {
        //Manager Routes
        this.router.post('/manager/postNewManager',
            [
                check('name')
                    .not().isEmpty().withMessage('No ingreso ningun valor')
                    .trim()
                    .isLength({ min: 3 }).withMessage('El nombre debe de contener al menos 3 caracteres')
                    .isAlpha('es-ES', {ignore: ' '}).withMessage('Solo puede ingresar letras en el nombre'),
                check('lastname')
                    .not().isEmpty().withMessage('No ingreso ningun valor')
                    .trim()
                    .isLength({ min: 3 }).withMessage('El apellido debe de contener al menos 3 caracteres')
                    .isAlpha('es-ES', {ignore: ' '}).withMessage('Solo puede ingresar letras en el apellido'),
                check('maternalsurname')
                    .not().isEmpty().withMessage('No ingreso ningun valor')
                    .trim()
                    .isLength({ min: 3 }).withMessage('El segundo apellido debe de contener al menos 3 caracteres')
                    .isAlpha('es-ES', {ignore: ' '}).withMessage('Solo puede ingresar letras en el segundo apellido'),
                check('dob')
                    .not().isEmpty()
                    .trim()
                    .isDate().withMessage('Seleccione un formato valido de fecha'),
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
                check('phone')
                    .trim()
                    .isNumeric().withMessage('Solo puede ingresar valores numéricos')
                    .isMobilePhone(['es-MX']).withMessage('Ingrese un teléfono valido'),
                check('email')
                    .trim()
                    .isEmail().withMessage('Ingrese un email con formato valido'),
                check('pass')
                    .not().isEmpty().withMessage('No ingreso ningun valor')
                    .trim()
                    .isStrongPassword({ minLength: 6, minUppercase: 1, minSymbols: 1 })
            ], userControllers.postNewManager)

        this.router.post('/manager/searchByEmail', userControllers.getManagerExistsByEmail)
    }
}

const usersRoutes = new UsersRoutes()
export default usersRoutes.router