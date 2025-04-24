import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Payment = sequelize.define('Payment', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  copyrightRequestId: { type: DataTypes.INTEGER, allowNull: false },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  status: { type: DataTypes.ENUM('pending', 'approved', 'rejected', 'paid'), defaultValue: 'pending' },
  paymentNumber: { type: DataTypes.STRING },
  paidAt: { type: DataTypes.DATE },
}, {
  timestamps: true,
});

export default Payment;
