import multer from 'multer';
import path from 'path'
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

const uniqueId = uuidv4();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadPath = path.join(__dirname, '..', 'uploads');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        return cb(
            null,
            `photo${Date.now()}${path.extname(file.originalname).toLowerCase()}`
            // `${uniqueId}_${file.originalname}`
        );
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            return cb(new Error('Error: Only images (JPEG, JPG, PNG) are allowed!'));
        }
    }
});

export default upload;