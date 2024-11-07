import multer from "multer";
import { v4 as uuidv4 } from 'uuid';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/images/");
    },
    filename: (req, file, cb) => {
        const fileType = file.mimetype.split('/')[1];
        cb(null, uuidv4() + "." + fileType);
    }
});

export const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
            cb(null, true);
        } else {
            cb(null, false);
        }
    }
});