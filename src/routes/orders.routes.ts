import { Router } from 'express'
import { ordersController } from '../controllers/orders.controllers'
import { check } from 'express-validator'
import checkJWT from '../middlewares/jwt'

class OrderRoutes {
    public router: Router

    constructor() {
        this.router = Router()
        this.config()
    }

    private config() {
        this.router.get('/getNewOrderPage', checkJWT.checkJWT, ordersController.getOrdersPage)

        //Post new order
        this.router.post('/postNewOrder', [
            //New order validations
            check('product')
                .not().isEmpty().withMessage('Debe agregar platillos a la orden'),
            check('quantity')
                .not().isEmpty().withMessage('Debe agregar la cantidad por platillo'),
            check('price')
                .not().isEmpty().withMessage('Debe enviar el precio de los platillos'),
            check('id_user')
                .not().isEmpty().withMessage('Debe enviar el cliente de la orden'),
        ], checkJWT.checkJWT, ordersController.postNewOrder)

        this.router.get('/getAllTodayOrders', checkJWT.checkJWT, ordersController.getAllTodayOrders)
        this.router.get('/getAllTodayOrdersPage', checkJWT.checkJWT, ordersController.getAllTodayOrdersPage)
        this.router.post('/postCompleteOrder', checkJWT.checkJWT, ordersController.postCompleteOrder)
        this.router.delete('/cancelOrderById/:id', checkJWT.checkJWT, ordersController.cancelOrderById)
        this.router.get('/loadDashboard', checkJWT.checkJWT, ordersController.loadDashboard)
    }
}

const orderRoutes = new OrderRoutes()
export default orderRoutes.router