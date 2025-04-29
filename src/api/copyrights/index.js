import express from 'express';
import { authenticate, authorizeRoles } from '../../middleware/auth.js';
import { 
  submitCopyrightRequest, 
  getMyCopyrightRequests, 
  getAllCopyrightRequests, 
  processCopyrightRequest, 
  renewCopyrightRequest, 
  escalateCopyrightRequest, 
  approveCopyrightPayment,
  getAllCopyrightsWithAudio,
  getCopyrightDetailsById
} from './routes.js';

const router = express.Router();

// Artist submits copyright request
import upload from '../../middleware/audioUpload.js';
router.post('/submit', authenticate, authorizeRoles('artist'), upload.single('audio'), submitCopyrightRequest);
router.get('/my', authenticate, getMyCopyrightRequests);

// Admin/Cashier/Officer endpoints
router.get('/all', authenticate, authorizeRoles('manager', 'officer', 'cashier'), getAllCopyrightRequests);

// New endpoint to get all copyright requests with their associated audio data
router.get('/with-audio', authenticate, authorizeRoles('manager', 'officer', 'cashier'), getAllCopyrightsWithAudio);
router.post('/process/:id', authenticate, authorizeRoles('manager', 'officer', 'cashier'), processCopyrightRequest);
router.post('/escalate/:id', authenticate, authorizeRoles('officer'), escalateCopyrightRequest);

// Renewal
router.post('/renew/:id', authenticate, authorizeRoles('artist'), renewCopyrightRequest);

// Approve copyright payment
router.post('/approve-payment/:id', authenticate, authorizeRoles('cashier', 'admin'), approveCopyrightPayment);

// Endpoint to get copyright and its audio and artist details by copyrightId
router.get('/details/:copyrightId', authenticate, authorizeRoles('manager', 'officer', 'cashier', 'artist'), getCopyrightDetailsById);

export default router;
