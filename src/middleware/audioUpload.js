import multer from 'multer';
import path from 'path';

// Configure storage for uploaded audio files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/audios/'); // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const audioFileFilter = (req, file, cb) => {
  // Accept only audio files
  if (file.mimetype.startsWith('audio/')) {
    cb(null, true);
  } else {
    cb(new Error('Only audio files are allowed!'), false);
  }
};

const upload = multer({ storage, fileFilter: audioFileFilter });

export default upload;
