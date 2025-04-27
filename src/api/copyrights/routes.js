import { CopyrightRequest, Audio } from '../../models/index.js';
import upload from '../../middleware/audioUpload.js';

// Returns all copyright requests with their associated audio data
export async function getAllCopyrightsWithAudio(req, res, next) {
  try {
    const requests = await CopyrightRequest.findAll();
    const audioIds = requests.map(r => r.audioId).filter(Boolean);
    const audios = await Audio.findAll({ where: { id: audioIds } });
    const audioMap = Object.fromEntries(audios.map(a => [a.id, a]));
    const result = requests.map(r => ({ copyright: r, audio: audioMap[r.audioId] || null }));
    res.json(result);
  } catch (err) { next(err); }
}


// Note: Use this as a route handler with the upload.single('audio') middleware in your route definition
export async function submitCopyrightRequest(req, res, next) {
  try {
    const { type, title, description, allowLicensing, licensingPrice, notes, previousCopyrightId } = req.body;
    let audioId = req.body.audioId;
    let audio;
    // If a file is uploaded, create a new Audio record
    if (req.file) {
      audio = await Audio.create({
        artistId: req.user.id,
        title,
        description,
        fileUrl: `/uploads/audios/${req.file.filename}`,
        allowLicensing: allowLicensing === 'true' || allowLicensing === true,
        licensePrice: licensingPrice ? parseFloat(licensingPrice) : 0
      });
      audioId = audio.id;
    }
    if (!audioId || !type) return res.status(400).json({ error: 'Missing required fields' });
    const reqObj = await CopyrightRequest.create({
      audioId,
      artistId: req.user.id,
      type,
      status: 'pending',
      processedBy: [],
      notes,
      previousCopyrightId: previousCopyrightId || null
    });
    res.status(201).json({ copyrightRequest: reqObj, audio });
  } catch (err) { next(err); }
}

export async function getMyCopyrightRequests(req, res, next) {
  try {
    const requests = await CopyrightRequest.findAll({ where: { artistId: req.user.id } });
    res.json(requests);
  } catch (err) { next(err); }
}

export async function getAllCopyrightRequests(req, res, next) {
  // Existing function unchanged

  try {
    const requests = await CopyrightRequest.findAll();
    res.json(requests);
  } catch (err) { next(err); }
}

// Officer escalates a request to manager for final verification
export async function escalateCopyrightRequest(req, res, next) {
  try {
    const { id } = req.params;
    const { escalationNote } = req.body;
    const reqObj = await CopyrightRequest.findByPk(id);
    if (!reqObj) return res.status(404).json({ error: 'Request not found' });
    if (!['pending', 'processing'].includes(reqObj.status)) return res.status(400).json({ error: 'Only pending or processing requests can be escalated' });
    if (reqObj.paymentStatus !== 'paid') return res.status(400).json({ error: 'Only requests with paymentStatus paid can be escalated' });
    reqObj.status = 'processed';
    reqObj.escalationNote = escalationNote;
    await reqObj.save();
    res.json(reqObj);
  } catch (err) { next(err); }
}

export async function processCopyrightRequest(req, res, next) {
  try {
    const { id } = req.params;
    const { status, paymentStatus, processedBy, blockchainTx, expiryDate } = req.body;
    const reqObj = await CopyrightRequest.findByPk(id);
    if (!reqObj) return res.status(404).json({ error: 'Request not found' });
    // Only allow status change to 'verified' if current status is 'processed' and user is a manager
    if (status === 'verified') {
      if (reqObj.status !== 'processed') {
        return res.status(400).json({ error: 'Request must be processed before final verification' });
      }
      if (!req.user || req.user.role !== 'manager') {
        return res.status(403).json({ error: 'Only managers can final-verify requests' });
      }
      reqObj.status = 'verified';
    } else if (status) {
      reqObj.status = status;
    }
    reqObj.paymentStatus = paymentStatus || reqObj.paymentStatus;
    reqObj.processedBy = processedBy || reqObj.processedBy;
    reqObj.blockchainTx = blockchainTx || reqObj.blockchainTx;
    reqObj.expiryDate = expiryDate || reqObj.expiryDate;
    await reqObj.save();
    res.json(reqObj);
  } catch (err) { next(err); }
}

export async function renewCopyrightRequest(req, res, next) {
  try {
    const { id } = req.params;
    const reqObj = await CopyrightRequest.findByPk(id);
    if (!reqObj) return res.status(404).json({ error: 'Request not found' });
    reqObj.type = 'renewal';
    reqObj.status = 'pending';
    await reqObj.save();
    res.json(reqObj);
  } catch (err) { next(err); }
}


