import { Request, Response } from 'express'
import Restaurant from '../models/restaurant'
import { IRestaurant, IBusinessHours } from '../interfaces/IRestaurant'
import { validationResult } from 'express-validator'

class ResturantController {
    async getManagerPage(req: Request, res: Response) {
        const user = res.locals.token

        try {
            const restaurant = await Restaurant.findWithUser(user.id_user)

            if (!restaurant) {
                return res.redirect('/api/restaurants/postNewRestaurant')
            }

            res.render('restaurants/manager', {
                title: 'Página de supervisor',
                user: res.locals.token,
                active: true,
                loggedIn: true
            })
        } catch (error) {
            if (error) console.log(error)

            res.json({
                errorMessage: 'Error al obtener la página del supervisor'
            })
        }
    }

    async getNewRestaurantPage(req: Request, res: Response) {
        const user = res.locals.token

        try {
            const restaurant = await Restaurant.findWithUser(user.id_user)

            if (restaurant) {
                return res.redirect('/api/restaurants/manager')
            }

            res.render('restaurants/newRestaurant', {
                title: 'Registro de un nuevo restaurant',
                active: true,
                loggedIn: true
            })
        } catch (error) {
            if (error) console.log(error)

            res.json({
                errorMessage: 'Error al obtener la página'
            })
        }
    }

    async postNewRestaurant(req: Request, res: Response) {
        const restaurantObj: IRestaurant = {
            name: req.body.name,
            type: req.body.type,
            street: req.body.street,
            number: req.body.number,
            municipality: req.body.municipality,
            city: req.body.city,
            state: req.body.state
        }

        const hours: IBusinessHours[] = req.body.hours
        const user = res.locals.token

        try {
            const restaurant = new Restaurant()
            await restaurant.save(restaurantObj, user.user, hours)

            res.json({
                status: 200,
                message: 'Restaurant registrado con éxito'
            })
        } catch (error) {
            if (error) console.log(error)

            res.json({
                status: 304,
                errorMessage: 'Error al registrar el nuevo restaurant'
            })
        }
    }

    async getAllRestaurants(req: Request, res: Response) {
        try {
            const restaurants = await Restaurant.fetchAll()

            res.status(200).json(restaurants)
        } catch (error) {
            if (error) console.log(error)

            res.json({
                errorMessage: 'Error al obtener los restaurants'
            })
        }
    }

    async getRestaurantById(req: Request, res: Response) {
        try {
            const { id } = req.params

            const restaurant: any = await Restaurant.findById(id)

            if (restaurant.length === 0) {
                return res.status(404).json({
                    message: 'Restaurant no encontrado'
                })
            }

            res.status(200).json(restaurant[0])
        } catch (error) {
            if (error) console.log(error)

            res.json({
                errorMessage: 'Error al obtener el restaurant'
            })
        }
    }

    /* async updateRestaurantById(req: Request, res: Response) {
        const {
            name,
            restaurantType,
            street,
            number,
            municipality,
            city,
            state,
            phone,
            businessHours
        } = req.body

        const resturant = new Restaurant(
            name.toUpperCase(),
            restaurantType,
            street.toUpperCase(),
            number,
            municipality.toUpperCase(),
            city.toUpperCase(),
            state.toUpperCase(),
            phone,
            businessHours
        )

        try {
            const { id } = req.params

            const restaurant: any = await Restaurant.findById(id)

            if (restaurant.length === 0) {
                return res.status(404).json({
                    message: 'Restaurant no encontrado'
                })
            }

            await resturant.updateById(id)

            res.status(200).json({
                message: 'Restaurant actualizado'
            })
        } catch (error) {
            if (error) console.log(error)

            res.json({
                errorMessage: 'Error al actualizar el restaurant'
            })
        }
    } */

    async deleteRestaurantById(req: Request, res: Response) {
        try {
            const { id } = req.params

            const restaurant: any = await Restaurant.findById(id)

            if (restaurant.length === 0) {
                return res.status(404).json({
                    message: 'Restaurant no encontrado'
                })
            }

            await Restaurant.deleteById(id)

            res.status(200).json('Restaurant borrado')
        } catch (error) {
            if (error) console.log(error)

            res.json({
                errorMessage: 'Error al borrar el restaurant'
            })
        }
    }
}

export const restaurantController = new ResturantController()