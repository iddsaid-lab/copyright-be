import express from 'express';
import { authenticate, authorizeRoles } from '../../middleware/auth.js';
import { listPendingRequests, cashierApprovePayment, officerProcessRequest, finalApproveCopyright, requestRenewal } from './routes.js';
import { listMyCopyrights, downloadCopyrightCertificate } from './user.js';
import { getCopyrightAuditTrail } from './audit.js';

const router = express.Router();

// Cashier: view all pending copyright requests
router.get('/pending', authenticate, authorizeRoles('cashier'), listPendingRequests);

// Cashier: approve payment and generate payment number
router.post('/:id/approve-payment', authenticate, authorizeRoles('cashier'), cashierApprovePayment);

// Officer: process request after payment
router.post('/:id/process', authenticate, authorizeRoles('officer'), officerProcessRequest);

// Final verifier: approve and push to blockchain
router.post('/:id/final-approve', authenticate, authorizeRoles('manager', 'officer'), finalApproveCopyright);

// Artist: request renewal
router.post('/:id/renew', authenticate, authorizeRoles('artist'), requestRenewal);

// Artist: list my copyrights
router.get('/my', authenticate, authorizeRoles('artist'), listMyCopyrights);
// Artist: download copyright certificate (stub)
router.get('/:id/certificate', authenticate, authorizeRoles('artist'), downloadCopyrightCertificate);

// Audit trail for a copyright request
router.get('/:id/audit', authenticate, authorizeRoles('artist', 'manager', 'officer', 'cashier'), getCopyrightAuditTrail);

export default router;
