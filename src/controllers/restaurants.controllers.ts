import { Request, Response } from 'express'
import Restaurant from '../models/restaurant'
import { IRestaurant, IBusinessHours } from '../interfaces/IRestaurant'
import { validationResult } from 'express-validator'
import { ICooker } from '../interfaces/IUsers'
import User from '../models/user'
import { genSaltSync, hashSync } from 'bcrypt'

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
                errorMessage: 'Error al obtener la página del supervisor'
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
        const user = res.locals.token

        try {
            const cookerObj: ICooker = req.body
            cookerObj.usertype = 'CO'
            cookerObj.active = 1
            cookerObj.id_restaurant = user.id_restaurant

            const salt = genSaltSync(10)
            const hashPass = hashSync(`${cookerObj.pass}`, salt)
            cookerObj.pass = hashPass

            const findUser = await User.findBy('email', `${cookerObj.email}`)

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
            await cooker.save(cookerObj)

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

        const restaurantObj: IRestaurant = {
            name: req.body.name,
            type: req.body.type,
            street: req.body.street,
            number: req.body.number,
            municipality: req.body.municipality,
            city: req.body.city,
            state: req.body.state,
            phone: req.body.phone
        }

        const { days, openhours, closinghours } = req.body
        const { id } = req.params
        const user = res.locals.token

        if (!errors.isEmpty()) {
            return res.status(200).render('restaurants/edit-restaurant', {
                title: 'Edit restaurant',
                user,
                active: true,
                admin: true,
                loggedIn: true,
                errors: errors.array()
            })
        }

        let hours: any = []

        for (let i = 0; i < days.length; i++) {
            hours.push({
                days: days[i],
                openhours: openhours[i],
                closinghours: closinghours[i]
            })
        }

        try {
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
            const differentSchedule = compareObjects(business_hours, hours)
            
            console.log('compareObjects', differentSchedule)
            
            if (!differentSchedule) {
                //If false, program will delete actual schedule and insert a new one

                const query = `
                    DELETE FROM business_hours WHERE id_restaurant=${id}
                `
                //Delete actual schedule
                //await Restaurant.findOne(query)

                //const updatedRestaurant = new Restaurant()
                //await updatedRestaurant.updateById(restaurantObj, id, hours)
            } else {
                //If schedule is the same, with continue program in else condition
                const updatedRestaurant = new Restaurant()
                await updatedRestaurant.updateById(restaurantObj, id)
            }

            res.status(200).render('admin/managers', {
                title: 'Edit restaurant',
                user,
                active: true,
                admin: true,
                loggedIn: true,
                message: 'Restaurant updated'
            })
        } catch (error) {
            res.render('restaurants/edit-restaurant', {
                title: 'Edit restaurant',
                active: true,
                admin: true,
                loggedIn: true,
                errorMessage: 'Error while loading editing restaurant'
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

    async postNewRestaurant(req: Request, res: Response) {
        const errors = validationResult(req)

        const restaurantObj: IRestaurant = {
            name: req.body.name,
            type: req.body.type,
            street: req.body.street,
            number: req.body.number,
            municipality: req.body.municipality,
            city: req.body.city,
            state: req.body.state,
            phone: req.body.phone
        }

        const { days, openhours, closinghours } = req.body
        const user = res.locals.token

        if (!errors.isEmpty()) {
            return res.status(200).render('restaurants/newRestaurant', {
                title: 'Edit restaurant',
                active: true,
                manager: true,
                loggedIn: true,
                errors: errors.array()
            })
        }

        let hours = []

        for (let i = 0; i < days.length; i++) {
            hours.push({
                days: days[i],
                openhours: openhours[i],
                closinghours: closinghours[i]
            })
        }

        try {
            const restaurant = new Restaurant()
            await restaurant.save(restaurantObj, user, hours)

            res.redirect('/api/restaurants/manager')
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


//Compare two IBusinessHours objects arrays and know if actual schedule is the same
//from database and updated information from form
function compareObjects(actualSchedule: IBusinessHours[], newSchedule: any) {

    if (actualSchedule.length !== newSchedule.length) {
        return false
    }
    
    //Sort by day
    actualSchedule.sort((a, b) => (a.day > b.day) ? 1 : -1)
    newSchedule.sort((a: any, b: any) => (a.days > b.days) ? 1 : -1)

    for (let i = 0; i < actualSchedule.length; i++) {
        console.log('actualSchedule', actualSchedule[i].day)
        console.log('newSchedule', newSchedule[i].days)
        console.log('actualSchedule[i].day != newSchedule[i].days', actualSchedule[i].day != newSchedule[i].days)
        if (actualSchedule[i].day != newSchedule[i].days) return false
        
        if (actualSchedule[i].openhours != newSchedule[i].openhours) return false

        if (actualSchedule[i].closinghours != newSchedule[i].closinghours) return false

    }

    return true
}