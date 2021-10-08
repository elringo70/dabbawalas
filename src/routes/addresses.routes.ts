import { Router } from 'express'
import { addressesController } from '../controllers/addresses.controllers'

class AddressesRoutes {
    public router: Router

    constructor() {
        this.router = Router()
        this.config()
    }

    private config() {
        this.router.get('/getAllStates', addressesController.getAllStates)
        this.router.get('/getAllCitiesFromState/:state', addressesController.getAllCitiesFromState)
        this.router.get('/getAllMunicipalitiesFromCity/:municipality', addressesController.getAllMunicipalitiesFromCity)
    }
}

const addressesRoutes = new AddressesRoutes()
export default addressesRoutes.router