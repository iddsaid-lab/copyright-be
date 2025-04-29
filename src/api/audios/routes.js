import { Audio } from '../../models/index.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = process.env.UPLOAD_DIR || 'uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

export const uploadAudio = [
  upload.single('audio'),
  async (req, res, next) => {
    try {
      const { title, description, allowLicensing, licensePrice } = req.body;
      if (!req.file) return res.status(400).json({ error: 'No audio file uploaded' });
      const audio = await Audio.create({
        artistId: req.user.id,
        title,
        description,
        fileUrl: req.file.path,
        allowLicensing: allowLicensing === 'true',
        licensePrice: licensePrice ? parseFloat(licensePrice) : null,
      });
      console.log('Audio created:', audio.toJSON());
      // Create CopyrightRequest
      const { CopyrightRequest } = await import('../../models/index.js');
      const copyrightRequest = await CopyrightRequest.create({
        audioId: audio.id,
        artistId: req.user.id,
        type: 'new',
        status: 'pending',
        paymentStatus: 'pending',
        processedBy: [],
      });
      res.status(201).json({ audio, copyrightRequest });
    } catch (err) { next(err); }
  }
];

export async function getMyAudios(req, res, next) {
  try {
    console.log('getMyAudios for user:', req.user);
    // Directly use user id as artistId
    const audios = await Audio.findAll({ where: { artistId: req.user.id } });
    console.log('Audios found:', audios.map(a => a.toJSON()));
    res.json(audios);
  } catch (err) { next(err); }
}

export async function getAllAudios(req, res, next) {
  try {
    const audios = await Audio.findAll();
    res.json(audios);
  } catch (err) { next(err); }
}

export async function getAudioById(req, res, next) {
  try {
    const audio = await Audio.findByPk(req.params.id);
    if (!audio) return res.status(404).json({ error: 'Audio not found' });
    res.json(audio);
  } catch (err) { next(err); }
}

// Update hash for a specific audio by audio id
export async function updateAudioHashById(req, res, next) {
  try {
    const { id, hash } = req.body;
    if (!id || !hash) return res.status(400).json({ error: 'id and hash are required' });
    const [updatedCount] = await Audio.update({ hash }, { where: { id } });
    res.json({ updated: updatedCount });
  } catch (err) { next(err); }
}
