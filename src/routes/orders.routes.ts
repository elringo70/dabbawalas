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
        this.router.get('/getNewOrderPage', [checkJWT.checkJWT, checkRole(['M', 'CA'])], ordersController.getNewOrdersPage)

        //Post new order
        this.router.post('/postNewOrder', [
            //New order validations
            check('phone')
                .trim()
                .isNumeric().withMessage('Solo puede ingresar valores numéricos')
                .isMobilePhone(['es-MX']).withMessage('Ingrese un teléfono valido'),
            check('product')
                .trim()
                .not().isEmpty().withMessage('Debe agregar platillos a la orden'),
            check('quantity')
                .trim()
                .not().isEmpty().withMessage('Debe agregar la cantidad por platillo'),
        ], [checkJWT.checkJWT, checkRole(['M', 'CA'])], ordersController.postNewOrder)

        this.router.get('/getAllTodayOrders', [checkJWT.checkJWT, checkRole(['M', 'CO', 'CA'])], ordersController.getAllTodayOrders)
        this.router.get('/getAllTodayOrdersPage', [checkJWT.checkJWT, checkRole(['M', 'CA'])], ordersController.getAllTodayOrdersPage)
        this.router.post('/postCompleteOrder', [checkJWT.checkJWT, checkRole(['M', 'CO'])], ordersController.postCompleteOrder)
        this.router.delete('/cancelOrderById/:id', [checkJWT.checkJWT, checkRole(['M', 'A'])], ordersController.cancelOrderById)
        this.router.get('/loadDashboard', [checkJWT.checkJWT, checkRole(['M'])], ordersController.loadDashboard)
        this.router.get('/loadData7DayChart', [checkJWT.checkJWT, checkRole(['M'])], ordersController.loadData7DayChart)
        this.router.get('/monthDataSales', [checkJWT.checkJWT, checkRole(['M'])], ordersController.monthDataSales)
        this.router.get('/getCookerOrderDetailPage/:id', [checkJWT.checkJWT, checkRole(['CO', 'M', 'A'])], ordersController.getCookerOrderDetailPage)
        this.router.get('/getAllRestaurantsOrdersPage', [checkJWT.checkJWT, checkRole(['A'])], ordersController.getAllRestaurantsOrdersPage)
        this.router.get('/getAllRestaurantsOrders', [checkJWT.checkJWT, checkRole(['A'])], ordersController.getAllRestaurantsOrders)
        

        //Cooker routes
        this.router.get('/getAllTodayOrdersCookerPage', [checkJWT.checkJWT, checkRole(['CO'])], ordersController.getAllTodayOrdersCookerPage)
    }
}

const orderRoutes = new OrderRoutes()
export default orderRoutes.router