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
        const errors: any = validationResult(req)

        const body = req.body
        res.json({
            body
        })

        /* try {
            const restaurant = await Restaurant.findWithUser(user.id_user)
            const image: any = req.files?.image

            const productObj: IProduct = {
                name: req.body.name,
                cost: req.body.cost,
                price: req.body.price,
                image: image.data,
                description: req.body.description,
                active: 1,
                id_restaurant: restaurant?.id_restaurant
            }

            if (!errors.array()) {
                return res.render('products/newProduct', {
                    title: 'Agregar nuevo platillo',
                    errors: errors.array(),
                    product: productObj,
                    loggedIn: true
                })
            }

            const product = new Product()
            await product.save(productObj)

            res.status(201).json({
                status: 201,
                message: 'Producto agregado con éxito'
            })
        } catch (error) {
            if (error) console.log(error)

            res.json({
                errorMessage: 'Error al agregar el Platillo'
            })
        } */
    }

    /* async getAllProducts(req: Request, res: Response) {
        const user = res.locals.token

        try {
            const restaurant = await Restaurant.findWithUser(user.id_user)
            const products = await Product.fetchAllByRestaurant(restaurant?.id_restaurant)

            
        } catch (error) {
            if (error) console.log(error)

            res.json({
                errorMessage: 'Error al obtener los platillos'
            })
        }
    } */

    /* async getProductById(req: Request, res: Response) {
        const { id } = req.params

        try {
            const product: any = await Product.findOne(id)

            if (product.length === 0) {
                return res.status(404).json({
                    message: 'Platillo no encontrado'
                })
            }

            res.status(200).json(product[0])
        } catch (error) {
            if (error) console.log(error)

            res.json({
                errorMessage: 'Error al obtener el Platillo'
            })
        }
    } */

    /* async updateProductById(req: Request, res: Response) {
        const { id } = req.params

        const queryObj = {
            name: req.body.name,
            cost: req.body.cost,
            price: req.body.price,
            image: req.file.path,
            description: req.body.description
        }

        const product: any = await Product.findOne(id)

        if (product.length === 0) {
            return res.status(404).json({
                message: 'Platillo no encontrado'
            })
        }

        const updateProduct = new Product(
            queryObj.name.toUpperCase(),
            queryObj.cost,
            queryObj.price,
            queryObj.image,
            queryObj.description.toUpperCase(),
            1,
            product.id_restaurant
        )

        try {
            await updateProduct.updateById(id)

            let resultHandler = function (err: any) {
                if (err) {
                    console.log("unlink failed", err);
                }
            }

            fs.unlink(req.file.path, resultHandler);

            res.status(200).json({
                message: 'Platillo actualizado'
            })
        } catch (error) {
            if (error) console.log(error)

            res.json({
                errorMessage: 'Error al actualizar el Platillo'
            })
        }
    } */

    /* async deleteProductById(req: Request, res: Response) {
        const { id } = req.params

        try {
            const product: any = await Product.findOne(id)

            if (product.length === 0) {
                return res.status(404).json({
                    message: 'Platillo no encontrado'
                })
            }

            await Product.deleteById(id)

            res.status(200).json({
                message: 'Platillo eliminado'
            })
        } catch (error) {
            if (error) console.log(error)

            res.json({
                errorMessage: 'Error al eliminar el Platillo'
            })
        }
    } */
}

export const productController = new ProductController()