import express from 'express';
import { authenticate, authorizeRoles } from '../../middleware/auth.js';
import { addOfficialUser, listOfficials, getOfficialById, updateOfficial, deleteOfficial, verifyArtist, getAllVerificationRequests } from './routes.js';

const router = express.Router();

router.post('/create-user', authenticate, authorizeRoles('manager'), addOfficialUser);
router.get('/officials', authenticate, authorizeRoles('manager', 'officer'), listOfficials);
router.get('/officials/:id', authenticate, authorizeRoles('manager', 'officer'), getOfficialById);
router.put('/officials/:id', authenticate, authorizeRoles('manager'), updateOfficial);
router.delete('/officials/:id', authenticate, authorizeRoles('manager'), deleteOfficial);

// PATCH /api/admin/verify-artist/:id
router.patch('/verify-artist/:id', authenticate, authorizeRoles('manager', 'officer'), verifyArtist);

// Admin/officer/cashier: get all unverified artist users
router.get('/verifications/all', authenticate, authorizeRoles('manager', 'officer', 'cashier'), getAllVerificationRequests);

export default router;
