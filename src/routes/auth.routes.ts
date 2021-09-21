import { Router } from 'express'
import { authController } from '../controllers/auth.controllers'
import { check } from 'express-validator'
import { checkRole } from '../middlewares/roles'
import checkJWT from '../middlewares/jwt'

class AuthRoutes {
    public router: Router

    constructor() {
        this.router = Router()
        this.config()
    }

    private config() {
        this.router.post('/login', [
            check('email')
                .isEmail().withMessage('Ingrese un correo electrónico valido'),
            check('pass')
                .not().isEmpty().withMessage('Ingrese la contraseña')
        ], authController.postLoginUser)
        
        this.router.get('/logout', [checkJWT.checkJWT, checkRole(['M', 'D', 'CO', 'A'])], authController.getLogoutUser)
    }
}

const authRoutes = new AuthRoutes()
export default authRoutes.router