import express from 'express';
import { authenticate, authorizeRoles } from '../../middleware/auth.js';
import { createInvoice, getInvoicesByArtist, payInvoice, getInvoicesByArtistAndCopyright } from './routes.js';

const router = express.Router();

// Cashier creates invoice for an artist
router.post('/', authenticate, authorizeRoles('cashier'), createInvoice);

// Artist fetches their invoices
router.get('/artist/:artistId', authenticate, authorizeRoles('artist'), getInvoicesByArtist);

// Artist/cashier marks invoice as paid
router.post('/:id/pay', authenticate, authorizeRoles('artist', 'cashier'), payInvoice);

// Fetch invoices by artist and copyright
router.get('/by-artist-and-copyright', authenticate, authorizeRoles('artist', 'manager', 'officer', 'cashier'), getInvoicesByArtistAndCopyright);

export default router;
