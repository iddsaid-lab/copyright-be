import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../../models/index.js';

export async function register(req, res, next) {
  try {
    const {
      fullName,
      email,
      password,
      confirmPassword,
      dateOfBirth,
      address,
      phoneNumber,
      nationalIdNumber,
      passportNumber,
      previousWorkUrl,
      agreement,
      role = 'artist'
    } = req.body;

    // Validate required fields
    if (!fullName || !email || !password || !confirmPassword || !dateOfBirth || !address || !phoneNumber || !nationalIdNumber || agreement !== true) {
      return res.status(400).json({ error: 'Missing or invalid required fields' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }
    // Check if user is at least 18 years old
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    if (isNaN(birthDate.getTime()) || age < 18 || (age === 18 && today < new Date(birthDate.setFullYear(today.getFullYear())))) {
      return res.status(400).json({ error: 'You must be at least 18 years old' });
    }
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email already registered' });
    const hash = await bcrypt.hash(password, 10);
    let walletAddress = undefined;
    if (role !== 'artist') {
      // Only generate wallet for officials (not artists)
      const wallet = await import('../../services/blockchainService.js').then(m => m.generateWallet());
      walletAddress = wallet.address;
    }
    const user = await User.create({
      fullName,
      email,
      password: hash,
      role,
      dateOfBirth,
      address,
      phoneNumber,
      nationalIdNumber,
      passportNumber,
      previousWorkUrl,
      walletAddress,
      isVerified: false,
    });
    res.status(201).json({ message: 'Registration successful', user: { id: user.id, email: user.email, role: user.role, fullName: user.fullName } });
  } catch (err) { next(err); }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    res.json({ token, user: { id: user.id, email: user.email, role: user.role, fullName: user.fullName } });
  } catch (err) { next(err); }
}

export async function getProfile(req, res, next) {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ id: user.id, email: user.email, role: user.role, fullName: user.fullName, walletAddress: user.walletAddress });
  } catch (err) { next(err); }
}
