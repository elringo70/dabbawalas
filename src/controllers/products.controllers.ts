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
            manager: true,
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
                manager: true,
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
        const error = errors.array()
        const body = req.body
        const user = res.locals.token

        try {
            const image = req.file?.filename

            const productObj: IProduct = {
                name: body.name.toUpperCase(),
                cost: body.cost,
                price: body.price,
                image: 'uploads/' + image,
                description: body.description.toUpperCase(),
                cookingTime: body.cookingtime,
                active: 1,
                id_restaurant: user.id_restaurant
            }

            if (image === undefined) {
                error.push({
                    value: '',
                    msg: 'No ingreso ninguna archivo de imagen',
                    param: 'name',
                    location: 'body'
                })

                return res.status(422).render('products/newProduct', {
                    user,
                    title: 'Agregar nuevo platillo',
                    product: productObj,
                    active: true,
                    manager: true,
                    loggedIn: true,
                    error: error[0]
                })
            }

            if (!errors.isEmpty()) {
                return res.status(422).render('products/newProduct', {
                    user,
                    title: 'Agregar nuevo platillo',
                    product: productObj,
                    active: true,
                    manager: true,
                    loggedIn: true,
                    error: error[0]
                })
            }

            const product = new Product()
            await product.save(productObj)

            res.status(201).render('products/newProduct', {
                user,
                title: 'Agregar nuevo platillo',
                active: true,
                manager: true,
                loggedIn: true,
                message: 'Producto agregado'
            })
        } catch (error) {
            if (error) console.log(error)

            res.render('products/newProduct', {
                user,
                title: 'Agregar nuevo platillo',
                active: true,
                manager: true,
                loggedIn: true,
                errorMessage: 'Error al agregar el Platillo'
            })
        }
    }

    async getProductByIdByRestaurant(req: Request, res: Response) {
        const user = res.locals.token
        const id = req.body.id        

        try {
            const product = await Product.findById(id, user.id_restaurant)
            if (product) {
                return res.json({
                    status: 200,
                    product
                })
            }

            res.json({
                status: 304,
                message: 'Platillo no encontrado'
            })
        } catch (error) {
            if (error) console.log(error)

            res.json({
                errorMessage: 'Error al buscar al platillo'
            })
        }
    }

    async deleteProductByIdByRestaurant(req: Request, res: Response) {
        const user = res.locals.token
        const id = req.params.id

        try {
            const product = {
                id_product: id,
                id_restaurant: user.id_restaurant
            }

            await Product.deleteById(product)

            res.status(200).json({
                status: 200,
                message: 'Platillo borrado'
            })
        } catch (error) {
            if (error) console.log(error)

            res.json({
                errorMessage: 'Error al eliminar el platillo'
            })
        }
    }

    async getAllProductsByRestaurant(req: Request, res: Response) {
        const user = res.locals.token

        try {
            const products = await Product.fetchAllByRestaurant(user.id_restaurant)

            res.json(products)
        } catch (error) {
            if (error) console.log(error)

            res.json({
                errorMessage: 'Error al traer los platillos'
            })
        }
    }

    async editProductByIdPage(req: Request, res: Response) {
        const user = res.locals.token
        const id = req.params.id        

        try {
            const editProduct = await Product.findById(id, user.id_restaurant)

            res.status(200).render('products/edit-product', {
                title: 'Editar el platillo',
                user: res.locals.token,
                product: editProduct,
                active: true,
                manager: true,
                loggedIn: true
            })
        } catch (error) {
            if (error) console.log(error)

            res.render('products/edit-product', {
                title: 'Editar el platillo',
                user: res.locals.token,
                errorMessage: 'Error al cargar la página',
                active: true,
                manager: true,
                loggedIn: true
            })
        }
    }

    async editProductByIdByRestaurant(req: Request, res: Response) {
        const errors = validationResult(req)
        const error = errors.array()
        const body = req.body
        const user = res.locals.token
        const { id } = req.params

        try {
            if (!errors.isEmpty()) {
                return res.json({
                    status: 304,
                    message: error[0].msg
                })
            }

            const image = req.file?.filename

            const productObject: IProduct = {
                name: body.name.toUpperCase(),
                cost: body.cost,
                price: body.price,
                description: body.description.toUpperCase(),
                cookingTime: body.cookingtime,
                active: 1,
                id_restaurant: user.id_restaurant
            }
            
            if (image !== undefined) {
                productObject.image = 'uploads/' + image
            }
            
            const searchProduct = await Product.findById(id, user.id_restaurant)
            if (!searchProduct) {
                return res.json({
                    status: 200,
                    message: 'Error con el id del platillo'
                })
            }

            const product = new Product()
            await product.updateById(id, productObject)

            res.json({
                status: 200,
                message: 'Platillo editado con éxito'
            })
        } catch (error) {
            if (error) console.log(error)

            res.json({
                status: 304,
                message: 'Error al editar el platillo'
            })
        }
    }
}

export const productController = new ProductController()