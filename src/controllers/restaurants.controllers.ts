import { Request, Response } from 'express'
import Restaurant from '../models/restaurant'
import { IRestaurant, IBusinessHours } from '../interfaces/IRestaurant'
import { validationResult } from 'express-validator'
import { ICooker } from '../interfaces/IUsers'
import User from '../models/user'
import { genSaltSync, hashSync } from 'bcrypt'
import { IAddress } from '../interfaces/IAddresses'

class ResturantController {
    async getManagerPage(req: Request, res: Response) {
        const user = res.locals.token

        try {

            if (user.id_restaurant === null || user.id_restaurant === undefined) {
                return res.redirect('/api/restaurants/postNewRestaurant')
            }

            res.render('restaurants/manager', {
                title: 'Página de supervisor',
                user,
                active: true,
                manager: true,
                loggedIn: true
            })
        } catch (error) {
            if (error) console.log(error)

            res.json({
                message: 'Error al obtener la página del supervisor'
            })
        }
    }

    cookerRegistrationPage(req: Request, res: Response) {
        const user = res.locals.token

        res.render('restaurants/cookers-registration', {
            title: 'Alta de cocineros',
            user,
            active: true,
            manager: true,
            loggedIn: true
        })
    }

    async postCookerRegistration(req: Request, res: Response) {
        const errors = validationResult(req)
        const error = errors.array()
        const user = res.locals.token
        const body = req.body

        try {
            if (!errors.isEmpty()) {
                return res.render('restaurants/cookers-registration', {
                    title: 'Alta de cocineros',
                    user,
                    active: true,
                    loggedIn: true,
                    errorMessage: error[0].msg
                })
            }

            const salt = genSaltSync(10)
            const hashPass = hashSync(body.pass, salt)

            const cookerObject: ICooker = {
                name: body.name.toUpperCase(),
                lastname: body.lastname.toUpperCase(),
                maternalsurname: body.maternalsurname.toUpperCase(),
                email: body.email,
                pass: hashPass,
                usertype: 'CO',
                active: 1,
                id_restaurant: user.id_restaurant
            }

            const query = `
                SELECT email
                FROM users
                WHERE email='${body.email}'
            `

            const findUser = await User.findBy(query)

            if (findUser) {
                return res.render('restaurants/cookers-registration', {
                    title: 'Alta de cocineros',
                    errorMessage: 'El correo ya se encuentra registrado',
                    user,
                    active: true,
                    loggedIn: true
                })
            }

            const cooker = new User()
            await cooker.saveCooker(cookerObject)

            res.render('restaurants/cookers-registration', {
                title: 'Alta de cocineros',
                message: 'Cocinero registrado',
                user,
                active: true,
                manager: true,
                loggedIn: true
            })
        } catch (error) {
            if (error) console.log(error)

            res.render('restaurants/cookers-registration', {
                title: 'Alta de cocineros',
                errorMessage: 'Error al registrar al cociner',
                user,
                active: true,
                manager: true,
                loggedIn: true
            })
        }
    }

    async updateRestaurantPage(req: Request, res: Response) {
        const user = res.locals.token
        const { id } = req.params

        try {
            const restaurant = await Restaurant.findById(id)

            res.render('restaurants/edit-restaurant', {
                title: 'Edit restaurant',
                user,
                restaurant,
                active: true,
                admin: true,
                loggedIn: true
            })
        } catch (error) {
            res.render('restaurants/edit-restaurant', {
                title: 'Edit restaurant',
                active: true,
                admin: true,
                loggedIn: true,
                errorMessage: 'Error while loading edit restaurant page'
            })
        }
    }

    async updateRestaurant(req: Request, res: Response) {
        const errors = validationResult(req)
        const error = errors.array()
        const body = req.body

        const { days, openhours, closinghours } = req.body
        const { id } = req.params

        try {
            if (!errors.isEmpty()) {
                return res.json({
                    status: 304,
                    message: error[0].msg
                })
            }

            const restaurant = await Restaurant.findById(id)
            if(!restaurant) {
                return res.json({
                    status: 304,
                    message: 'No se encuentra el restaurant que esta enviando'
                })
            }

            const restaurantObject: IRestaurant = {
                id_restaurant: id,
                name: body.name.toUpperCase(),
                type: body.type.toUpperCase(),
                phone: body.phone,
                description: body.description.toUpperCase()
            }

            const addressObject: IAddress = {
                id_address: restaurant.id_restaurant,
                id_state: body.state,
                id_city: body.city,
                id_municipality: body.municipality,
                number: body.number.toUpperCase(),
                street: body.street.toUpperCase()
            }

            let schedule: IBusinessHours[] = []
            for (let i = 0; i < days.length; i++) {
                const businessHours: IBusinessHours = {
                    day: days[i],
                    openhours: openhours[i],
                    closinghours: closinghours[i]
                }
                schedule.push(businessHours)
            }

            const query = `
                SELECT *
                FROM business_hours
                WHERE id_restaurant=${id}
                ORDER BY
                    day ASC
            `

            //Search for actual schedule from restaurant
            const business_hours: any = await Restaurant.findOne(query)

            //Compare if actual schedule is different from posting one
            const differentSchedule = compareObjects(business_hours, schedule)

            if (!differentSchedule) {
                //If false, program will delete actual schedule and insert a new one

                const query = `
                    DELETE FROM business_hours WHERE id_restaurant=${id}
                `
                //Delete actual schedule
                await Restaurant.findOne(query)

                const updatedRestaurant = new Restaurant()
                await updatedRestaurant.updateById(restaurantObject, addressObject, schedule)
            } else {
                //If schedule is the same, will continue program in else condition
                const updatedRestaurant = new Restaurant()
                await updatedRestaurant.updateById(restaurantObject, addressObject)
            }

            res.json({
                status: 200,
                message: 'Restaurante actualizado'
            })
        } catch (error) {
            if (error) console.log(error)

            res.json({
                status: 304,
                message: 'Error al actualizar el restaurante'
            })
        }
    }

