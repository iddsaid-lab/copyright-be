import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { sequelize } from './config/db.js';
import authRoutes from './api/auth/index.js';
import artistRoutes from './api/artists/index.js';
import audioRoutes from './api/audios/index.js';
import copyrightRoutes from './api/copyrights/index.js';
import copyrightRequestRoutes from './api/copyrightRequests/index.js';
import paymentRoutes from './api/payments/index.js';
import licensingRoutes from './api/licensing/index.js';
import adminRoutes from './api/admin/index.js';
import blockchainRoutes from './api/blockchain/index.js';
import { errorHandler } from './middleware/errorHandler.js';

// Load env vars
dotenv.config();

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from /uploads/audios
// Allow CORS for static audio files
app.use('/uploads/audios', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080'); // Set to '*' to allow all, or restrict as needed
  res.header('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});
app.use('/uploads/audios', express.static(path.join(__dirname, '../uploads/audios')));
app.use(morgan('dev'));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/artists', artistRoutes);
app.use('/api/audios', audioRoutes);
app.use('/api/copyrights', copyrightRoutes);
app.use('/api/copyright-requests', copyrightRequestRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/licensing', licensingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/blockchain', blockchainRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Error handler
app.use(errorHandler);

// Start server after DB connection
const PORT = process.env.PORT || 4000;
if (process.env.NODE_ENV === 'development') {
  sequelize.sync({ alter: true }).then(() => {
    app.listen(PORT, () => {
      console.log('Backend server running on port ' + PORT + ' (auto-sync enabled)');
    });
  });
} else {
  sequelize.sync().then(() => {
    app.listen(PORT, () => {
      console.log('Backend server running on port ' + PORT);
    });
  });
}
