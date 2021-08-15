import { Request, Response } from 'express'
import Product from '../models/product'
import { IProduct } from '../interfaces/IProduct'
import Restaurant from '../models/restaurant'
import { validationResult } from 'express-validator'

class ProductController {
    getNewProductPage(req: Request, res: Response) {
        res.render('products/newProduct', {
            title: 'Agregar nuevo platillo',
            user: res.locals.token,
            active: true,
            loggedIn: true
        })
    }

    async getAllProductsPage(req: Request, res: Response) {
        const user = res.locals.token

        try {
            const restaurant = await Restaurant.findWithUser(user.id_user)
            const products = await Product.fetchAllByRestaurant(restaurant?.id_restaurant)

            res.render('products/getAllProducts', {
                title: 'Todos los platillos',
                user: res.locals.token,
                products: products,
                active: true,
                loggedIn: true
            })
        } catch (error) {
            if (error) console.log(error)

            res.json({
                errorMessage: 'Error al obtener los platillos'
            })
        }
    }

    async postNewProduct(req: Request, res: Response) {
        const errors = validationResult(req)
        const user = res.locals.token

        try {
            const restaurant = await Restaurant.findWithUser(user.id_user)
            const image = req.file?.filename

            const productObj: IProduct = {
                name: req.body.name,
                cost: req.body.cost,
                price: req.body.price,
                image: 'uploads/' + image,
                description: req.body.description,
                active: 1,
                id_restaurant: restaurant?.id_restaurant
            }

            if (!productObj.image) {
                return res.render('products/newProduct', {
                    title: 'Agregar nuevo platillo',
                    errorMessage: 'Asegurese de enviar una imagen o un formato valido',
                    product: productObj,
                    loggedIn: true
                })
            }

            if (!errors.array()) {
                return res.status(422).render('products/newProduct', {
                    title: 'Agregar nuevo platillo',
                    errors: errors.array(),
                    product: productObj,
                    loggedIn: true
                })
            }

            const product = new Product()
            await product.save(productObj)

            res.render('products/newProduct', {
                title: 'Agregar nuevo platillo',
                active: true,
                loggedIn: true
            })
        } catch (error) {
            if (error) console.log(error)

            res.json({
                errorMessage: 'Error al agregar el Platillo'
            })
        }
    }
}

export const productController = new ProductController()