import { Router } from 'express'
import { productController } from '../controllers/products.controllers'
import checkJWT from '../middlewares/jwt'
import { check } from 'express-validator'
import { upload } from '../middlewares/upload'

class ProductRoutes {
    public router: Router

    constructor() {
        this.router = Router()
        this.config()
    }

    private config() {
        this.router.get('/getNewProductPage', checkJWT.checkJWT, productController.getNewProductPage)

        //Post new product 
        this.router.post('/postNewProduct', checkJWT.checkJWT, [
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

        this.router.get('/getAllProductsByRestaurant', checkJWT.checkJWT, productController.getAllProductsPage)
        /* 
        this.router.get('/:id', productController.getProductById)
        this.router.patch('/:id', upload.single('image'), productController.updateProductById)
        this.router.delete('/:id', productController.deleteProductById) */
    }
}

const productRoutes = new ProductRoutes()
export default productRoutes.router