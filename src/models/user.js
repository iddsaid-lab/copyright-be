import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('artist', 'manager', 'officer', 'cashier'), allowNull: false },
  fullName: { type: DataTypes.STRING, allowNull: false },
  dateOfBirth: { type: DataTypes.STRING },
  address: { type: DataTypes.STRING },
  phoneNumber: { type: DataTypes.STRING },
  nationalIdNumber: { type: DataTypes.STRING },
  passportNumber: { type: DataTypes.STRING },
  previousWorkUrl: { type: DataTypes.STRING },
  walletAddress: { type: DataTypes.STRING },
  isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
  verifiedBy: { type: DataTypes.INTEGER, allowNull: true }, // User ID of the verifier
}, {
  timestamps: true,
});

export default User;
