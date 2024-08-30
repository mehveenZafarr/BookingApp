import express from 'express';
import { getAllPlaces, getPlace, addPlace, updatePlace, getPlaces} from '../controllers/placesController.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

router.post('/addPlace', protectRoute, addPlace);
router.put('/updatePlace/:id', protectRoute, updatePlace);
router.get('/getAllPlaces', protectRoute, getAllPlaces);
router.get('/getPlace/:id', getPlace);
router.get('/getPlaces', getPlaces);

export default router