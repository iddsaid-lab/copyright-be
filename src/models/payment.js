import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Payment = sequelize.define('Payment', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  copyrightRequestId: { type: DataTypes.INTEGER, allowNull: false },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  status: { type: DataTypes.ENUM('pending', 'awaiting_verification', 'paid', 'approved', 'rejected'), defaultValue: 'pending' },
  paymentMethod: { type: DataTypes.STRING }, // e.g., 'mpesa', 'bank'
  paymentNumber: { type: DataTypes.STRING }, // e.g., till number, bank account
  paymentReference: { type: DataTypes.STRING }, // artist's confirmation code
  paidAt: { type: DataTypes.DATE },
}, {
  timestamps: true,
});

export default Payment;
