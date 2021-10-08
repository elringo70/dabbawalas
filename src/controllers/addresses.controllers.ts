import { Request, Response } from 'express'
import Addresses from '../models/addresses'
import { IStates, ICities, IMunicipalities } from '../interfaces/IAddresses'

class AddressesController {
    async getAllStates(req: Request, res: Response) {
        const user = res.locals.token

        try {
            const query = `
                SELECT *
                FROM estados
                ORDER BY nombre ASC
            `
            const states: IStates | unknown = await Addresses.fetchAll(query)

            res.status(200).json(states)
        } catch (error) {
            if (error) console.log(error)

            res.json({
                status: 304,
                errorMessage: 'Error al traer los estados'
            })
        }
    }

    async getAllCitiesFromState(req: Request, res: Response) {
        const user = res.locals.token
        const { state } = req.params

        try {
            const query = `
                SELECT *
                FROM municipios
                WHERE estado=${state}
                ORDER BY nombre ASC
            `
            const states: ICities | unknown = await Addresses.fetchAll(query)

            res.status(200).json(states)
        } catch (error) {
            if (error) console.log(error)

            res.json({
                status: 304,
                errorMessage: 'Error al traer los estados'
            })
        }
    }

    async getAllMunicipalitiesFromCity(req: Request, res: Response) {
        const user = res.locals.token
        const { municipality } = req.params

        try {
            const query = `
                SELECT *
                FROM colonias
                WHERE municipio=${municipality}
                ORDER BY nombre ASC
            `
            const states: IMunicipalities | unknown = await Addresses.fetchAll(query)

            res.status(200).json(states)
        } catch (error) {
            if (error) console.log(error)

            res.json({
                status: 304,
                errorMessage: 'Error al traer las colonias'
            })
        }
    }
}

export const addressesController = new AddressesController()