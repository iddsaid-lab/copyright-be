import { Payment } from '../../models/index.js';
import { generatePaymentNumber } from '../../utils/paymentUtils.js';

export async function createPayment(req, res, next) {
  try {
    const { copyrightRequestId, amount } = req.body;
    if (!copyrightRequestId || !amount) return res.status(400).json({ error: 'Missing required fields' });
    const paymentNumber = generatePaymentNumber();
    const payment = await Payment.create({ copyrightRequestId, amount, paymentNumber, status: 'pending' });
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
