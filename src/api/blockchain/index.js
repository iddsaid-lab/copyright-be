import express from 'express';
import {
  generateWallet,
  registerCopyrightOnChain,
  getCopyrightByHash,
  registerLicenseOnChain,
  isHashRegisteredOnBlockchain,
  verifyOnChain
} from '../../services/blockchainService.js';

const router = express.Router();

// Generate a new Ethereum wallet
router.post('/wallet/new', async (req, res) => {
  try {
    const wallet = await generateWallet();
    res.json(wallet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Register copyright on-chain
router.post('/register', async (req, res) => {
  try {
    const { artist, audioHash, expiryDate, registeredAt, officials } = req.body;
    const result = await registerCopyrightOnChain({ artist, audioHash, expiryDate, registeredAt, officials });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch copyright by audio hash
router.get('/hash/:audioHash', async (req, res) => {
  try {
    const { audioHash } = req.params;
    const result = await getCopyrightByHash(audioHash);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Register license on blockchain
router.post('/license/register', async (req, res) => {
  try {
    const { licenseId, audioId, owner, requester, price } = req.body;
    const result = await registerLicenseOnChain({ licenseId, audioId, owner, requester, price });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Check if a hash is registered on the blockchain
router.get('/hash/:audioHash/exists', async (req, res) => {
  try {
    const { audioHash } = req.params;
    const exists = await isHashRegisteredOnBlockchain(audioHash);
    res.json({ exists });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify a transaction or copyright/license on chain
router.get('/verify/:txHash', async (req, res) => {
  try {
    const { txHash } = req.params;
    const verified = await verifyOnChain(txHash);
    res.json({ verified });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
