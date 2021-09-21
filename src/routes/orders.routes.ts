import { Router } from 'express'
import { ordersController } from '../controllers/orders.controllers'
import { check } from 'express-validator'
import checkJWT from '../middlewares/jwt'
import { checkRole } from '../middlewares/roles'

class OrderRoutes {
    public router: Router

    constructor() {
        this.router = Router()
        this.config()
    }

    private config() {
        this.router.get('/getNewOrderPage', [checkJWT.checkJWT, checkRole(['M'])], ordersController.getOrdersPage)

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
        ], [checkJWT.checkJWT, checkRole(['M'])], ordersController.postNewOrder)

        this.router.get('/getAllTodayOrders', [checkJWT.checkJWT, checkRole(['M', 'CO'])], ordersController.getAllTodayOrders)
        this.router.get('/getAllTodayOrdersPage', [checkJWT.checkJWT, checkRole(['M'])], ordersController.getAllTodayOrdersPage)
        this.router.post('/postCompleteOrder', [checkJWT.checkJWT, checkRole(['M', 'CO'])], ordersController.postCompleteOrder)
        this.router.delete('/cancelOrderById/:id', [checkJWT.checkJWT, checkRole(['M'])], ordersController.cancelOrderById)
        this.router.get('/loadDashboard', [checkJWT.checkJWT, checkRole(['M'])], ordersController.loadDashboard)
        this.router.get('/loadData7DayChart', [checkJWT.checkJWT, checkRole(['M'])], ordersController.loadData7DayChart)
        this.router.get('/monthDataSales', [checkJWT.checkJWT, checkRole(['M'])], ordersController.monthDataSales)
        this.router.get('/getCookerOrderDetailPage/:id', [checkJWT.checkJWT, checkRole(['CO'])], ordersController.getCookerOrderDetailPage)

        //Cooker routes
        this.router.get('/getAllTodayOrdersCookerPage', [checkJWT.checkJWT, checkRole(['CO'])], ordersController.getAllTodayOrdersCookerPage)
    }
}

const orderRoutes = new OrderRoutes()
export default orderRoutes.router