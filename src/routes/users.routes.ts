import { Router } from 'express'
import { userControllers } from '../controllers/users.controllers'
import { checkRole } from '../middlewares/roles'
import checkJWT from '../middlewares/jwt'

class UsersRoutes {
    public router: Router

    constructor() {
        this.router = Router()
        this.config()
    }

    private config() {
        this.router.get('/getUserByEmail/:email', [checkJWT.checkJWT, checkRole(['A', 'M'])], userControllers.getUserByEmail)
    }
}

const usersRoutes = new UsersRoutes()
export default usersRoutes.router