import express from 'express';
import { authenticate, authorizeRoles } from '../../middleware/auth.js';
import { uploadAudio, getMyAudios, getAudioById, getAllAudios } from './routes.js';

const router = express.Router();

function requireVerifiedArtist(req, res, next) {
  if (!req.user || req.user.role !== 'artist' || !req.user.isVerified) {
    return res.status(403).json({ error: 'Artist not verified' });
  }
  next();
}

router.post('/upload', authenticate, authorizeRoles('artist'), uploadAudio);
router.get('/my', authenticate, authorizeRoles('artist'), getMyAudios);
router.get('/:id', authenticate, getAudioById);

// Admin/officer/cashier: get all audios
router.get('/all', authenticate, authorizeRoles('manager', 'officer', 'cashier'), getAllAudios);

export default router;
