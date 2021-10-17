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
        
        this.router.get('/logout', [checkJWT.checkJWT, checkRole(['M', 'D', 'CO', 'A', 'CA'])], authController.getLogoutUser)
        this.router.get('/getNotPermissionsPage', [checkJWT.checkJWT, checkRole(['M', 'D', 'CO', 'A', 'CA'])], authController.getNotPermissionsPage)
        this.router.get('/resetPasswordPage', [checkJWT.checkJWT, checkRole(['M', 'D', 'CO', 'A', 'CA'])], authController.resetPasswordPage)
        this.router.post('/resetPassword', [checkJWT.checkJWT, checkRole(['M', 'D', 'CO', 'A', 'CA'])], authController.resetPassword)
        this.router.post('/forgotPassword', [
            check('email')
                .trim()
                .isEmail().withMessage('Ingrese un correo electrónico valido'),
        ],authController.forgotPassword)
        this.router.post('/confirmCaptcha', authController.confirmCaptcha)
        this.router.get('/confirmEmailPage/:token', authController.confirmEmailPage)
    }
}

const authRoutes = new AuthRoutes()
export default authRoutes.router