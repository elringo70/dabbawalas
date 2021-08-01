import { Router } from 'express'
import { productController } from '../controllers/products.controllers'
import { upload } from '../middlewares/upload'
import checkJWT from '../middlewares/jwt'

class ProductRoutes {
    public router: Router

    constructor() {
        this.router = Router()
        this.config()
    }

    private config() {
        this.router.get('/getNewProductPage', checkJWT.checkJWT, productController.getNewProductPage)
        this.router.post('/postNewProduct', checkJWT.checkJWT, upload.single('image'), productController.postNewProduct)
        this.router.get('/getAllProductsByRestaurant', checkJWT.checkJWT, productController.getAllProductsPage)
        /* 
        this.router.get('/:id', productController.getProductById)
        this.router.patch('/:id', upload.single('image'), productController.updateProductById)
        this.router.delete('/:id', productController.deleteProductById) */
    }
}

const productRoutes = new ProductRoutes()
export default productRoutes.router