    async getBusinessHours(req: Request, res: Response) {
        const user = res.locals.token
        const { id } = req.params

        try {
            const query = `
                SELECT *
                FROM business_hours
                WHERE id_restaurant=${id}
                ORDER BY
                    day ASC
            `

            const business_hours: any = await Restaurant.findOne(query)

            res.status(200).json(business_hours)
        } catch (error) {
            if (error) console.log(error)

            res.json({
                errorMessage: 'Error while pulling business hours'
            })
        }
    }

    async getNewRestaurantPage(req: Request, res: Response) {
        const user = res.locals.token

        try {

            if (user.id_restaurant) {
                return res.redirect('/api/restaurants/manager')
            }

            res.render('restaurants/newRestaurant', {
                title: 'Registro de un nuevo restaurant',
                active: true,
                manager: true,
                loggedIn: true
            })
        } catch (error) {
            if (error) console.log(error)

            res.json({
                errorMessage: 'Error al obtener la página'
            })
        }
    }

    getAllRestaurantsPage(req: Request, res: Response) {
        const user = res.locals.token

        res.status(200).render('restaurants/restaurants', {
            title: 'All restaurants',
            user,
            active: true,
            admin: true,
            loggedIn: true
        })
    }

    async getAllRestaurants(req: Request, res: Response) {
        const user = res.locals.token

        try {
            const query = `
                SELECT restaurants.*, manager_restaurant.id_user
                FROM restaurants
                JOIN manager_restaurant
                ON restaurants.id_restaurant = manager_restaurant.id_restaurant
            `

            const restaurants = await Restaurant.fetchAll(query)

            console.log(restaurants)

            res.status(200).json(restaurants)
        } catch (error) {
            if (error) console.log(error)

            res.json({
                errorMessage: 'Error while loading restaurants'
            })
        }
    }

    async postNewRestaurant(req: Request, res: Response) {
        const errors = validationResult(req)
        const error = errors.array()
        const body = req.body
        const user = res.locals.token

        try {
            if (!errors.isEmpty()) {
                return res.json({
                    status: 304,
                    message: error[0].msg
                })
            }

            const restaurantObject: IRestaurant = {
                name: body.name.toUpperCase(),
                type: body.type.toUpperCase(),
                phone: body.phone,
                description: body.description.toUpperCase()
            }

            const restaurantAddress: IAddress = {
                id_state: body.state,
                id_city: body.city,
                id_municipality: body.municipality,
                number: body.number.toUpperCase(),
                street: body.street.toUpperCase()
            }

            const { days, openhours, closinghours } = req.body

            let hours: IBusinessHours[] = []
            for (let i = 0; i < days.length; i++) {
                const hour: IBusinessHours = {
                    day: days[i],
                    openhours: openhours[i],
                    closinghours: closinghours[i]
                }
                hours.push(hour)
            }

            const restaurant = new Restaurant()
            await restaurant.save(
                user.user,
                restaurantObject,
                restaurantAddress,
                hours
            )

            res.json({
                status: 201,
                message: 'Restaurant creado correctamente'
            })
        } catch (error) {
            if (error) console.log(error)

            res.json({
                status: 304,
                message: 'Error al registrar el nuevo restaurant'
            })
        }
    }

    async getRestaurantById(req: Request, res: Response) {
        try {
            const { id } = req.params

            const restaurant = await Restaurant.findById(id)

            if (!restaurant) {
                return res.status(404).json({
                    message: 'Restaurant no encontrado'
                })
            }

            res.status(200).json(restaurant)
        } catch (error) {
            if (error) console.log(error)

            res.json({
                errorMessage: 'Error al obtener el restaurant'
            })
        }
    }

    async deleteRestaurantById(req: Request, res: Response) {
        const { id } = req.params

        try {
            const query = `
                DELETE
                FROM restaurants
                WHERE id_restaurant=${id}
            `
            const restaurant = await Restaurant.deleteById(query)

            if (!restaurant) {
                return res.status(404).json({
                    message: 'Error while deleting restaurant'
                })
            }

            await Restaurant.deleteById(id)
            res.status(200).json({
                message: 'Restaurant deleted'
            })
        } catch (error) {
            if (error) console.log(error)

            res.json({
                errorMessage: 'Error al borrar el restaurant'
            })
        }
    }
}


export const restaurantController = new ResturantController()


//Compare two IBusinessHours objects arrays and know if actual schedule is the same
//from database and updated information from form
function compareObjects(actualSchedule: IBusinessHours[], newSchedule: any) {
    let different = true

    if (actualSchedule.length !== newSchedule.length) {
        return different = false
    }

    //Sort by day
    actualSchedule.sort((a, b) => (a.day > b.day) ? 1 : -1)
    newSchedule.sort((a: any, b: any) => (a.days > b.days) ? 1 : -1)

    for (let i = 0; i < actualSchedule.length; i++) {

        if (actualSchedule[i].day != newSchedule[i].days) {
            different = false
            break
        }

        if (actualSchedule[i].openhours != newSchedule[i].openhours) {
            different = false
            break
        }

        if (actualSchedule[i].closinghours != newSchedule[i].closinghours) {
            different = false
            break
        }

    }
    return different
}