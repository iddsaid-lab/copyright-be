import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Artist = sequelize.define('Artist', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  bio: { type: DataTypes.TEXT },
  country: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  profilePic: { type: DataTypes.STRING },
}, {
  timestamps: true,
});

export default Artist;
