import express from 'express';
import { authenticate, authorizeRoles } from '../../middleware/auth.js';
import { getAllArtists } from './routes.js';
import { getArtistProfile, updateArtistProfile } from './routes.js';

const router = express.Router();

router.get('/profile', authenticate, authorizeRoles('artist'), getArtistProfile);
router.put('/profile', authenticate, authorizeRoles('artist'), updateArtistProfile);

// Admin/officer/cashier: get all artists
router.get('/all', authenticate, authorizeRoles('manager', 'officer', 'cashier'), getAllArtists);

export default router;
