import { Payment } from '../../models/index.js';
import { generatePaymentNumber } from '../../utils/paymentUtils.js';

export async function createPayment(req, res, next) {
  try {
    const { copyrightRequestId, amount, paymentMethod, paymentNumber } = req.body;
    if (!copyrightRequestId || !amount || !paymentMethod || !paymentNumber)
      return res.status(400).json({ error: 'Missing required fields' });
    // Prevent duplicate payment for the same copyright
    const existing = await Payment.findOne({ where: { copyrightRequestId } });
    if (existing) return res.status(400).json({ error: 'Payment already exists for this copyright request' });
    const payment = await Payment.create({
      copyrightRequestId,
      amount,
      paymentMethod,
      paymentNumber,
      status: 'pending'
    });
    res.status(201).json(payment);
  } catch (err) { next(err); }
}

export async function getPayments(req, res, next) {
  try {
    const payments = await Payment.findAll();
    res.json(payments);
  } catch (err) { next(err); }
}

export async function approvePayment(req, res, next) {
  try {
    const { id } = req.params;
    const payment = await Payment.findByPk(id);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    payment.status = 'approved';
    payment.paidAt = new Date();
    await payment.save();
    res.json(payment);
  } catch (err) { next(err); }
}

// Artist submits payment reference
export async function submitPaymentReference(req, res, next) {
  try {
    const { id } = req.params;
    const { paymentReference } = req.body;
    const payment = await Payment.findByPk(id);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    if (payment.status !== 'pending') return res.status(400).json({ error: 'Payment is not pending' });
    payment.paymentReference = paymentReference;
    payment.status = 'awaiting_verification';
    await payment.save();
    res.json(payment);
  } catch (err) { next(err); }
}

// Cashier approves or rejects payment
export async function reviewPayment(req, res, next) {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'approve' or 'reject'
    const payment = await Payment.findByPk(id);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    if (payment.status !== 'awaiting_verification') return res.status(400).json({ error: 'Payment is not awaiting verification' });
    if (action === 'approve') {
      payment.status = 'paid';
      payment.paidAt = new Date();
    } else if (action === 'reject') {
      payment.status = 'rejected';
    } else {
      return res.status(400).json({ error: 'Invalid action' });
    }
    await payment.save();
    res.json(payment);
  } catch (err) { next(err); }
}
