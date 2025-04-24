import express from 'express';
import { authenticate, authorizeRoles } from '../../middleware/auth.js';
import { requestLicense, approveLicense, getLicenses, ownerApproveLicense, cashierApproveLicensePayment, finalizeLicense } from './routes.js';
import { listMyLicenses, downloadLicenseCertificate } from './user.js';

const router = express.Router();

router.post('/request', authenticate, authorizeRoles('artist'), requestLicense);
// Owner approves/denies
router.post('/owner-approve/:id', authenticate, authorizeRoles('artist'), ownerApproveLicense);
// Cashier processes payment
router.post('/cashier-approve/:id', authenticate, authorizeRoles('cashier'), cashierApproveLicensePayment);
// Final verification/blockchain
router.post('/finalize/:id', authenticate, authorizeRoles('manager', 'officer'), finalizeLicense);
router.post('/approve/:id', authenticate, authorizeRoles('manager', 'officer'), approveLicense);
router.get('/all', authenticate, getLicenses);
// List my licenses
router.get('/my', authenticate, listMyLicenses);
// Download license certificate (stub)
router.get('/:id/certificate', authenticate, downloadLicenseCertificate);

export default router;
