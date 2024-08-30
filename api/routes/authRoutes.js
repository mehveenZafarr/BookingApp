import express from 'express';
import { registerUser, getMe, loginUser, logoutUser } from '../controllers/authController.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

router.get('/me', protectRoute, getMe);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
export default router;
// router.post("/", registerUser);
// router.post('/', registerUser);