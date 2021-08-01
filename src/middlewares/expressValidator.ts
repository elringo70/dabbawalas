import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'

export function validationRequest(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req)

    console.log(errors.array())
    
    if (!errors.isEmpty()) {
        console.log(errors.array())
    }
    next()
}