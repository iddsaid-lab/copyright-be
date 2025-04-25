import express from 'express';
import { authenticate, authorizeRoles } from '../../middleware/auth.js';
import { submitCopyrightRequest, getMyCopyrightRequests, getAllCopyrightRequests, processCopyrightRequest, renewCopyrightRequest,escalateCopyrightRequest } from './routes.js';

const router = express.Router();

// Artist submits copyright request
import upload from '../../middleware/audioUpload.js';
router.post('/submit', authenticate, authorizeRoles('artist'), upload.single('audio'), submitCopyrightRequest);
router.get('/my', authenticate, getMyCopyrightRequests);

// Admin/Cashier/Officer endpoints
router.get('/all', authenticate, authorizeRoles('manager', 'officer', 'cashier'), getAllCopyrightRequests);

// New endpoint to get all copyright requests with their associated audio data
import { getAllCopyrightsWithAudio } from './routes.js';
router.get('/with-audio', authenticate, authorizeRoles('manager', 'officer', 'cashier'), getAllCopyrightsWithAudio);
router.post('/process/:id', authenticate, authorizeRoles('manager', 'officer', 'cashier'), processCopyrightRequest);
router.post('/escalate/:id', authenticate, authorizeRoles('officer'), escalateCopyrightRequest);

// Renewal
router.post('/renew/:id', authenticate, authorizeRoles('artist'), renewCopyrightRequest);

export default router;
