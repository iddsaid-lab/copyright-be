import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Audio = sequelize.define('Audio', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  artistId: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  fileUrl: { type: DataTypes.STRING, allowNull: false },
  hash: { type: DataTypes.STRING },
  isLicensed: { type: DataTypes.BOOLEAN, defaultValue: false },
  licensePrice: { type: DataTypes.FLOAT },
  allowLicensing: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  timestamps: true,
});

export default Audio;
