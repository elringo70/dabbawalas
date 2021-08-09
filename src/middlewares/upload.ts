import { Request, Response, NextFunction } from 'express'
import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, uuidv4() + file.originalname);
    }
})

export const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        if (
            file.mimetype == "image/png"
            || file.mimetype == "image/jpg"
            || file.mimetype == "image/jpeg"
            || file.mimetype == "image/webp"
        ) {
            cb(null, true)
        } else {
            cb(null, false)
        }
    }
})