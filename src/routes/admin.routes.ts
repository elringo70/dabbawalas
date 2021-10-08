import { Router } from 'express'
import { adminController } from '../controllers/admin.controllers'
import { checkRole } from '../middlewares/roles'
import checkJWT from '../middlewares/jwt'

class AdminRoutes {
    public router: Router

    constructor() {
        this.router = Router()
        this.config()
    }

    private config() {
        this.router.get('/getAdminDashboardPage', [checkJWT.checkJWT, checkRole(['A'])], adminController.getAdminDashboardPage)
        this.router.get('/adminCharts', [checkJWT.checkJWT, checkRole(['A'])], adminController.adminCharts)
        this.router.post('/postLoadRestaurantData', [checkJWT.checkJWT, checkRole(['A'])], adminController.postLoadRestaurantData)
        this.router.get('/getAllManagersPage', [checkJWT.checkJWT, checkRole(['A'])], adminController.getAllManagersPage)
        this.router.get('/getAllManagers', [checkJWT.checkJWT, checkRole(['A'])], adminController.getAllManagers)
        this.router.get('/getManagerPageInfoPage/:id', [checkJWT.checkJWT, checkRole(['A'])], adminController.getManagerPageInfoPage)
        this.router.patch('/approveManager/:id', [checkJWT.checkJWT, checkRole(['A'])], adminController.approveManager)
    }
}

const adminRoutes = new AdminRoutes()
export default adminRoutes.router