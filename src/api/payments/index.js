import express from 'express';
import { authenticate, authorizeRoles } from '../../middleware/auth.js';
import { createPayment, getPayments, approvePayment } from './routes.js';

const router = express.Router();

router.post('/create', authenticate, authorizeRoles('cashier'), createPayment);
router.get('/all', authenticate, authorizeRoles('manager', 'officer', 'cashier'), getPayments);
router.post('/approve/:id', authenticate, authorizeRoles('cashier'), approvePayment);

export default router;
