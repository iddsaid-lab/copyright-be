import express from 'express';
import { authenticate, authorizeRoles } from '../../middleware/auth.js';
import { createPayment, getPayments, approvePayment, submitPaymentReference, reviewPayment } from './routes.js';

const router = express.Router();

router.post('/create', authenticate, authorizeRoles('cashier'), createPayment);
router.get('/all', authenticate, authorizeRoles('manager', 'officer', 'cashier'), getPayments);
router.post('/approve/:id', authenticate, authorizeRoles('cashier'), approvePayment);
// Artist submits payment reference
router.post('/:id/submit-reference', authenticate, authorizeRoles('artist'), submitPaymentReference);
// Cashier reviews payment
router.post('/:id/review', authenticate, authorizeRoles('cashier'), reviewPayment);

export default router;
