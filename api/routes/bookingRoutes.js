import express from 'express';
import { makeBooking, getAllBookings, getSelectedBooking } from '../controllers/bookingController.js';
import {protectRoute} from '../middleware/protectRoute.js'

const router = express.Router();

router.post('/makeBooking', protectRoute, makeBooking);
router.get('/getAllBookings', protectRoute, getAllBookings);
router.get('/getSelectedBooking/:id', getSelectedBooking);

export default router;