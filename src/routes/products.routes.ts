import { Router } from 'express'
import { productController } from '../controllers/products.controllers'
import checkJWT from '../middlewares/jwt'
import { check } from 'express-validator'
import { upload } from '../middlewares/upload'
import { checkRole } from '../middlewares/roles'

class ProductRoutes {
    public router: Router

    constructor() {
        this.router = Router()
        this.config()
    }

    private config() {
        this.router.get('/getNewProductPage', [checkJWT.checkJWT, checkRole(['M'])], productController.getNewProductPage)

        //Post new product 
        this.router.post('/postNewProduct', [checkJWT.checkJWT, checkRole(['M'])], upload.single('image'), [

            //Validations
            check('name')
                .not().isEmpty().withMessage('Ingrese el nombre del producto')
                .trim()
                .isLength({ min: 0, max: 20 }),
            check('cost')
                .not().isEmpty().withMessage('Ingrese el costo del producto')
                .isFloat({ min: 0, max: 499 }).withMessage('Ingrese solo numeros y el valor no puede exceder de $500'),
            check('price')
                .not().isEmpty().withMessage('Ingrese el precio de venta del producto')
                .isFloat({ min: 0, max: 499 }).withMessage('Ingrese solo numeros y el valor no puede exceder de $500'),
            check('cookingtime')
                .not().isEmpty().withMessage('Ingrese el tiempo de cocción')
                .isInt({ min: 10, max: 60 }).withMessage('Debe de ser un minimo de 10 minutos y maximo de 60'),
            check('description')
                .not().isEmpty().withMessage('Ingrese una descripción')
                .trim()
                .isLength({ min: 20, max: 100 }).withMessage('Ingrese un mínimo de 20 o máximo de 100 caracteres para la descripción')
        ], productController.postNewProduct)

        this.router.get('/getAllProductsPage', [checkJWT.checkJWT, checkRole(['M'])], productController.getAllProductsPage)
        this.router.get('/getAllProductsByRestaurant', [checkJWT.checkJWT, checkRole(['M'])], productController.getAllProductsByRestaurant)
        this.router.post('/getProductByIdByRestaurant', [checkJWT.checkJWT, checkRole(['M', 'CA'])], productController.getProductByIdByRestaurant)
        this.router.delete('/deleteProductByIdByRestaurant/:id', [checkJWT.checkJWT, checkRole(['M'])], productController.deleteProductByIdByRestaurant)
        this.router.get('/editProductByIdPage/:id', [checkJWT.checkJWT, checkRole(['M'])], productController.editProductByIdPage)
        this.router.patch('/editProductByIdByRestaurant/:id', [checkJWT.checkJWT, checkRole(['M'])], upload.single('image'), [
            //Validations
            check('name')
                .not().isEmpty().withMessage('Ingrese el nombre del producto')
                .trim()
                .isLength({ min: 0, max: 20 }),
            check('cost')
                .not().isEmpty().withMessage('Ingrese el costo del producto')
                .isFloat({ min: 0, max: 499 }).withMessage('Ingrese solo numeros y el valor no puede exceder de $500'),
            check('price')
                .not().isEmpty().withMessage('Ingrese el precio de venta del producto')
                .isFloat({ min: 0, max: 499 }).withMessage('Ingrese solo numeros y el valor no puede exceder de $500'),
            check('cookingtime')
                .not().isEmpty().withMessage('Ingrese el tiempo de cocción')
                .isInt({ min: 10, max: 60 }).withMessage('Debe de ser un minimo de 10 minutos y maximo de 60'),
            check('description')
                .not().isEmpty().withMessage('Ingrese una descripción')
                .trim()
                .isLength({ min: 20, max: 100 }).withMessage('Ingrese un mínimo de 20 o máximo de 100 caracteres para la descripción')
        ], productController.editProductByIdByRestaurant)
    }
}

const productRoutes = new ProductRoutes()
export default productRoutes.router