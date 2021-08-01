import { Request, Response } from 'express'

class Error404 {
    get404Page(req: Request, res: Response) {
        res.status(404).render('404', {
            title: 'Error 404. Página no encontrada'
        })
    }
}

export const error404 = new Error404()