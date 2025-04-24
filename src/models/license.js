import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const License = sequelize.define('License', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  audioId: { type: DataTypes.INTEGER, allowNull: false },
  requesterId: { type: DataTypes.INTEGER, allowNull: false },
  ownerId: { type: DataTypes.INTEGER, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  status: { type: DataTypes.ENUM('pending', 'approved', 'rejected', 'paid', 'completed'), defaultValue: 'pending' },
  blockchainTx: { type: DataTypes.STRING },
  certificateUrl: { type: DataTypes.STRING },
}, {
  timestamps: true,
});

export default License;
