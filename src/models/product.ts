import { pool } from '../utils/database'
import { IProduct } from '../interfaces/IProduct'

export default class Product {
    save(data: IProduct) {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO products SET ?`

            pool.query(query, [data], (error, results) => {
                if (error) reject(error)

                resolve(results)
            })
        })
    }

    static fetchAll(query: string): Promise<IProduct[] | null> {
        return new Promise((resolve, reject) => {
            pool.query(query, (error, results: IProduct[]) => {
                if (error) reject(error)

                resolve(results.length > 0 ? results : null)
            })
        })
    }

    static fetchAllByRestaurant(id: any) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT products.*
                FROM products
                LEFT JOIN restaurants
                ON products.id_restaurant = restaurants.id_restaurant
                WHERE restaurants.id_restaurant = ?
            `

            pool.query(query, [id], (error, results) => {
                if (error) reject(error)

                resolve(results)
            })
        })
    }

    static findById(query: string): Promise<IProduct | null> {
        return new Promise((resolve, reject) => {
            pool.query(query, (error, results: IProduct[]) => {
                if (error) reject(error)

                resolve(results.length === 1 ? results[0] : null)
            })
        })
    }

    static deleteById(product: { id_product: string, id_restaurant: string }) {
        return new Promise((resolve, reject) => {
            const query = `
                DELETE FROM products
                WHERE id_product=${product.id_product}
                AND id_restaurant=${product.id_restaurant}
            `

            pool.query(query, (error, results) => {
                if (error) reject(error)

                resolve(results)
            })
        })
    }

    static updateByRestaurant(product: { id_product: string, id_restaurant: string }, data: any) {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE products SET ? WHERE id_product=? AND id_restaurant=?
            `

            pool.query(query,
                [
                    data,
                    product.id_product,
                    product.id_restaurant
                ],
                (error, results) => {
                    if (error) reject(error)

                    resolve(results)
                })
        })
    }
}