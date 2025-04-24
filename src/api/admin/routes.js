import { User } from '../../models/index.js';
import bcrypt from 'bcryptjs';

export async function getAllVerificationRequests(req, res, next) {
  try {
    // All artists who are not verified are pending verification
    const pendingArtists = await User.findAll({ where: { role: 'artist', isVerified: false } });
    res.json(pendingArtists);
  } catch (err) { next(err); }
}


export async function addOfficialUser(req, res, next) {
  try {
    const { email, password, fullName, role } = req.body;
    if (!email || !password || !fullName || !role) return res.status(400).json({ error: 'Missing required fields' });
    if (!['manager', 'officer', 'cashier'].includes(role)) return res.status(400).json({ error: 'Invalid role' });
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email already registered' });
    const hash = await bcrypt.hash(password, 10);
    // Generate blockchain wallet for official
    const { address: walletAddress } = await import('../../services/blockchainService.js').then(m => m.generateWallet());
    const user = await User.create({ email, password: hash, fullName, role, isVerified: true, walletAddress });
    res.status(201).json({ id: user.id, email: user.email, role: user.role, fullName: user.fullName, walletAddress });
  } catch (err) { next(err); }
}

export async function listOfficials(req, res, next) {
  try {
    const officials = await User.findAll({ where: { role: ['manager', 'officer', 'cashier'] } });
    res.json(officials);
  } catch (err) { next(err); }
}

export async function getOfficialById(req, res, next) {
  try {
    const official = await User.findByPk(req.params.id);
    if (!official || !['manager', 'officer', 'cashier'].includes(official.role)) return res.status(404).json({ error: 'Official not found' });
    res.json(official);
  } catch (err) { next(err); }
}

export async function updateOfficial(req, res, next) {
  try {
    const official = await User.findByPk(req.params.id);
    if (!official || !['manager', 'officer', 'cashier'].includes(official.role)) return res.status(404).json({ error: 'Official not found' });
    const { fullName, email, password } = req.body;
    if (fullName) official.fullName = fullName;
    if (email) official.email = email;
    if (password) official.password = await bcrypt.hash(password, 10);
    await official.save();
    res.json(official);
  } catch (err) { next(err); }
}

export async function verifyArtist(req, res, next) {
  try {
    // Only manager or officer can verify
    if (!req.user || !['manager', 'officer'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const artist = await User.findByPk(req.params.id);
    if (!artist || artist.role !== 'artist') return res.status(404).json({ error: 'Artist not found' });
    if (artist.isVerified) return res.status(400).json({ error: 'Artist already verified' });
    // Ensure artist has a blockchain wallet
    if (!artist.walletAddress) {
      const { address } = await import('../../services/blockchainService.js').then(m => m.generateWallet());
      artist.walletAddress = address;
    }
    artist.isVerified = true;
    artist.verifiedBy = req.user.id;
    await artist.save();
    res.json({ message: 'Artist verified', artist: { id: artist.id, email: artist.email, fullName: artist.fullName, walletAddress: artist.walletAddress, verifiedBy: artist.verifiedBy } });
  } catch (err) { next(err); }
}

export async function deleteOfficial(req, res, next) {
  try {
    const official = await User.findByPk(req.params.id);
    if (!official || !['manager', 'officer', 'cashier'].includes(official.role)) return res.status(404).json({ error: 'Official not found' });
    await official.destroy();
    res.json({ message: 'Official deleted' });
  } catch (err) { next(err); }
}
