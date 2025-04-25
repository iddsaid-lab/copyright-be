import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const CopyrightRequest = sequelize.define('CopyrightRequest', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  audioId: { type: DataTypes.INTEGER, allowNull: false },
  artistId: { type: DataTypes.INTEGER, allowNull: false },
  type: { type: DataTypes.ENUM('new', 'renewal'), allowNull: false },
  status: { type: DataTypes.ENUM('pending', 'payment', 'processing', 'preVerified', 'verified', 'rejected', 'completed'), defaultValue: 'pending' },
  paymentStatus: { type: DataTypes.ENUM('pending', 'paid'), defaultValue: 'pending' },
  processedBy: { type: DataTypes.JSON }, // officials who processed
  blockchainTx: { type: DataTypes.STRING },
  expiryDate: { type: DataTypes.DATE },
  escalationNote: { type: DataTypes.STRING },
}, {
  timestamps: true,
});

export default CopyrightRequest;
