import { License, Audio } from '../../models/index.js';
import { v4 as uuidv4 } from 'uuid';
export async function requestLicense(req, res, next) {
  try {
    const { audioId, price, ownerId } = req.body;
    if (!audioId || !price || !ownerId) return res.status(400).json({ error: 'Missing required fields' });
    const audio = await Audio.findByPk(audioId);
    if (!audio || !audio.allowLicensing) return res.status(400).json({ error: 'Audio not available for licensing' });
    // Prevent duplicate/pending requests
    const existing = await License.findOne({ where: { audioId, requesterId: req.user.id, status: ['pending', 'approved', 'paid'] } });
    if (existing) return res.status(409).json({ error: 'License request already exists or is pending' });
    const license = await License.create({ audioId, requesterId: req.user.id, ownerId, price, status: 'pending' });
    res.status(201).json(license);
  } catch (err) { next(err); }
}

// Owner approves or denies license
export async function ownerApproveLicense(req, res, next) {
  try {
    const { id } = req.params;
    const { approve } = req.body;
    const license = await License.findByPk(id);
    if (!license) return res.status(404).json({ error: 'License request not found' });
    if (license.ownerId !== req.user.id) return res.status(403).json({ error: 'Not authorized' });
    if (approve) {
      license.status = 'approved';
    } else {
      license.status = 'rejected';
    }
    await license.save();
    res.json(license);
  } catch (err) { next(err); }
}

// Cashier processes payment
export async function cashierApproveLicensePayment(req, res, next) {
  try {
    const { id } = req.params;
    const license = await License.findByPk(id);
    if (!license) return res.status(404).json({ error: 'License request not found' });
    if (license.status !== 'approved') return res.status(400).json({ error: 'License not approved by owner' });
    license.status = 'paid';
    license.paymentNumber = uuidv4();
    license.paidAt = new Date();
    await license.save();
    res.json(license);
  } catch (err) { next(err); }
}

// Final verification and blockchain registration
export async function finalizeLicense(req, res, next) {
  try {
    const { id } = req.params;
    const license = await License.findByPk(id);
    if (!license) return res.status(404).json({ error: 'License request not found' });
    if (license.status !== 'paid') return res.status(400).json({ error: 'License not paid' });
    // Simulate blockchain registration
    license.status = 'completed';
    license.blockchainTx = '0x' + Math.random().toString(16).substring(2, 10);
    license.certificateUrl = `/certificates/license-${license.id}.pdf`;
    await license.save();
    res.json({ message: 'License finalized and registered on blockchain', license });
  } catch (err) { next(err); }
}


export async function approveLicense(req, res, next) {
  try {
    const { id } = req.params;
    const license = await License.findByPk(id);
    if (!license) return res.status(404).json({ error: 'License request not found' });
    license.status = 'approved';
    await license.save();
    res.json(license);
  } catch (err) { next(err); }
}

export async function getLicenses(req, res, next) {
  try {
    const licenses = await License.findAll();
    res.json(licenses);
  } catch (err) { next(err); }
}
