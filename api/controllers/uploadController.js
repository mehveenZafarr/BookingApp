import imageDownloader from 'image-downloader';
import { fileURLToPath } from 'url';
import path, { dirname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import Place from '../models/Place.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const uploadByLink = async (req, res) => {
    try {
        const { photoLink } = req.body;
        const newName = `photo${Date.now()}.jpg`;
        const destination = join(__dirname, '..', 'uploads', newName)
        const pic = await imageDownloader.image({
            url: photoLink,
            dest: destination
        });
        console.log("Pic: ", pic);
        res.status(200).json(newName);
    } catch (error) {
        res.status(500).json({ error: "=> Upload failed! " + error.message });
    }
}

export const uploadFromDevice = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(404).json({ error: 'No files Uploaded!' });
        }
        const uploadedFiles = req.files.map(file => ({
            filename: file.filename,
            path: `../uploads/${file.filename}`
        }));
        res.status(200).json({ uploadedFiles });
    } catch (error) {
        res.status(500).json({ error: "An error occured during the upload! " + error.message });
    }
}