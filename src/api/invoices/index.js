import express from 'express';
import { authenticate, authorizeRoles } from '../../middleware/auth.js';
import { createInvoice, getInvoicesByArtist, payInvoice } from './routes.js';

const router = express.Router();

// Cashier creates invoice for an artist
router.post('/', authenticate, authorizeRoles('cashier'), createInvoice);

// Artist fetches their invoices
router.get('/artist/:artistId', authenticate, authorizeRoles('artist'), getInvoicesByArtist);

// Artist/cashier marks invoice as paid
router.post('/:id/pay', authenticate, authorizeRoles('artist', 'cashier'), payInvoice);

export default router;
