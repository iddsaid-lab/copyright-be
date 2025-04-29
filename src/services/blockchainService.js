// This service handles all blockchain-related operations for the copyright system

import { ethers } from 'ethers';
import dotenv from 'dotenv';
dotenv.config();

// Utility: get provider from .env
function getProvider() {
  return new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_PROVIDER_URL);
}

// Utility: get wallet signer from private key (for contract interaction)
function getSigner() {
  return new ethers.Wallet(process.env.BLOCKCHAIN_ADMIN_PRIVATE_KEY, getProvider());
}

// Generate a new Ethereum wallet for an artist
export async function generateWallet() {
  const wallet = ethers.Wallet.createRandom();
  return { address: wallet.address, privateKey: wallet.privateKey };
}

// Professional: Import ABI from local JSON artifact for maintainability
import copyrightArtifact from '../abi/AudioCopyright.json' assert { type: "json" };
const copyrightAbi = copyrightArtifact.abi;


// Register copyright on blockchain (real smart contract interaction)
export async function registerCopyrightOnChain({ artist, audioHash, expiryDate, registeredAt, officials = [] }) {
  const contract = new ethers.Contract(process.env.COPYRIGHT_CONTRACT_ADDRESS, copyrightAbi, getSigner());
  const tx = await contract.registerCopyright(artist, audioHash, expiryDate, registeredAt, officials);
  await tx.wait();
  return { txHash: tx.hash, status: 'success' };
}

// Fetch copyright info by audio hash from blockchain
export async function getCopyrightByHash(audioHash) {
  const contract = new ethers.Contract(process.env.COPYRIGHT_CONTRACT_ADDRESS, copyrightAbi, getProvider());
  const copyrightId = await contract.getCopyrightId(audioHash);
  const copyright = await contract.getCopyright(copyrightId);
  return copyright;
}

// Register license on blockchain (stub for smart contract interaction)
export async function registerLicenseOnChain({ licenseId, audioId, owner, requester, price }) {
  // Example: interact with deployed smart contract
  // const contract = new ethers.Contract(process.env.LICENSE_CONTRACT_ADDRESS, licenseAbi, getSigner());
  // const tx = await contract.registerLicense(licenseId, audioId, owner, requester, price);
  // await tx.wait();
  // return { txHash: tx.hash, status: 'success' };
  return { txHash: '0x456', status: 'mocked' };
}

// Check if a hash is registered on the blockchain
export async function isHashRegisteredOnBlockchain(audioHash) {
  const contract = new ethers.Contract(process.env.COPYRIGHT_CONTRACT_ADDRESS, copyrightAbi, getProvider());
  const copyrightId = await contract.getCopyrightId(audioHash);
  return copyrightId.toString() !== "0";
}

// Utility: verify a copyright/license on chain (stub)
export async function verifyOnChain(txHash) {
  // Example: use provider.getTransactionReceipt(txHash)
  // const receipt = await getProvider().getTransactionReceipt(txHash);
  // return receipt && receipt.status === 1;
  return true;
}
