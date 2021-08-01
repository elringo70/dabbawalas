import { Router } from 'express'
import { restaurantController } from '../controllers/restaurants.controllers'
import checkJWT from '../middlewares/jwt'

class RestaurantRoutes {
    public router: Router

    constructor() {
        this.router = Router()
        this.config()
    }

    private config() {
        this.router.get('/postNewRestaurant', checkJWT.checkJWT, restaurantController.getNewRestaurantPage)

        this.router.post('/postNewRestaurant', checkJWT.checkJWT, restaurantController.postNewRestaurant)
        this.router.get('/', checkJWT.checkJWT, restaurantController.getAllRestaurants)
        this.router.get('/manager', checkJWT.checkJWT, restaurantController.getManagerPage)
        this.router.get('/:id', checkJWT.checkJWT, restaurantController.getRestaurantById)
        //this.router.patch('/:id', checkJWT.checkJWT, restaurantController.updateRestaurantById)
        this.router.delete('/:id', checkJWT.checkJWT, restaurantController.deleteRestaurantById)
    }
}

const restaurantRoutes = new RestaurantRoutes()
export default restaurantRoutes.router