import { Router } from 'express'

//Index controllers
import { indexControllers } from '../controllers/index.controllers'

class IndexRoutes {
    public router: Router
    constructor() {
        this.router = Router()
        this.config()
    }

    private config() {
        //Index Routes
        this.router.get('/', indexControllers.getIndexPage)
        this.router.get('/restaurantes', indexControllers.getRestaurantIndexPage)
        this.router.get('/restaurantes/registro', indexControllers.getRestaurantRegistration)
        this.router.get('/login', indexControllers.getLoginPage)
    }
}

const indexRoutes = new IndexRoutes()
export default indexRoutes.router