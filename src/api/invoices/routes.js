import { Invoice } from '../../models/index.js';

function generateInvoiceNumber() {
  const date = new Date();
  const ymd = date.toISOString().slice(0,10).replace(/-/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `INV-${ymd}-${rand}`;
}

export async function createInvoice(req, res, next) {
  try {
    const { copyrightRequestId, artistId, amount, dueDate, paymentMethods } = req.body;
    if (!copyrightRequestId || !artistId || !amount) return res.status(400).json({ error: 'Missing required fields' });
    const invoiceNumber = generateInvoiceNumber();
    const invoice = await Invoice.create({
      invoiceNumber,
      copyrightRequestId,
      artistId,
      amount,
      dueDate,
      paymentMethods,
      status: 'unpaid'
    });
    res.status(201).json(invoice);
  } catch (err) { next(err); }
}

export async function getInvoicesByArtist(req, res, next) {
  try {
    const { artistId } = req.params;
    const invoices = await Invoice.findAll({ where: { artistId } });
    res.json(invoices);
  } catch (err) { next(err); }
}

export async function payInvoice(req, res, next) {
  try {
    const { id } = req.params;
    const { paymentMethod, paymentNumber } = req.body;
    const invoice = await Invoice.findByPk(id);
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    invoice.paymentMethod = paymentMethod;
    invoice.paymentNumber = paymentNumber;
    invoice.status = 'paid';
    await invoice.save();
    res.json(invoice);
  } catch (err) { next(err); }
}
