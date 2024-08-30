import express from 'express';
import { uploadByLink, uploadFromDevice } from '../controllers/uploadController.js';
import upload from '../middleware/uploadPhoto.js';

const router = express.Router();

router.post('/upload-by-link', uploadByLink);
router.post('/uploadFromDevice', upload.array('photos', 100), uploadFromDevice);

export default router