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
        this.router.post('/postNewProduct', [checkJWT.checkJWT, checkRole(['M'])], [
            //Validations
            check('name')
                .trim()
                .not().isEmpty().withMessage('Ingrese el nombre del producto')
                .isLength({ min: 0, max: 20 }),
            check('cost')
                .trim()
                .isFloat({ min: 0, max: 499 }).withMessage('Ingrese solo numeros y el valor no puede exceder de $500'),
            check('price')
                .trim()
                .isFloat({ min: 0, max: 499 }).withMessage('Ingrese solo numeros y el valor no puede exceder de $500'),
            check('image')
                .not().isEmpty().withMessage('Por favor ingrese la imagen del producto'),
        ], upload.single('image'), productController.postNewProduct)

        this.router.get('/getAllProductsPage', [checkJWT.checkJWT, checkRole(['M'])], productController.getAllProductsPage)
        this.router.get('/getAllProductsByRestaurant', [checkJWT.checkJWT, checkRole(['M'])], productController.getAllProductsByRestaurant)
        this.router.post('/getProductByIdByRestaurant', [checkJWT.checkJWT, checkRole(['M'])], productController.getProductByIdByRestaurant)
        this.router.delete('/deleteProductByIdByRestaurant/:id', [checkJWT.checkJWT, checkRole(['M'])], productController.deleteProductByIdByRestaurant)
        this.router.get('/editProductByIdPage/:id', [checkJWT.checkJWT, checkRole(['M'])], productController.editProductByIdPage)
        this.router.patch('/editProductByIdByRestaurant/:id', [checkJWT.checkJWT, checkRole(['M'])], upload.single('image'), productController.editProductByIdByRestaurant)
    }
}

const productRoutes = new ProductRoutes()
export default productRoutes.router