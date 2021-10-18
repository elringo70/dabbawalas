import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, uuidv4() + file.originalname);
    }
})

export const upload = multer({
    storage,
    limits: {
        fieldNameSize: 300,
        fileSize: 1048576,
    },
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