import { CopyrightRequest, Payment, User } from '../../models/index.js';
import { v4 as uuidv4 } from 'uuid';

export async function listPendingRequests(req, res, next) {
  try {
    const requests = await CopyrightRequest.findAll({
      where: { status: 'pending', paymentStatus: 'pending' },
      include: ['audio', 'artist'],
    });
    res.json(requests);
  } catch (err) { next(err); }
}

export async function cashierApprovePayment(req, res, next) {
  try {
    const request = await CopyrightRequest.findByPk(req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found' });
    if (request.paymentStatus !== 'pending') return res.status(400).json({ error: 'Payment already processed' });
    // Generate payment number
    const paymentNumber = uuidv4();
    const payment = await Payment.create({
      copyrightRequestId: request.id,
      amount: 100.0, // TODO: dynamically determine amount
      status: 'approved',
      paymentNumber,
      paidAt: null,
    });
    request.paymentStatus = 'paid';
    request.status = 'payment';
    // Record cashier in processedBy
    let processedBy = request.processedBy || [];
    processedBy.push({ role: 'cashier', userId: req.user.id, action: 'approve-payment', date: new Date() });
    request.processedBy = processedBy;
    await request.save();
    res.json({ message: 'Payment approved', payment });
  } catch (err) { next(err); }
}

import { Audio } from '../../models/index.js';
import { extractAudioFeaturesAndHash } from '../../services/aiFeatureExtraction.js';
import { isHashRegisteredOnBlockchain } from '../../services/blockchainService.js';

export async function officerProcessRequest(req, res, next) {
  try {
    const request = await CopyrightRequest.findByPk(req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found' });
    if (request.paymentStatus !== 'paid') return res.status(400).json({ error: 'Payment not complete' });
    // Get audio
    const audio = await Audio.findByPk(request.audioId);
    if (!audio) return res.status(404).json({ error: 'Audio not found' });
    // AI feature extraction
    const { hash } = await extractAudioFeaturesAndHash(audio.fileUrl);
    // Check for duplicate hash in blockchain
    const isDuplicate = await isHashRegisteredOnBlockchain(hash);
    let processedBy = request.processedBy || [];
    if (isDuplicate) {
      request.status = 'rejected';
      processedBy.push({ role: 'officer', userId: req.user.id, action: 'reject-duplicate', date: new Date() });
      request.processedBy = processedBy;
      await request.save();
      return res.status(409).json({ error: 'Duplicate audio detected', hash });
    }
    // Update audio with hash
    audio.hash = hash;
    await audio.save();
    // Escalate request for final verification
    request.status = 'verified';
    processedBy.push({ role: 'officer', userId: req.user.id, action: 'verify', date: new Date() });
    request.processedBy = processedBy;
    await request.save();
    res.json({ message: 'Audio verified and ready for final blockchain registration', hash, request });
  } catch (err) { next(err); }
}

// Final verifier: push to blockchain and complete copyright
// Artist requests renewal
export async function requestRenewal(req, res, next) {
  try {
    const request = await CopyrightRequest.findByPk(req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found' });
    if (request.status !== 'completed') return res.status(400).json({ error: 'Only completed copyrights can be renewed' });
    const now = new Date();
    const expiry = new Date(request.expiryDate);
    // Allow renewal if within 1 year of expiry or expired
    const oneYear = 365 * 24 * 60 * 60 * 1000;
    if (expiry - now > oneYear && expiry > now) return res.status(400).json({ error: 'Too early to renew' });
    // Create renewal request
    const { CopyrightRequest } = await import('../../models/index.js');
    const renewal = await CopyrightRequest.create({
      audioId: request.audioId,
      artistId: request.artistId,
      type: 'renewal',
      status: 'pending',
      paymentStatus: 'pending',
      processedBy: [],
    });
    res.status(201).json({ message: 'Renewal request submitted', renewal });
  } catch (err) { next(err); }
}

export async function finalApproveCopyright(req, res, next) {
  try {
    const request = await CopyrightRequest.findByPk(req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found' });
    if (request.status !== 'verified') return res.status(400).json({ error: 'Request not ready for final approval' });
    // Gather data for blockchain registration
    const { User, Audio } = await import('../../models/index.js');
    const { registerCopyrightOnChain } = await import('../../services/blockchainService.js');
    const artist = await User.findByPk(request.artistId);
    const audio = await Audio.findByPk(request.audioId);
    // Officials are those in processedBy with role 'officer'
    const processedBy = request.processedBy || [];
    const officialIds = processedBy.filter(p => p.role === 'officer').map(p => p.userId);
    const officials = (await User.findAll({ where: { id: officialIds } })).map(u => u.walletAddress).filter(Boolean);
    // Set expiry date 50 years from now if not already set
    let expiryDate = request.expiryDate ? new Date(request.expiryDate) : new Date();
    if (!request.expiryDate) expiryDate.setFullYear(expiryDate.getFullYear() + 50);
    // Register on blockchain
    let blockchainTx = null;
    try {
      const result = await registerCopyrightOnChain({
        artist: artist.walletAddress,
        audioHash: audio.hash,
        expiryDate: Math.floor(expiryDate.getTime() / 1000), // Unix timestamp
        registeredAt: Math.floor(Date.now() / 1000), // Current time as Unix timestamp
        officials
      });
      blockchainTx = result.txHash;
      request.status = 'completed';
      request.blockchainTx = blockchainTx;
      processedBy.push({ role: 'finalVerifier', userId: req.user.id, action: 'final-approve', date: new Date() });
      request.processedBy = processedBy;
      request.expiryDate = expiryDate;
      await request.save();
      res.json({ message: 'Copyright registered on blockchain', blockchainTx, request });
    } catch (err) {
      return res.status(500).json({ error: 'Blockchain registration failed', details: err.message });
    }
  } catch (err) { next(err); }
}

